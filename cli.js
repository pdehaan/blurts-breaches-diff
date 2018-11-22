#!/usr/bin/env node

const ms = require("ms");
const lib = require("./index");

const [, , argv] = process.argv;

main(argv);

async function main(since="7d") {
  const newBreaches = await lib.getBreaches(since);
  console.log(JSON.stringify(newBreaches, null, 2));
}
