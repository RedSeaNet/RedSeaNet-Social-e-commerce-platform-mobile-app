'use strict';
// 计算某个时间距现在 多少天 多少小时 多少分钟 多少秒

export const getDateTimeDiff = old => {
  var returnText = '';
  var nowDate = new Date().getTime(); //当前时间
  var setDate = new Date(old).getTime();
  var times = Math.floor((nowDate - setDate) / 1000);
  if (times > 60 * 60 * 24 * 365) {
    returnText = Math.floor(times / (60 * 60 * 24 * 365)) + '年前';
  } else if (times > 60 * 60 * 24 * 30) {
    returnText = Math.floor(times / (60 * 60 * 24 * 30)) + '个月前';
  } else if (times > 60 * 60 * 24) {
    returnText = Math.floor(times / (60 * 60 * 24)) + '天前';
  } else if (times > 60 * 60) {
    returnText = Math.floor(times / (60 * 60)) + '小时前';
  } else if (times > 60) {
    returnText = Math.floor(times / 60) + '分钟前';
  } else if (times > 0) {
    returnText = '刚刚';
  } else {
    returnText = '刚刚';
  }
  return returnText;
};

// 格式化时间 yyyy-MM-dd hh:mm
export const dateFormat = (dateTime, format) => {
  const date = new Date(dateTime);
  let fmt = format || 'yyyy-MM-dd hh:mm';
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  }
  return fmt;
};

export const formatSeconds = result => {
  var m =
    Math.floor((result / 60) % 60) < 10
      ? '0' + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60);
  var s =
    Math.floor(result % 60) < 10
      ? '0' + Math.floor(result % 60)
      : Math.floor(result % 60);
  return (result = m + ':' + s);
};
