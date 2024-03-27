import axios from 'axios'
import { ApiStatus } from './api_url';

export async function POST({ url, body, headers }: { url: string, body?: any, headers?: Record<any, any> }): Promise<ApiResponseClass> {

  let responseClass = new ApiResponseClass({});
  await axios.post(url, body, {
    headers: headers == undefined ? {} : headers
  }).then((response) => {
    responseClass.status = response.status;
    responseClass.data = response.data;
  }).catch((e) => {
    responseClass.status = e.response.status;
    responseClass.data = e.response.data;
  })
  return responseClass;
}

export async function GET({ url, headers, body }: { url: string, headers?: Record<any, any>, body?: object }): Promise<ApiResponseClass> {
  let responseClass = new ApiResponseClass({});
  await axios.get(url, {
    headers: headers == undefined ? {} : headers
  }).then((response) => {
    responseClass.status = response.status;
    responseClass.data = response.data;
  }).catch((e) => {
    console.log(e);

    responseClass.status = e.response.status;
    responseClass.data = e.response.data;
  })
  return responseClass;
}



export async function PUT({ url, body, headers }: { url: string, body?: any, headers?: Record<any, any> }): Promise<ApiResponseClass> {

  let responseClass = new ApiResponseClass({});
  await axios.put(url, body, {
    headers: headers == undefined ? {} : headers
  }).then((response) => {
    responseClass.status = response.status;
    responseClass.data = response.data;
  }).catch((e) => {
    responseClass.status = e.response.status;
    responseClass.data = e.response.data;
  })

  return responseClass;
}

export async function DELETE({ url, headers }: { url: string, headers?: Record<any, any> }): Promise<ApiResponseClass> {
  let responseClass = new ApiResponseClass({});
  await axios.delete(url, {
    headers: headers == undefined ? {} : headers
  }).then((response) => {
    responseClass.status = response.status;
    responseClass.data = response.data;
  }).catch((e) => {
    responseClass.status = e.response.status;
    responseClass.data = e.response.data;
  })
  return responseClass;
}


export class ApiResponseClass {
  status?: number;
  data?: any;
  constructor({ status, data }: { status?: number, data?: any }) {
    this.status = status;
    this.data = data;
  }
}


