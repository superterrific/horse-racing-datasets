const { DateTime } = require("luxon");
const slugify = require("slugify");
const CleanCSS = require('clean-css');

// Transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');

// Create production flag
const isProduction = process.env.NODE_ENV === 'production';

module.exports = config => {

  // Filters
  config.addFilter('longDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('LLLL dd, yyyy');
  });

  config.addFilter('isoDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  config.addFilter('w3Date', dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toISO();
  });

  // Limit amount of items displayed
  config.addFilter('limit', function (arr, limit) {
    return arr.slice(0, limit);
  });

  // Return a single random item
  config.addFilter('randomItem', (arr) => {
    arr.sort(() => {
      return 0.5 - Math.random();
    });
    return arr.slice(0, 1);
  });

  // Sort tag pages by title
  config.addFilter("sortByTitle", arr => {
    arr.sort((a, b) => (a.title) > (b.title) ? 1 : -1);
    return arr;
  });

  // Sort recently added page by date added
  config.addFilter("sortByNewest", arr => {
    arr.sort((b, a) => (a.date) > (b.date) ? 1 : -1);
    return arr;
  });

  // Minify
  config.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  if (isProduction) {
  config.addTransform('htmlmin', htmlMinTransform);
  }

  // Check if the array is empty and then display some helpful text
  config.addFilter('isEmpty', (value) => {
    return Array.isArray(value) && value.length === 0;
  });

  // Open the browser on launch
  config.setBrowserSyncConfig({
    open: true,
    ghostMode: false
  });

  // Use slugify to remove apostrophe from tag links
  config.addFilter("slug", (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*?<>{}]/g,
      lower: true
    };
    return slugify(input, options);
  });

  // Shortcodes
  config.addPairedShortcode('quote', function(content) {
    return `<blockquote>${content}</blockquote>`
  });

  // Set directories to pass through to the public folder
  config.addPassthroughCopy('./src/img/');
  config.addPassthroughCopy('./src/fonts/');
  config.addPassthroughCopy('./src/js/');
  config.addPassthroughCopy('./src/_redirects');

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'public'
    }
  };
};
