const arg = require("arg");
const checkLinks = require("check-links");
const got = require("got").get;
const ms = require("ms");
const pkg = require("./package.json");

const envs = new Map();
envs.set("dev", "https://fx-breach-alerts.herokuapp.com");
envs.set("stage", "https://blurts-server.stage.mozaws.net");
envs.set("prod", "https://monitor.firefox.com");

function args() {
  const flags = arg(
    {
      "--env": String,
      "--server": String,
      "--since": String
    },
    { permissive: true }
  );

  if (flags["--env"]) {
    const env = flags["--env"];
    switch (env) {
      case "l10n":
      case "dev":
      case "development":
        flags["--server"] = envs.get("dev");
        break;
      case "stage":
        flags["--server"] = envs.get("stage");
        break;
      case "prod":
      case "production":
        flags["--sever"] = envs.get("prod");
        break;
      default:
        // eslint-disable-next-line no-console
        console.error(`Unknown --env: ${env}`);
    }
  }

  return {
    server: flags["--server"] || envs.get("prod"),
    since: flags["--since"] || flags._[0] || "-7d"
  };
}

async function getBreaches(
  modifiedSince = "-1w",
  server = envs.get("prod")
) {
  const now = new Date();
  const BREACH_API_URL = `${server}/hibp/breaches`;
  const BREACH_VERSION_URL = `${server}/__version__`;
  const sinceMs = Math.abs(ms(modifiedSince));
  const sinceDate = new Date(now - sinceMs);
  const res = await got(BREACH_API_URL, {
    headers: {
      "user-agent": `${pkg.name}/${pkg.version}`,
      "if-modified-since": sinceDate.toUTCString()
    },
    json: true
  });

  let __version;
  try {
    __version = (await got(BREACH_VERSION_URL, { json: true })).body;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`${err.message}: ${BREACH_VERSION_URL}`);
  }

  // Assume we have no recent breaches. If we get a non "304" status code from the remote server these values will be updated below.
  let breaches = [];
  let missingLogos = [];

  if (res.statusCode !== 304 && res.body) {
    breaches = res.body.filter(
      ({ ModifiedDate }) => new Date(ModifiedDate) >= sinceDate
    );
    missingLogos = (await checkLogos(breaches, server)).filter(
      logo => logo.status !== "alive"
    );
  }

  return {
    __meta: {
      statusCode: res.statusCode,
      server,
      version: __version
    },
    now,
    serverLastModified: new Date(res.headers["last-modified"]),
    since: sinceDate,
    breaches,
    missingLogos
  };
}

async function checkLogos(breaches, server) {
  const LOGO_URI_PREFIX = `${server}/img/logos`;
  const links = breaches.reduce((_links, { LogoPath }) => {
    const [img] = LogoPath.match(/[^/]*$/);
    img && _links.push(`${LOGO_URI_PREFIX}/${img}`);
    return _links;
  }, []);

  const linkCheck = await checkLinks(links);
  return Object.entries(linkCheck).map(([url, res]) => ({ url, ...res }));
}

module.exports = {
  args,
  getBreaches
};
