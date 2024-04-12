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
}
