import { Http } from './../../lib/client';

const http = new Http();
export default function servicesReducer() {
  return {
    http,
  };
}
