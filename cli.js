#!/usr/bin/env node

const fs = require("fs");
const lib = require("./index");

main();

async function main() {
  const newBreaches = await lib.getBreaches();
  if (fs.existsSync("breaches.json")) {
    const _oldBreaches = fs.readFileSync("breaches.json", "utf-8");
    const oldBreaches = JSON.parse(_oldBreaches);
    const breachDiff = (lib.jsonDiff(newBreaches, oldBreaches) || [])
      .filter(([key, value]) => key.trim());
    if (breachDiff.length) {
      console.log(JSON.stringify(breachDiff, null, 2));
      process.exitCode = 1;
    } else {
      console.info(`No changes found in ${lib.BREACH_API_URL}`);
    }
  } else {
    console.error(`Generating 'breaches.json' from ${lib.BREACH_API_URL}...`);
  }

  fs.writeFileSync("breaches.json", JSON.stringify(newBreaches, null, 2) + "\n");
}
