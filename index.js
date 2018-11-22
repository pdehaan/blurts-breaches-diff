const _arg = require("arg");
const checkLinks = require("check-links");
const got = require("got").get;
const ms = require("ms");
const pkg = require("./package.json");

function args() {
  const _args = _arg({
    "--server": String,
    "--since": String
  }, {permissive: true});
  
  return {
    server: _args["--server"] || "https://monitor.firefox.com",
    since: _args["--since"] || _args._[0] || "-7d"
  };
}

async function getBreaches(modifiedSince="-1w", server="https://monitor.firefox.com") {
  const now = new Date()
  const BREACH_API_URL = `${server}/hibp/breaches`
  const since = new Date(now - Math.abs(ms(modifiedSince)));
  const res = await got(BREACH_API_URL, {
    headers: {
      "user-agent": `${pkg.name}/${pkg.version}`,
      "if-modified-since": since.toUTCString()
    },
    json: true
  });

  // Assume we have no recent breaches. If we get a non "304" status code from the remote server these values will be updated below.
  let breaches =[];
  let missingLogos = [];

  if (res.statusCode !== 304 && res.body) {
    breaches = res.body.filter(({ModifiedDate}) => new Date(ModifiedDate) >= since);
    missingLogos = (await checkLogos(breaches, server))
      .filter(logo => logo.status !== "alive");
  }

  return {
    __statusCode: res.statusCode,
    now,
    serverLastModified: new Date(res.headers["last-modified"]),
    since,
    breaches,
    missingLogos
  };
}

async function checkLogos(breaches, server) {
  const LOGO_URI_PREFIX = `${server}/img/logos`;
  const links = breaches.reduce((_links, {Name, LogoType}) => {
    _links.push(`${LOGO_URI_PREFIX}/${Name}.${LogoType}`);
    if (LogoType !== "png") {
      _links.push(`${LOGO_URI_PREFIX}/${Name}.png`);
    }
    return _links;
  }, []);

  const linkCheck = await checkLinks(links);
  return Object.entries(linkCheck).map(([url, res]) => ({url, ...res}));
}

module.exports = {
  args,
  getBreaches
};
