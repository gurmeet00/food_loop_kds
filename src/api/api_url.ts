const SOCKET_BASE_URL =
  process.env.NODE_ENV == "development"
    ? "https://loopbackendnew.loop.rockymountaintech.co/api/"
    : "https://loopbackendnew.loop.rockymountaintech.co/api/";

export const ApiURL = {
  // IMAGE_BASE_URL: 'https://storage.googleapis.com/vendor_management/',
  STORE_PROFILE_URL: `${SOCKET_BASE_URL}store/profile-web/`,
  GET_STORE_ORDERS_URL: `${SOCKET_BASE_URL}order/get-kds?id=`,
  GET_STORE_COMPLETED_ORDERS_URL: `${SOCKET_BASE_URL}order/get-kds?id=`,
  GET_ACCEPT_ORDERS_URL: `${SOCKET_BASE_URL}order/accept/`,

  STORE_START_DAY_URL: `${SOCKET_BASE_URL}store_end_day/profile/`,
  GET_VOID_ORDERS_URL: `${SOCKET_BASE_URL}order/complete-void-kds?id=`,
  UPDATE_ORDER_URL: `${SOCKET_BASE_URL}order/update-by-kds/`,
  READY_TO_PICK_ORDER_URL: `${SOCKET_BASE_URL}order/ready-to-pick/`,
};
export enum ApiStatus {
  STATUS_100 = 100, //informational
  STATUS_200 = 200, //successful response/
  STATUS_400 = 400, //bad request client error
  STATUS_401 = 401, //unauthenticated
  STATUS_404 = 404, //not found
  STATUS_409 = 409, //conflict/
  STATUS_500 = 500, //server error responses/
}
