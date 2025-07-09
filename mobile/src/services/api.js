import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.select({
  ios: 'http://localhost:5001/api',
  android: 'http://10.0.2.2:5001/api',
  default: 'http://localhost:5001/api'
});

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;