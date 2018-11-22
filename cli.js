#!/usr/bin/env node

const lib = require("./index");

main();

function deleteDataClasses(breach) {
  delete breach.DataClasses;
  return breach;
}

async function main() {
  const hibpBreaches = (await lib.getHIBPBreaches())
    .map(deleteDataClasses);
  const monitorBreaches = (await lib.getMonitorBreaches())
    .map(deleteDataClasses);
  
  // Returns `undefined` or an array of diffs.
  let breachDiff = lib.jsonDiff(hibpBreaches, monitorBreaches);

  if (breachDiff) {
      breachDiff = breachDiff.filter(([key, value]) => key.trim());
    if (breachDiff.length) {
      console.log(JSON.stringify(breachDiff, null, 2));
      process.exit(1);
    }
  }
  console.info(`No changes found in ${lib.HIBP_BREACH_URL}`);
}
