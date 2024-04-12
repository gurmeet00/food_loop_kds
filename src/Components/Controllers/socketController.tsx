import { ApiURL } from "../../api/api_url.ts";
import {
  POST,
  GET,
  PUT,
  DELETE,
  ApiResponseClass,
} from "../../api/api_methods.ts";
import io, { Socket } from "socket.io-client";
import { GConstants } from "../../helper/g_constants.ts";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";

export class SocketController {
  private socket: Socket;
  private isConnected: boolean = false;
  private NEW_ORDER_DATA_CHANNEL: string = "orders";
  private UPDATE_ORDER_DATA_CHANNEL: string = "updated_order";

  public connect(storeId?: string) {
    try {
      if (!this.isConnected) {
        if (storeId != null && storeId != undefined && storeId != "") {
          this.socket = io(
            `wss://loopbackendnew.loop.rockymountaintech.co?store=659e6700e0ec95ac62733139`,
            {
              transports: ["websocket"],
              autoConnect: true,
            }
          );

          this.isConnected = true;
          console.log("Connected true");
          this.emit();
          this.newOrder();
        }
      } else {
        console.log("SOCKET ALREADY CONNECTED");
      }
    } catch (err) {
      console.log(`${err}`);
    }
  }

  public disConnect() {
    this.socket.close();
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.isConnected = false;
    console.log("Socket Disconnected");
  }
  public newOrder() {
    this.socket.on("orders", (data) => {
      console.log(`Order ${data}`);
    });
  }

  public emit() {
    this.socket.on("emit", (data) => {
      console.log(`EMIT WORKED ${data}`);
    });
  }
}
