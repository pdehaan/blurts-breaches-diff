#!/usr/bin/env node

const {args, getBreaches} = require("./index");

const flags = args();

main(flags.since, flags.server);

async function main(modifiedSince, server) {
  const recentBreaches = await getBreaches(modifiedSince, server);
  console.log(JSON.stringify(recentBreaches, null, 2));
}
