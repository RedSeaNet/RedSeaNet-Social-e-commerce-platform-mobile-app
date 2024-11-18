export function Substr(str, start, n) { // eslint-disable-line
  if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
    return str;
  }
  let len = 0;
  let tmpStr = '';
  for (let i = start; i < str.length; i++) {
    // 遍历字符串
    if (/[\u4e00-\u9fa5]/.test(str[i])) {
      // 中文 长度为两字节
      len += 2;
    } else {
      len += 1;
    }
    if (len > n) {
      break;
    } else {
      tmpStr += str[i];
    }
  }
  return tmpStr;
}
