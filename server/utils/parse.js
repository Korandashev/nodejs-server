const request = require('request-promise');
const cheerio = require('cheerio');
const { isObject, isFunction } = require('./utils');
const { headhunter } = require('../constants/providers');

class Parser {
  constructor(options) {
    this.options = {
      uri: null,
      transform: (body) => cheerio.load(body, { decodeEntities: false }),
      ...options
    };

    if (typeof this.options.uri !== 'string') {
      throw new Error('Uri must be a string');
    }
  }

  load() {
    return request(this.options);
  }
}

class HeadHunterParser extends Parser {
  constructor(type = 'resume', id) {
    super({
      uri: `${headhunter.url}/${type}/${id}`
    });

    this.id = id;

    this.resumeXPath = {
      title: '[data-qa="resume-block-title-position"] > span',
      gender: {
        id: ($) => $('[data-qa="resume-personal-gender"]').text().trim() === 'Женщина' ? 'female' : 'male',
        name: '[data-qa="resume-personal-gender"]'
      },
      age: ($) => parseInt($('[data-qa="resume-personal-age"]').text()) || null,
      birth_date: ($) => $('[data-qa="resume-personal-birthday"]').attr('content'),
      area: {
        name: '[data-qa="resume-personal-address"]'
      },
      metro: {
        name: '[data-qa="resume-personal-metro"]'
      },
      relocation: {}, // TODO: xPath для relocation
      business_trip_readiness: {}, // TODO: xPath для relocation
      specialization: ($) => {
        const data = [];
        $('[data-qa="resume-block-specialization-category"]').each(function() {
          const profarea_name = $(this).text();
          const $names = $(this).next().find('[data-qa="resume-block-position-specialization"]');
          $names.each(function() {
            const name = $(this).text();
            data.push({ name, profarea_name });
          });
        });
        return data;
      },
      salary: {
        amount: '[data-qa="resume-block-salary"]'
      },
      employments: ($) => {
        const text = $('[data-qa="resume-block-position"] p:contains("Занятость: ")').text();
        const employments = text.slice(10, text.length).split(',');
        return employments.map(name => ({ name: name.trim() }));
      },
      schedules: ($) => {
        const text = $('[data-qa="resume-block-position"] p:contains("График работы: ")').text();
        const employments = text.slice(14, text.length).split(',');
        return employments.map(name => ({ name: name.trim() }));
      },
      experience: ($) => {
        const data = [];
        $('[itemprop="worksFor"]').each(function() {
          const interval = $(this).find('.resume-block__experience-timeinterval').text();
          const date = $(this).find('.resume-block__experience-mount-last').parent().text().replace(interval, '');
          const [start, end] = date.split(' — ');
          const company = $(this).find('[itemprop="name"]').text();
          const area = $(this).find('[itemprop="addressLocality"]').text();
          const industries = $(this).find('.resume-block__experience-industries span').first().text().split(', ');
          const position = $(this).find('[data-qa="resume-block-experience-position"]').text();
          const description = $(this).find('[data-qa="resume-block-experience-description"]').html();
          data.push({
            company,
            area: { name: area },
            industries: industries.map(name => ({ name })),
            position,
            description,
            start,
            end,
            interval
          });
        });
        return data;
      },
      total_experience: ($) => {
        const text = $('[data-qa="resume-block-experience"] span:contains("Опыт работы ")').text();
        const exp = text.slice(11, text.length);
        const [y, m] = exp.match(/[0-9]/g);
        return {
          months: (Number(y || 0) * 12) + Number(m || 0),
          total: exp.trim()
        };
      },
      skill_set: ($) => {
        const skills = [];
        $('[data-qa="bloko-tag__text"]').map(function() {
          skills.push($(this).text());
        });
        console.log(skills);
        return skills;
      },
      skills: ($) => $('[data-qa="resume-block-skills-content"]').html()
    };
  }

  getResume() {
    return this.load().then(($) => {
      const resume = {
        id: this.id,
        ...this.parse($, this.resumeXPath)
      };

      return resume;
    });
  }

  parse($, xPath) {
    const data = {};
    Object.keys(xPath).forEach((key) => {
      if (isFunction(xPath[key])) {
        data[key] = xPath[key]($);
      } else if (isObject(xPath[key])) {
        data[key] = this.parse($, xPath[key])
      } else {
        data[key] = $(xPath[key]).text();
      }

      if (typeof data[key] === 'string') {
        data[key] = data[key].trim();
      }
    });
    return data;
  }
}

module.exports = { HeadHunterParser };
