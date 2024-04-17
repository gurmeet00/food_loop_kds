export enum GConstants {
  VENDOR_DOC = "vendor_doc",
  AUTHORIZATION = "Authorization",
  BEARER = "Bearer",
}

export enum Platform {
  WEBSITE = "website",
  POS = "pos",
  MOBILE = "mobile",
  QR_WEBSTIE = "qr_website",
  QR_MOBILE = "qr_mobile",
  SKIP_THE_DISHES_POS = "skip_the_dishes_pos",
  DOOR_DASH_POS = "door_dash_pos",
  UBER_EATS_POS = "uber_eats_pos",
}

export function textUpperCase(text: string) {
  let find = text.includes("_");
  let nameArray;
  if (find) {
    nameArray = text.trim().split("_");
  } else {
    nameArray = text.trim().split(" ");
  }
  let newNameArray = [];
  for (let i = 0; i <= nameArray.length - 1; i++) {
    let found =
      nameArray[i][0].toUpperCase() +
      nameArray[i].slice(1, nameArray[i].length);
    newNameArray.push(found);
  }
  let finalName = newNameArray.join(" ");
  return finalName;
}

export function splitDateTime(item: string) {}

