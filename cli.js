#!/usr/bin/env node

const { args, getBreaches } = require("./index");

const flags = args();

main(flags);

async function main(opts) {
  const recentBreaches = await getBreaches(opts.since, opts.server);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(recentBreaches, null, 2));
}
