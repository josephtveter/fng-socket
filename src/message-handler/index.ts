import {
  JsonObj,
  MessageHandlerConfig,
  Transport,
  TransportAction,
  WebSocketInterface,
} from "../types";
import { validateToken } from "../util.ts/authentication.util";
import { createMethodName } from "../util.ts/string.util";

/**
 * Method: createMesssageHandler
 * Description: Creates a message handler function. 
 *
 * @param config: MessageHandlerConfig
 * @returns (ws: WebSocketInterface, message: Transport) => Promise<Transport>
 * 
 * Example:
 * ```
const app = new Elysia({
  websocket: {
    idleTimeout: 180,
  },
});

const config = {
  handleZoneJoin: {
    actionMethod: <ZonePayload, User>(
      ws: WebSocketInterface,
      payload?: ZonePayload,
      user?: User 
    ) => {
      ...
    }
  },
  handleMessageSend: (
    ws: WebSocketInterface,
    payload?: JsonObj,
    user?: JsonObj 
  ) => {
    ...
  }
} as MessageHandlerConfig 

const handler = createMesssageHandler(config);

app.ws("/ws", {
  message: async (ws: WebSocketInterface, message: Transport) => {
    try {
      if (typeof message === "object") {
        const res = await createMesssageHandler(ws, message);
        if (res) {
          ws.send(res);
        }
      } else {
        throw new Error("Invalid message");
      }
    } catch (err) {
      ws.send({
        action: TransportAction.ERROR,
        error: err,
        message: err.message,
      });
    }
  }
});
```
 *
 */
export function createMesssageHandler(config: MessageHandlerConfig) {
  return async function handleMessage(
    ws: WebSocketInterface,
    message: Transport
  ) {
    const { auth, action, payload, subAction } = message;
    let user: JsonObj | undefined;

    const methodName = createMethodName(action, subAction);
    const actionObj = config[methodName];
    if (!actionObj) {
      throw new Error(`Invalid Action ${methodName}`);
    }

    const { noAuth, actionMethod } = actionObj;
    // TODO Handle No Auth
    if (action !== TransportAction.AUTH && noAuth === false) {
      if (!auth) {
        throw new Error("Not Logged in");
      } else {
        const res = validateToken(auth);
        user = res.user;
      }
    }
    return actionMethod(ws, payload, user);
  };
}
