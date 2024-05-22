import { ElysiaWS } from "elysia/ws";
import { ServerWebSocket } from "./bun-types";
import { InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { JwtPayload } from "jsonwebtoken";

/**
 * Type: JsonObj
 * Description: Type for a JSON object.
 */
export type JsonObj = Record<string, any>;

/**
 * Type: GeneralError
 * Description: Type for a general error object.
 */
export type GeneralError = Error | string | JsonObj;

/**
 * Enum: TransportSubAction
 * Description: Enum for the subActions that can be sent in a Transport object.
 */
export enum TransportSubAction {
  ACTION = "ACTION",
  CODE = "CODE",
  CREATE = "CREATE",
  DELETE = "DELETE",
  DESTROY = "DESTROY",
  END = "END",
  ERROR = "ERROR",
  GET = "GET",
  INVITE = "INVITE",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  MESSAGE = "MESSAGE",
  SEND = "SEND",
  SIGNUP = "SIGNUP",
  START = "START",
  STORE = "STORE",
  TURN = "TURN",
}

/**
 * Enum: TransportAction
 * Description: Enum for the actions that can be sent in a Transport object.
 */
export enum TransportAction {
  AUTH = "AUTH",
  ERROR = "ERROR",
  GROUP = "GROUP",
  GROUPS = "GROUPS",
  MESSAGE = "MESSAGE",
  NOTIFICATION = "NOTIFICATION",
  ROOM = "ROOM",
  UNKNOWN = "UNKNOWN",
  USER = "USER",
  ZONE = "ZONE",
}

/**
 * Interface: Transport
 * Description: Interface for the Transport object.
 *
 * @property auth: string - The authentication JWT token.
 * @property action: TransportAction - The action to be taken.
 * @property subAction: TransportSubAction - The optional subAction to be taken.
 * @property message: string - An optional message to be sent.
 * @property payload: T - The optional payload to be sent.
 * @property error: GeneralError - An optional error object.
 *
 */
export interface Transport<T = JsonObj> {
  auth?: string;
  action: TransportAction;
  subAction?: TransportSubAction;
  message?: string;
  payload?: T;
  error?: GeneralError;
}

/**
 * Type: WebSocketInterface
 * Description: Type for the WebSocketInterface.
 *
 */
export type WebSocketInterface = ElysiaWS<
  ServerWebSocket<{
    validator?: any;
  }>,
  MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}>
>;

/**
 * Interface: ValidTokenInterface
 * Description: Interface for the ValidToken object.
 *
 * @property user: U - The user object.
 *
 */
export interface ValidTokenInterface<U = JsonObj> extends JwtPayload {
  user?: U;
}

/**
 * Type: ActionMethod
 * Description: Type for actionMethods. This is a function that takes a WebSocketInterface, a payload, and a user object and returns a Promise of Transport.
 *
 */
export type ActionMethod = <P = JsonObj, U = JsonObj>(
  ws: WebSocketInterface,
  payload?: P,
  user?: U
) => Promise<Transport>;

/**
 * Type: MessageHandlerConfig
 * Description: This is a configuration object that maps action methods to action names.
 * The key is composed by this camel cased pattern:
 * `handle${action}${subAction}`
 * Example: handleAuthLogin
 *
 * @property noAuth: boolean - If true, the action does not require authentication.
 * @property actionMethod: ActionMethod - The method that will be called when the action is received.
 *
 */
export interface MessageHandlerConfig {
  [key: string]: {
    noAuth: boolean;
    actionMethod: ActionMethod;
  };
}
