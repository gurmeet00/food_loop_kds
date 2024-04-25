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
  // API FOR GET STORE DETAIL

  async getStoreDetails({ _id }: { _id: any }): Promise<ApiResponseClass> {
    return await GET({
      url: ApiURL.STORE_PROFILE_URL + _id,
      //   headers: {
      //     [GConstants.AUTHORIZATION]: `${GConstants.BEARER} ${accessToken}`,
      //   },
    });
  }

  // API FOR STORE DAY ID

  async getStartDay({ _id }: { _id: any }): Promise<ApiResponseClass> {
    return await GET({
      url: ApiURL.STORE_START_DAY_URL + _id,
    });
  }

  // API FOR ALL STORE ORDERS

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

  // API FOR COMPLETED ORDERS

  async getStoreCompletedOrders({
    day_id,
    store_Id,
  }: {
    day_id: any;
    store_Id: any;
  }): Promise<ApiResponseClass> {
    return await GET({
      url:
        ApiURL.GET_STORE_COMPLETED_ORDERS_URL + day_id + "&store=" + store_Id,
    });
  }

  // API FOR CANCEL ORDERS
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
  async updateOrder({
    _id,
    body,
  }: {
    _id: string | null;
    body: Array<Record<string, any>>;
  }) {
    return await PUT({
      url: ApiURL.UPDATE_ORDER_URL + _id,
      body: body,
    });
  }

  // ACCPET ORDER OR TAKE ORDER BY CHEF
  async accpetOrder({ _id }: { _id: string }) {
    return await PUT({
      url: ApiURL.GET_ACCEPT_ORDERS_URL + _id,
    });
  }

  // READDY TO PICK ORDER
  async readyToPickOrder({ _id }: { _id: string }) {
    return await PUT({
      url: ApiURL.READY_TO_PICK_ORDER_URL + _id,
    });
  }
}
