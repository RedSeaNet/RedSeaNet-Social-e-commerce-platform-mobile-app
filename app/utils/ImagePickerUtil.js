import ImagePicker from 'react-native-image-picker';

/**
 * 根据选择的图片，返回压缩后的地址
 * @param maxWidth
 * @param maxHeight
 * @returns {Promise<unknown>}
 */
export default function getUploadImageInfo(maxWidth = 1000, maxHeight = 1000) {
  const options = {
    title: 'Select Avatar',
    quality: 1.0,
    maxWidth,
    maxHeight,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  return new Promise((resolve, reject) => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        reject();
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        reject();
      } else {
        //const source = {uri: response.uri};
        console.log('source', response.uri, response.width, response.height);
        // You can also display the image using data:

        resolve(response.data);
      }
    });
  });
}
