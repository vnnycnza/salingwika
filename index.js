'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const Bot = require('./services/Bot');
const Translator = require('./services/Translator');
const pino = require('pino')();
const app = express();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3001;
const url = process.env.URL || `http://localhost:${port}`;
const token = process.env.TELEGRAM_TOKEN || 3001;

const bot = new Bot(env, token, url);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.post('/api/translate', async (req, res) => {
  pino.info('[Server] Request to translate');
  try {
    const { word, from, to } = req.body;
    const data = await Translator.translate(word, from, to);
    pino.info(`[Server] Translator Response: ${JSON.stringify(data)}`);

    return res.status(200).json({
      word,
      from,
      to,
      results: data,
    });
  } catch (e) {
    pino.error(`[Server] Encountered error ${e}`);

    return res.status(400).json({ error: e.message });
  }
});

app.post(`/webhook/${bot.token}`, (req, res) => {
  bot._bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  pino.info('[Server] Server is running on localhost:3001');
});
