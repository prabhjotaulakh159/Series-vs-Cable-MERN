# Streaming Services VS Network Cable TV

Express + React app

Description: This app allows users to visualize the real differences between cable TV and streaming services. As technology has developed, different streaming service companies have emerged, migrating all tv content to an online platform requiring a monthly subscription to watch. But as these services have become popular, they have also become much bolder. Cancelling series after a single season when they are loved by many, and often continuing series that are of lesser interest to the general audience or lack quality. However, flaws can also be spotted in cable TV, in being that not many of their shows are very known, and oftentimes we cannot gadge their popularity because many have cancelled streaming service subscriptions. So the question becomes, which is better?

In our app, users will be able to navigate charts visualizing the differences in airtime, popularity, and awards between cable and streaming services, in order to decide themselves which is better. 

Picture TBA

## Structure

There are two directories in the __root__ of the project.

* The Express server is in `server/`
* The React app is in `directory/`
* The server responsd to API calls and serves the __built__ React app.

There are 3 package.json files -- see what `scripts` they define.

## Setup

To install all the dependencies and build the React app run:

```
npm run build
```

## To run the app

### Just the client

If `directory/package.json` has a `proxy` line, remove it. 

```
cd directory
npm run dev
```

### Just the server

If `directory/package.json` has a `proxy` line, remove it. 

```
cd server
nodemon api.mjs
```

**nodemon will update the server as soon as a file is changed by the developer.**

### Client and Server

In the `directory/vite.config.js`, add a `server` property to the defineConfig:
```
export default defineConfig({
  plugins: [react()],
  server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        },
      },
    },
});
```

This makes sure that when you make a fetch to any route beginning with `/api/some-resource`, it will proxy it to `http://localhost:3000/api/some-resource` for you.

Next, open 2 terminals. 

In one terminal (for the client):
```
cd directory
npm run dev
```

In another terminal (for the server):
```
cd server
nodemon api.mjs
```

## Attributions

