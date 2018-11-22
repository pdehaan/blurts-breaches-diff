const got = require("got").get;
const jsonDiff = require("json-diff").diff;

const BREACH_API_URL = "https://haveibeenpwned.com/api/v2/breaches";

async function getBreaches() {
  return (await got(BREACH_API_URL, {json: true})).body;
}

module.exports = {
  BREACH_API_URL,
  getBreaches,
  jsonDiff
};
