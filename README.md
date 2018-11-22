# blurts-breaches-diff

JSON diff of breaches.

Pretty basic. Pointless, almost. But lets me easily see if there have been any recent breaches added to the site.

## Usage:

```sh
# Fetch the /hibp/breaches endpoint from monitor.firefox.com and display any
# breaches in the past 4 days (if any).
$ npx pdehaan/blurts-breaches-diff -4d
```

By default, the script will return all breaches in the past 7 days, unless you specify some other time on the CLI.
Note that the script uses [**ms**](http://npm.im/ms) for converting time formats (7d, 1w, 10h) into milliseconds,
so feel free to go crazy.

**NOTE:** The script will run `Math.abs()` on the value returned by `ms()`, so essentially "-7d" and "7d" ar equivalent.

### Output:

```sh
$ npx pdehaan/blurts-breaches-diff -3d

{
  "now": "2018-11-22T19:37:25.855Z",
  "serverLastModified": "2018-11-20T21:22:09.000Z",
  "since": "2018-11-19T19:37:25.474Z",
  "breaches": [
    {
      "Name": "HTHStudios",
      "Title": "HTH Studios",
      "Domain": "hthstudios.com",
      "BreachDate": "2018-08-24",
      "AddedDate": "2018-11-20T21:22:09Z",
      "ModifiedDate": "2018-11-20T21:22:09Z",
      "PwnCount": 411755,
      "Description": "In August 2018, the adult furry interactive game creator <a href=\"https://hthstudios.com/\" target=\"_blank\" rel=\"noopener\">HTH Studios</a> suffered a data breach impacting mulitple repositories of customer data. Several months later, the data surfaced on a popular hacking forum and included 411k unique email addresses along with physical and IP addresses, names, orders, salted SHA-1 and salted MD5 hashes. HTH Studios is aware of the incident.",
      "LogoType": "png",
      "DataClasses": [
        "browser-user-agent-details",
        "dates-of-birth",
        "email-addresses",
        "ip-addresses",
        "names",
        "phone-numbers",
        "physical-addresses",
        "purchases",
        "usernames"
      ],
      "IsVerified": true,
      "IsFabricated": false,
      "IsSensitive": true,
      "IsRetired": false,
      "IsSpamList": false
    }
  ]
}
```

The response should return an object with four keys:

- `now`: The current time that you made the request.
- `serverLastModified`: The last time the server loaded a new breach from HIBP.
- `since`: The current time, minus the specified duration (ie: "3d", "1w").
- `breaches`: An array of breaches for the specified duration (or an empty array).

**NOTE:** Unlike HIBP, the `breaches[]` returned from the Firefox Monitor /hibp/breaches endpoint will slugify each of the items in the `DataClasses` array (since we do translations on those strings).
