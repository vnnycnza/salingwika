# salingwika
English to Filipino to English **Translator API** &amp; **Telegram Bot**.
Salingwika is a Filipino word which could mean translation.
The app scrapes results from `TagalogTranslate.com`.

## Application
The app has two components: _a simple translation api & a telegram bot_.

### Translation API
https://salingwika.herokuapp.com/api/translate

#### Request Body

| key     | type        | description                   |
| --------| ----------- | ------------------------------|
| word    | string      | Word or sentence to translate |
| from    | string      | `english` or `filipino`       |
| to      | string      | `filipino` or `english`       |

#### Response Body

| key     | type        | description                                    |
| --------| ----------- | -----------------------------------------------|
| word    | string      | Word or sentence translated                    |
| from    | string      | `english` or `filipino`                        |
| to      | string      | `filipino` or `english`                        |
| results | object      | Translation results where `key` is description |
|         |             | and `value` is an array of results             |

#### Sample Request
```
POST https://salingwika.herokuapp.com/api/translate HTTP/1.1
Host: salingwika.herokuapp.com
Content-Type: application/json

{
	"word": "hello world",
	"from": "english",
	"to": "filipino"
}
```

### Sample Response
```
{
    "word": "sun",
    "from": "english",
    "to": "filipino",
    "results": {
        "Best translation match:": [
            "araw;",
            "[san] Araw",
            "[sám bim] Sikat ó sinag ng araw"
        ],
        "Probably related with:": [
            "araw; araw na sumisikat; ng araw; ang araw; araw na; kaarawan;"
        ],
        "May be synonymous with:": [
            "the rays of the sun",
            "expose one's body to the sun",
            "expose to the rays of the sun or affect by exposure to the sun"
        ],
        "May related with:": [
            "araw;",
            "araw; araw na sumisikat; ng araw; ang araw; araw na; kaarawan;"
        ]
    }
}
```

### Telegram Bot
Try out the bot by opening this link in your Telegram app
https://t.me/SalingwikaBot

#### Bot Features
- **/english [word]** - translates given filipino word to english
- **/filipino [word]** - translates given english word to filipino
- **/help** - shows bot description

## Tech Stack & Resources
- [Node.js](https://nodejs.org/en/)
- [TagalogTranslate.com](https://www.tagalogtranslate.com/)
- [Telegram Bot Module](https://github.com/yagop/node-telegram-bot-api)
- [Cheerio](https://github.com/cheeriojs/cheerio)
- [Express](https://expressjs.com/)
- [Heroku](https://www.heroku.com/)

## Running the app locally
Running the app requires an environment variable named as `TELEGRAM_TOKEN` & `URL`.
```
$ cd salingwika
$ npm ci
$ export URL=http://localhost:3001
$ export TELEGRAM_TOKEN=<TELEGRAM_TOKEN>
$ npm start
```
App will run locally in `http://localhost:3001`


## Production
The app is deployed via `Heroku` and can be accessed [HERE](https://salingwika.herokuapp.com/).