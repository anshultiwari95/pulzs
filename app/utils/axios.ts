import axios from 'axios';
interface axiosProps {
  url: string;
  method: 'post' | 'get';
  body: any;
  headers?: any;
}
// const BASE_URL = "https://pulze-backend.onrender.com/api"
const BASE_URL = "http://localhost:8080"
export async function fetchData<T = unknown>({ url, body, method, headers = null }: axiosProps): Promise<any> {
  try
  {
    url = BASE_URL + url;
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
    const response = await axios.request(config)
    // .then((res) => {
    //   if (res?.status == 200) {
    //     return res?.data?.PayLoad;
    //   } else {
    //     throw 'Code Error';
    //   }
    // });

    if(response?.status == 200)
    {
        return response?.data
    }
    else
    {
      const error = {
        errorCode: response.status,
        message: response.statusText
      }
      throw(error)
    }
  }
  catch(ex)
  {
    console.log("error in axios", ex)
    throw(ex)
  }
  
}