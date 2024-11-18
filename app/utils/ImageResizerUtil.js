import ImageResizer from 'react-native-image-resizer';
import React from 'react';
import RNFS from 'react-native-fs';
/**
 *
 * @param imageUri
 */
export default function resizerImages(imageUris) {
  let promises = [];
  imageUris.map(item => {
    promises.push(resizerImage(item));
  });
  return promises;
}

function resizerImage(item) {
  let {width, height} = item;
  let w = width;
  let h = height;
  let d = w / h;
  if (w > 1280 && h > 1280) {
    if (d >= 2 || (d > 0.5 && d < 1)) {
      height = 1280;
      width = d * height;
    } else {
      width = 1280;
      height = width / d;
    }
  } else if (w > 1280 && d >= 2) {
    width = 1280;
    height = width / d;
  } else if (h > 1280 && d <= 0.5) {
    height = 1280;
    width = d * height;
  }
  let path = item.path;
  return new Promise(resolve => {
    ImageResizer.createResizedImage(
      path,
      width,
      height,
      path.substr(-3).toLowerCase() === 'png' ? 'PNG' : 'JPEG',
      80,
      0,
      null,
    ).then(async result => {
      const base64 = await RNFS.readFile(result.uri, 'base64');
      result.base64 = 'data:image/jpeg;base64,' + base64;
      resolve(result);
    });
  });
}
