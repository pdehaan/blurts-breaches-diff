const checkLinks = require("check-links");
const got = require("got").get;
const ms = require("ms");
const pkg = require("./package.json");

const BREACH_API_URL = "https://monitor.firefox.com/hibp/breaches";
const LOGO_URI_PREFIX = "https://monitor.firefox.com/img/logos";

async function getBreaches(since="7d") {
  const sinceDate = new Date(Date.now() - Math.abs(ms(since)));
  const res = await got(BREACH_API_URL, {
    headers: {
      "user-agent": `${pkg.name}/${pkg.version}`,
      "if-modified-since": sinceDate.toUTCString()
    },
    json: true
  });

  const recentBreaches = res.body.filter(breach => new Date(breach.ModifiedDate) >= sinceDate);
  const logos = await checkLogos(recentBreaches)

  return {
    now: new Date(),
    serverLastModified: new Date(res.headers["last-modified"]),
    since: sinceDate,
    breaches: recentBreaches,
    missingLogos: logos.filter(logo => logo.status !== "alive")
  };
}

async function checkLogos(breaches) {
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
  BREACH_API_URL,
  getBreaches
};
