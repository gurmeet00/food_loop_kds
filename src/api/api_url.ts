const BASE_URL =
  //  'https://vendor-backend.server.loopos.ca/api/'
  process.env.NODE_ENV !== "development"
    ? "https://tamimi-backend.app.scenetech.co/api/"
    : "http://localhost:6767/api/";

export const ApiURL = {
  // IMAGE_BASE_URL: 'https://storage.googleapis.com/vendor_management/',
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
