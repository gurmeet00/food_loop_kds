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
import { useDispatch } from "react-redux";
import { GetUpOrder } from "../Home.tsx";

export class SocketController {
  private socket: Socket;
  private isConnected: boolean = false;
  private NEW_ORDER_DATA_CHANNEL: string = "orders";
  private UPDATE_ORDER_DATA_CHANNEL: string = "updated_order";

  public connect(storeId, allOrdersData) {
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
          console.log("====================================");
          console.log(allOrdersData);
          console.log("====================================");
          this.isConnected = true;
          this.updateOrder(allOrdersData);
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
      let trackArr = { ...data };
      console.log("====================================");
      console.log(trackArr);
      console.log("====================================");
    });
  }

  public emit() {
    this.socket.on("emit", (data) => {
      console.log(`EMIT WORKED ${data}`);
    });
  }
  public updateOrder(allOrders) {
    this.socket.on("updated_order", (data) => {
      let updatedOrder = { ...data };

      console.log("UPDATE_ORDER", updatedOrder);
      console.log("all", allOrders);
      console.log(allOrders.indexOf(updatedOrder));

      // GetUpOrder(updatedOrder);
    });
  }
}
