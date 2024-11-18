import {getStore} from '../api/request';
import {storeStorage} from '../utils/Storage';

export function getStoreData(storeIds) {
  return new Promise((resolve, reject) => {
    let cacheStore = {};
    let returnStore = {};
    let notExitStore = false;
    if (storeStorage.getData()) {
      cacheStore = JSON.parse(storeStorage.getData());
    }
    for (let i = 0; i < storeIds.length; i++) {
      if (typeof cacheStore[storeIds[i]] === 'undefined') {
        notExitStore = true;
        break;
      } else {
        returnStore[storeIds[i]] = cacheStore[storeIds[i]];
      }
    }
    if (notExitStore) {
      getStore(storeIds).then(items => {
        if (items.length > 0) {
          items.map(storeInfo => {
            cacheStore[storeInfo.id] = storeInfo;
            returnStore[storeInfo.id] = storeInfo;
          });
        }
        storeStorage.setData(JSON.stringify(cacheStore));
        resolve(returnStore);
      });
    } else {
      resolve(returnStore);
    }
  });
}
