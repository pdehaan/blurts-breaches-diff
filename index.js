const got = require("got").get;
const ms = require("ms");
const pkg = require("./package.json");

const BREACH_API_URL = "https://monitor.firefox.com/hibp/breaches";

async function getBreaches(since="7d") {
  const sinceDate = new Date(Date.now() - Math.abs(ms(since)));
  const res = await got(BREACH_API_URL, {
    headers: {
      "user-agent": `${pkg.name}/${pkg.version}`,
      "if-modified-since": sinceDate.toUTCString()
    },
    json: true
  });

  return {
    now: new Date(),
    serverLastModified: new Date(res.headers["last-modified"]),
    since: sinceDate,
    breaches: res.body.filter(breach => new Date(breach.ModifiedDate) >= sinceDate)
  };
}

module.exports = {
  BREACH_API_URL,
  getBreaches
};
