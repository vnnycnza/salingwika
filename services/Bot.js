'use strict';

const TelegramBot = require('node-telegram-bot-api');
const Translator = require('./Translator');
const pino = require('pino')();

class Bot {
  constructor(env, token, url) {
    if (env === 'production') {
      this._bot = new TelegramBot(token);
      this._bot.setWebHook(`${url}/webhook/${this._bot.token}`);
    } else {
      this._bot = new TelegramBot(token, { polling: true });
    }

    this._bot.onText(/\/english (.+)/, async (msg, match) => {
      const receipient = msg.chat.id;
      const word = match[1];

      const reply = await Bot.formatResponse(word, 'filipino', 'english');
      this._bot.sendMessage(receipient, reply, { parse_mode: 'Markdown' });
    });

    this._bot.onText(/\/filipino (.+)/, async (msg, match) => {
      const recipient = msg.chat.id;
      const word = match[1];

      const reply = await Bot.formatResponse(word, 'english', 'filipino');
      this._bot.sendMessage(recipient, reply, { parse_mode: 'Markdown' });
    });

    this._bot.onText(/\/help/, async msg => {
      const reply = Bot.getHelpMessage();
      this._bot.sendMessage(msg.chat.id, reply, { parse_mode: 'Markdown' });
    });
  }

  static getHelpMessage() {
    return (
      '🇵🇭🤓🇵🇭\n*Salingwika*\n\n' +
      '/english <_word_> - Translate [word] from Filipino to English\n' +
      '/filipino <_word_> - Translate [word] from English to Filipino\n\n' +
      'All results from [Tagalog Translate](http://www.tagalogtranslate.com/) 🙌'
    );
  }

  static async formatResponse(word, from, to) {
    const header =
      to === 'filipino'
        ? 'English to Filipino Translation'
        : 'Filipino to English Translation';

    const reply = `🇵🇭🤓🇵🇭\n*${header}*\n\`${word}\`\n\n`;
    try {
      const data = await Translator.translate(word, from, to);
      let meanings = '';
      for (const [key, value] of Object.entries(data)) {
        meanings += `*${key}*\n_${value.join('\n')}_\n\n`;
      }

      pino.info(`[Bot] Retrieved translation for ${word}`);

      return `${reply}${meanings}`;
    } catch (e) {
      pino.error(e, '[Bot] No translation or error occured');

      return `${reply}_Oops! Sorry, I can't find an answer right now_😩`;
    }
  }
}

module.exports = Bot;
