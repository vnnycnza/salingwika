'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const iconv = require('iconv-lite');

class Translator {
  constructor() {
    this._url = 'https://www.tagalogtranslate.com/translate.php';
  }

  async _request(query) {
    const response = await axios.post(this._url, qs.stringify(query), {
      responseType: 'arraybuffer',
    });

    const ctype = response.headers['content-type'];
    response.data = ctype.includes('charset="ISO-8859-1"')
      ? iconv.decode(response.data, 'windows-1252')
      : iconv.decode(response.data, 'utf-8');

    return response;
  }

  static _parseResponse(response) {
    const html = response.data;
    const $ = cheerio.load(html, { decodeEntities: false });

    const results = {};

    const error = $('div#left_content').find('h3.result_error');
    if (error.length !== 0) throw new Error('No Results Found');

    $('div#left_content')
      .children('div.result_sub_title_language')
      .each((i, item) => {
        const category = $(item)
          .text()
          .trim();
        const translations = [];

        let elementToFind = 'tr.result_tr > td.right_td > div.result_text';
        if (category === 'Automatic Translation:') {
          // Can't scrape automatic translation most of the time because
          // the loader (image) is captured already before the word appears
          elementToFind += ' > div#target_text_1';
        }

        if (category === 'Word by word match:') {
          $(item)
            .next('table')
            .find('tr.result_tr')
            .each((idx, it) => {
              const from = $(it)
                .find('td.left_td > div.result_sub_title_query')
                .text()
                .trim();
              const to = $(it)
                .find('td.right_td > div.result_text')
                .text()
                .trim();
              translations.push(`${from} --> ${to}`);
            });
        } else {
          $(item)
            .next('table')
            .find(elementToFind)
            .each((idx, it) => {
              const translation = $(it)
                .text()
                .trim();

              if (translation.length !== 0) {
                translations.push(translation);
              }
            });
        }

        if (translations.length !== 0) {
          // Return first 5 results only
          results[category] = translations.splice(0, 5);
        }
      });

    return results;
  }

  async translate(word, from, to) {
    const response = await this._request({
      lang: from === 'english' && to === 'filipino' ? 'en_id' : 'id_en',
      q: word,
    });

    return Translator._parseResponse(response);
  }
}

module.exports = new Translator();
