# Samantha the`slack`Bot

Samantha is a pluggable`slack`bot on top of [hermes](https://github.com/segmentio/hermes).

**Table of Contents**

- [Samantha the`slack`Bot](#samantha-theslackbot)
    - [Plugins:](#plugins)
    - [Requirements:](#requirements)
    - [Config:](#config)
        - [How to get Token](#how-to-get-token)
        - [How to get SLACK_ID and SLACK_SECRET](#how-to-get-slackid-and-slacksecret)
        - [How to get Google api authentication object](#how-to-get-google-api-authentication-object)
    - [Installation:](#installation)
    - [Running:](#running)
        - [Webserver:](#webserver)
        - [Slack button](#slack-button)
        - [Standalone robot:](#standalone-robot)
        - [Docker:](#docker)
- [TODO](#todo)



## Plugins:

  - **hermes-slack:** Responsible to handle`slack`API
  - **hermes-sheet-dict:** Will download a configured sheet from google doc and
    read its first to columns as a dictionary. Finally it provides this commands
    to use this dictionary:
    - **whatis|what is|wtf is|wtfis|wtf|what <word>:** to get the translation of word!
    - **update:** To re-read the sheet and update the dictionary.
    
## Requirements:

  - Nodejs `+5`
  - NPM
  - Redis

## Config:

To start `Samantha`, file `hermes.json` should exist in root directory (ignored
by VC), and contain bot's configuration as follow:

    {
      "name": <BOT NAME>,
      "nickname": <NICKNAME>,
      "slack_api": {
        "id": <SLACK_ID>,
        "secret": <SLACK_SECRET>
      },
      "plugins": {
        "hermes-slack": {
          "token": <TOKEN>
        },
        "hermes-sheet-dict": {
          "docid": <DOC_ID>,
          "creds": <GOOGLE API AUTHENTICATION OBJECT>
        }
      }
    }

  - **BOT NAME:** Will be used as bot's full name (**Required**).
  - **NICKNAME:** Will be used as bot's nickname (You can call the bot with it)(**Required**).
  - **SLACK_ID and SLACK_SECRET:** Slack app's ID and secret. Will be used to
    get new token for bot (**Required in webserver mode**).
  - **TOKEN:** Will be used to connect to target channel (**Required in standalone mode**).
  - **DOC_ID:** The id of the sheet which is shared with bot user. As example in
    this link:
    `https://drive.google.com/open?id=10GK3lKLg4WxsP19uX1DK_Qfov0uYDB1kRqV5Wdi8hKY`
    the id is: `10GK3lKLg4WxsP19uX1DK_Qfov0uYDB1kRqV5Wdi8hKY` (**Required**)
    
  - **GOOGLE API AUTHENTICATION OBJECT:** The content of google generated api credentials (**Required**).

### How to get Token

For this you need to create a bot in
[this address](https://my.slack.com/services/new/bot). After that slack will
provide you a token, which you can use to authenticate your bot in current slack
group.

### How to get SLACK_ID and SLACK_SECRET

First, get a token from previous step. Then go to
[this address](https://api.slack.com/apps/new) and fill the form. `Redirect
links` are the essential part of the webservice authentication. whenever a user
authorizes `Samantha`, slack will redirect them to this address with a temporary
api key. Then the webserver will use this address to get a token which will make
the bot able to connect to users channels.

After creating the app, go to [this address](https://api.slack.com/apps) and
click on your app name. Then click on `App credentials` to get `SLACK_ID` and
`SLACK_SECRET.

Also be sure to choose `Bot Users` from the menu and add bot from previous step
to your app. So webserver is able to request required scopes.

### How to get Google api authentication object

To get Google api credentials, follow this instruction:

  - Go to [google developers console](https://console.developers.google.com/project)
  - Click on `CREATE PROJECT` button
  - Name the project and click `create` button
  - In the API manager/Overview select `Drive API` 
  - Click on `Enable`
  - On left hand side click on `Credentials`
  - Click on `Create credentials` and select `Service account`.
  - Select App engine from `Service account` dropdown and set `key type` to `json`
  - Click on create

A `.json` file containing google credential will be downloaded to your computer.
Copy it's content to config file in `creds` key.
  

    {
      "type": ... ,
      "project_id": ... ,
      "private_key_id": ... ,
      "private_key": ... ,
      "client_email": ... ,
      "client_id": ... ,
      "auth_uri": ... ,
      "token_uri": ... ,
      "auth_provider_x509_cert_url": ... ,
      "client_x509_cert_url":... 
    }

## Installation:

     $ git clone <THIS_REPO>
     $ cd samantha
     $ npm install
    
## Running:

### Webserver:

If you want to use this robot as part of a `slack` application, you need to run
this webserver to be able to complete `Oauth` process. To start this server run
this command:

    $ npm start

### Slack button

To get an slack button you can go to [this page](https://api.slack.com/docs/slack-button) and use the generated code.
Make sure to just put `bot` in the scope variable. 

### Standalone robot:

It is also possible to execute robot as it self (for test or single target):

    $ npm run robot
    
### Docker:

To run webserver as a docker container, you can use docker compose:

    $ docker-compose up -d

# TODO

  - Move `redis` server to a standalone `hermes` plugin over robot (if possible)
  - Use `redis` to save sheet data
  - Support direct message
  - Document the code
  - Write tests
