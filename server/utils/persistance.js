/* eslint-disable consistent-return, no-shadow, no-console */
const fs = require('fs');

module.exports = {
  read(filename, cb) {
    fs.readFile(filename, { encoding: 'utf8', flag: 'r' }, (err, data) => {
      if (err) return cb(err);
      try {
        const token = JSON.parse(data);
        cb(null, token);
      } catch (err) {
        cb(err);
      }
    });
  },
  write(filename, token, cb) {
    console.log('persisting new token:', JSON.stringify(token));
    fs.writeFile(filename, JSON.stringify(token), cb);
  },
};
