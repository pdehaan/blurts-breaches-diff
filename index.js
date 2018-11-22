const got = require("got").get;
const jsonDiff = require("json-diff").diff;

const HIBP_BREACH_URL = "https://haveibeenpwned.com/api/v2/breaches";
const MONITOR_BREACH_URL = "https://monitor.firefox.com/hibp/breaches";

async function getMonitorBreaches() {
  return (await got(MONITOR_BREACH_URL, {json: true})).body;
}

async function getHIBPBreaches() {
  return (await got(HIBP_BREACH_URL, {json: true})).body;
}

module.exports = {
  HIBP_BREACH_URL,
  MONITOR_BREACH_URL,
  getMonitorBreaches,
  getHIBPBreaches,
  jsonDiff
};
