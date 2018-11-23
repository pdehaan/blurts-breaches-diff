# blurts-breaches-diff

JSON diff of breaches.

Pretty basic. Pointless, almost. But lets me easily see if there have been any recent breaches added to the site.

## Usage:

```sh
# Fetch the /hibp/breaches endpoint from monitor.firefox.com and display any
# breaches in the past 4 days (if any).
$ npx pdehaan/blurts-breaches-diff --since=-4d
```

### Flags:

Currently there are three supported CLI flags:

1. `--env`: String &mdash; Shortcut for setting the `--server` flag, since I can never remember/type full URLs. Options: "l10n", "dev", "stage", or "prod".
1. `--server`: String &mdash; The server to scrape the breaches API and resolve images to. For example, you can specify `--server=https://monitor.firefox.com` (default) and it will check against the production server, or you can specify `--server=https://fx-breach-alerts.herokuapp.com` to check against the development/l10n Heroku server. Defaults to "https://monitor.firefox.com".
1. `--since`: String &mdash; Relative time format. For example, you can specify `--since=-3d` for all breaches within the past 2 days, or `--since=1w` for all breaches within the past 1 week. Note that the script uses [**ms**](http://npm.im/ms) for converting time formats (7d, 1w, 10h) into milliseconds,
so feel free to go crazy. Defaults to **1 week**.

**NOTE:** When specifying the `--since` argument, the script will run `Math.abs()` on the value returned by `ms()`, so essentially "-7d" and "7d" are equivalent.

### Output:

```sh
$ npx pdehaan/blurts-breaches-diff --since=-1d

{
  "now": "2018-11-22T20:46:32.411Z",
  "serverLastModified": "2018-11-22T19:43:06.000Z",
  "since": "2018-11-21T20:46:31.884Z",
  "breaches": [
    {
      "Name": "Adapt",
      "Title": "Adapt",
      "Domain": "adapt.io",
      "BreachDate": "2018-11-05",
      "AddedDate": "2018-11-22T19:43:06Z",
      "ModifiedDate": "2018-11-22T19:43:06Z",
      "PwnCount": 9363740,
      "Description": "In November 2018, <a href=\"https://blog.hackenproof.com/industry-news/another-decision-makers-database-leaked/\" target=\"_blank\" rel=\"noopener\">security researcher Bob Diachenko identified an unprotected database hosted by data aggregator &quot;Adapt&quot;</a>. A provider of &quot;Fresh Quality Contacts&quot;, the service exposed over 9.3M unique records of individuals and employer information including their names, employers, job titles, contact information and data relating to the employer including organisation description, size and revenue. No response was received from Adapt when contacted.",
      "LogoType": "png",
      "DataClasses": [
        "email-addresses",
        "employers",
        "job-titles",
        "names",
        "phone-numbers",
        "physical-addresses",
        "social-media-profiles"
      ],
      "IsVerified": true,
      "IsFabricated": false,
      "IsSensitive": false,
      "IsRetired": false,
      "IsSpamList": false
    }
  ],
  "missingLogos": [
    {
      "url": "https://monitor.firefox.com/img/logos/Adapt.png",
      "status": "dead",
      "statusCode": 404
    }
  ]
}
```

The response should return an object with the following keys:

- `now`: The current time that you made the request.
- `serverLastModified`: The last time the server loaded a new breach from HIBP.
- `since`: The current time, minus the specified duration (ie: "3d", "1w").
- `breaches`: An array of breaches for the specified duration (or an empty array).
- `missingLogos`: An array of missing PNG/SVG logos (on production) for recent breaches. This may yield false-positives if the breach logo has already been updated on
  the development server but not yet deployed on stage.

**NOTE:** Unlike HIBP, the `breaches[]` returned from the Firefox Monitor /hibp/breaches endpoint will slugify each of the items in the `DataClasses` array (since we do translations on those strings).
