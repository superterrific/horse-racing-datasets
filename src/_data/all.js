require('dotenv').config();
const Airtable = require('airtable');
let base = new Airtable({ apiKey: process.env.KEY }).base('appMh38AX1IpV3vIR');

module.exports = () => {
  return new Promise((resolve, reject) => {
    let allDatasets = [];
      base('New')
        .select({ view: 'All' })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach((record) => {
              allDatasets.push({
                "id" : record._rawJson.id,
                ...record._rawJson.fields
              });
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              reject(err)
            } else {
              resolve(allDatasets);
            }
          }
        );
      });
    };
