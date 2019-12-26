const request = require('request-promise');
const cheerio = require('cheerio');
const { headhunter } = require('../constants/providers');

var options = {
  uri: 'http://www.google.com',
  transform: function (body) {
    return cheerio.load(body);
  }
};

export const getHHResume = async ({ id }) => {
  const options = {
    uri: `${headhunter.url}/resume/${id}`,
    transform: (body) => cheerio.load(body)
  };

  return request(options).then((hmtl) => {
    return hmtl.text()
  });
};
