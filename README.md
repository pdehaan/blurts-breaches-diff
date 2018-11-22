# blurts-breaches-diff

JSON diff of breaches

## Usage:

```sh
$ npx pdehaan/blurts-breaches-diff
```

The first time you run the script you'll probably get a message like the
following, since you presumably don't have a local "./breaches.json" file:

> Generating 'breaches.json' from https://haveibeenpwned.com/api/v2/breaches...

Any subsequent time you run <kbd>$ npx pdehaan/blurts-breaches-diff</kbd> you
should see some semi-cryptic output of any diffs from your cached ./breaches.json
file and the file scraped from the https://haveibeenpwned.com/api/v2/breaches endpoint.

For example, here's what the output would look like if a new breach was added but not
present in the cached breaches.json file:

```json
[
  [
    "+",
    {
      "Name": "LinkedIn",
      "Title": "LinkedIn",
      "Domain": "linkedin.com",
      "BreachDate": "2012-05-05",
      "AddedDate": "2016-05-21T21:35:40Z",
      "ModifiedDate": "2016-05-21T21:35:40Z",
      "PwnCount": 164611595,
      "Description": "In May 2016, <a href=\"https://www.troyhunt.com/observations-and-thoughts-on-the-linkedin-data-breach\" target=\"_blank\" rel=\"noopener\">LinkedIn had 164 million email addresses and passwords exposed</a>. Originally hacked in 2012, the data remained out of sight until being offered for sale on a dark market site 4 years later. The passwords in the breach were stored as SHA1 hashes without salt,the vast majority of which were quickly cracked in the days following the release of the data.",
      "LogoType": "svg",
      "DataClasses": [
        "Email addresses",
        "Passwords"
      ],
      "IsVerified": true,
      "IsFabricated": false,
      "IsSensitive": false,
      "IsRetired": false,
      "IsSpamList": false
    }
  ]
]
```

And if no new breaches have been discovered (and none of the other breach data has
mysteriously changed), you should see some output similar to:

> No changes found in https://haveibeenpwned.com/api/v2/breaches
