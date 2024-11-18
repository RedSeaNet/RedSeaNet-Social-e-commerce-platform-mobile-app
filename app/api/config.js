import axios from 'axios';
import {BASE_URL} from '../utils/constant';
let service = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
});
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=utf-8';

export default service;
