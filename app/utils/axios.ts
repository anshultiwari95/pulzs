import axios from 'axios';
interface axiosProps {
  url: string;
  method: 'post' | 'get';
  body: any;
  headers?: any;
}
const BASE_URL = "https://pulze-backend.onrender.com/api"
export async function fetchData<T = unknown>({ url, body, method, headers = null }: axiosProps): Promise<any> {
  url = BASE_URL + url;
  console.log("url", url)
  if (!headers) {
    headers = {
      'Content-Type': 'application/json',
    };
  }
  const config = {
    method: method,
    maxBodyLength: Infinity,
    url: url,
    headers: headers,
    data: body,
  };
  const response = await axios.request(config).then((res) => {
    if (res?.data?.Code == 0) {
      return res?.data?.PayLoad;
    } else {
      throw 'Code Error';
    }
  });

  return response;
}