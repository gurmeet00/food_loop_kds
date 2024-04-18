import { ApiURL } from "../../api/api_url.ts";
import {
  POST,
  GET,
  PUT,
  DELETE,
  ApiResponseClass,
} from "../../api/api_methods.ts";
import { GConstants } from "../../helper/g_constants.ts";

export class StoreController {
  async getStoreDetails({ _id }: { _id: any }): Promise<ApiResponseClass> {
    return await GET({
      url: ApiURL.STORE_PROFILE_URL + _id,
      //   headers: {
      //     [GConstants.AUTHORIZATION]: `${GConstants.BEARER} ${accessToken}`,
      //   },
    });
  }
  async getStartDay({ _id }: { _id: any }): Promise<ApiResponseClass> {
    return await GET({
      url: ApiURL.STORE_START_DAY_URL + _id,
    });
  }

  async getStoreOrders({
    day_id,
    store_Id,
  }: {
    day_id: any;
    store_Id: any;
  }): Promise<ApiResponseClass> {
    return await GET({
      url: ApiURL.GET_STORE_ORDERS_URL + day_id + "&store=" + store_Id,
    });
  }

  async getStoreVoidOrders({
    day_id,
    store_Id,
  }: {
    day_id: any;
    store_Id: any;
  }): Promise<ApiResponseClass> {
    return await GET({
      url: ApiURL.GET_VOID_ORDERS_URL + day_id + "&store=" + store_Id,
    });
  }
  async editOrder({_id,body}:{_id:string,body:Array<Record<string,any>>}) {
    return await POST({
      url: ApiURL.EDIT_ORDER_URL+_id,
      body: body,
    });
  }
}
