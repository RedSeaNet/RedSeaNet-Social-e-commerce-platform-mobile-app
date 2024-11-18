const emojiCustomMap = require('./emojiCustomMap.js');

const emojiCustom = {
  map: emojiCustomMap,
};

/**
 * get emoji code from name
 * @param  {string} name
 * @return {string}
 */
emojiCustom.get = name => {
  const got = emojiCustom.map.get(name);

  if (got) {
    return got;
  }
  return '';
};

module.exports = emojiCustom;