### API
The API used in this project is [The TVDB API](https://github.com/thetvdb/v4-api). The corresponding json retrieved from the API will be parsed in order to gather the necessary data needed for our project. A single json entry for a series is as follows:
```
{
  "data": {
    "aliases": [
      {
        "language": "string",
        "name": "string"
      }
    ],
    "averageRuntime": 0,
    "country": "string",
    "defaultSeasonType": 0,
    "episodes": [
      {
        "absoluteNumber": 0,
        "aired": "string",
        "airsAfterSeason": 0,
        "airsBeforeEpisode": 0,
        "airsBeforeSeason": 0,
        "finaleType": "string",
        "id": 0,
        "image": "string",
        "imageType": 0,
        "isMovie": 0,
        "lastUpdated": "string",
        "linkedMovie": 0,
        "name": "string",
        "nameTranslations": [
          "string"
        ],
        "number": 0,
        "overview": "string",
        "overviewTranslations": [
          "string"
        ],
        "runtime": 0,
        "seasonNumber": 0,
        "seasons": [
          {
            "id": 0,
            "image": "string",
            "imageType": 0,
            "lastUpdated": "string",
            "name": "string",
            "nameTranslations": [
              "string"
            ],
            "number": 0,
            "overviewTranslations": [
              "string"
            ],
            "companies": {
              "studio": [
                {
                  "activeDate": "string",
                  "aliases": [
                    {
                      "language": "string",
                      "name": "string"
                    }
                  ],
                  "country": "string",
                  "id": 0,
                  "inactiveDate": "string",
                  "name": "string",
                  "nameTranslations": [
                    "string"
                  ],
                  "overviewTranslations": [
                    "string"
                  ],
                  "primaryCompanyType": 0,
                  "slug": "string",
                  "parentCompany": {
                    "id": 0,
                    "name": "string",
                    "relation": {
                      "id": 0,
                      "typeName": "string"
                    }
                  },
                  "tagOptions": [
                    {
                      "helpText": "string",
                      "id": 0,
                      "name": "string",
                      "tag": 0,
                      "tagName": "string"
                    }
                  ]
                }
              ],
              "network": [
                {
                  "activeDate": "string",
                  "aliases": [
                    {
                      "language": "string",
                      "name": "string"
                    }
                  ],
                  "country": "string",
                  "id": 0,
                  "inactiveDate": "string",
                  "name": "string",
                  "nameTranslations": [
                    "string"
                  ],
                  "overviewTranslations": [
                    "string"
                  ],
                  "primaryCompanyType": 0,
                  "slug": "string",
                  "parentCompany": {
                    "id": 0,
                    "name": "string",
                    "relation": {
                      "id": 0,
                      "typeName": "string"
                    }
                  },
                  "tagOptions": [
                    {
                      "helpText": "string",
                      "id": 0,
                      "name": "string",
                      "tag": 0,
                      "tagName": "string"
                    }
                  ]
                }
              ],
              "production": [
                {
                  "activeDate": "string",
                  "aliases": [
                    {
                      "language": "string",
                      "name": "string"
                    }
                  ],
                  "country": "string",
                  "id": 0,
                  "inactiveDate": "string",
                  "name": "string",
                  "nameTranslations": [
                    "string"
                  ],
                  "overviewTranslations": [
                    "string"
                  ],
                  "primaryCompanyType": 0,
                  "slug": "string",
                  "parentCompany": {
                    "id": 0,
                    "name": "string",
                    "relation": {
                      "id": 0,
                      "typeName": "string"
                    }
                  },
                  "tagOptions": [
                    {
                      "helpText": "string",
                      "id": 0,
                      "name": "string",
                      "tag": 0,
                      "tagName": "string"
                    }
                  ]
                }
              ],
              "distributor": [
                {
                  "activeDate": "string",
                  "aliases": [
                    {
                      "language": "string",
                      "name": "string"
                    }
                  ],
                  "country": "string",
                  "id": 0,
                  "inactiveDate": "string",
                  "name": "string",
                  "nameTranslations": [
                    "string"
                  ],
                  "overviewTranslations": [
                    "string"
                  ],
                  "primaryCompanyType": 0,
                  "slug": "string",
                  "parentCompany": {
                    "id": 0,
                    "name": "string",
                    "relation": {
                      "id": 0,
                      "typeName": "string"
                    }
                  },
                  "tagOptions": [
                    {
                      "helpText": "string",
                      "id": 0,
                      "name": "string",
                      "tag": 0,
                      "tagName": "string"
                    }
                  ]
                }
              ],
              "special_effects": [
                {
                  "activeDate": "string",
                  "aliases": [
                    {
                      "language": "string",
                      "name": "string"
                    }
                  ],
                  "country": "string",
                  "id": 0,
                  "inactiveDate": "string",
                  "name": "string",
                  "nameTranslations": [
                    "string"
                  ],
                  "overviewTranslations": [
                    "string"
                  ],
                  "primaryCompanyType": 0,
                  "slug": "string",
                  "parentCompany": {
                    "id": 0,
                    "name": "string",
                    "relation": {
                      "id": 0,
                      "typeName": "string"
                    }
                  },
                  "tagOptions": [
                    {
                      "helpText": "string",
                      "id": 0,
                      "name": "string",
                      "tag": 0,
                      "tagName": "string"
                    }
                  ]
                }
              ]
            },
            "seriesId": 0,
            "type": {
              "alternateName": "string",
              "id": 0,
              "name": "string",
              "type": "string"
            },
            "year": "string"
          }
        ],
        "seriesId": 0,
        "seasonName": "string",
        "year": "string"
      }
    ],
    "firstAired": "string",
    "id": 0,
    "image": "string",
    "isOrderRandomized": true,
    "lastAired": "string",
    "lastUpdated": "string",
    "name": "string",
    "nameTranslations": [
      "string"
    ],
    "nextAired": "string",
    "originalCountry": "string",
    "originalLanguage": "string",
    "overviewTranslations": [
      "string"
    ],
    "score": 0,
    "slug": "string",
    "status": {
      "id": 0,
      "keepUpdated": true,
      "name": "string",
      "recordType": "string"
    },
    "year": "string"
  },
  "status": "string"
}
```

Some filtering needed to be made to retrieve only the series airing on main cable and streaming services. The shows we want to filter will fit the following criteria:
_A series is valid if_:
- _For ["latestNetwork"]/["originalNetwork"]["tagOptions"]["name"]: includes "cable" or "SVOD"_
- _Its country is USA, UK, or Canada, as we will focus on western media_

The final series object will resemble the following once parsing is made to retrieve necessary data:
```
{
  id : int,
  name : string,
  genre: string,
  artwork : string,
  companyID: int,
  score: int,
  numberOfSeasons: int,
  numAwards: int,
}
```

The company object will resemble the following:
```
{
  id: int,
  name: string,
  type: string,
}
```

### Libraries
TBA