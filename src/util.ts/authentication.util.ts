import { ValidTokenInterface } from "../types";
import jwt from "jsonwebtoken";

/**
 * Method: validateToken
 * Description: Validates the token and returns the JWT with a user object.
 *
 * @param bearer: string
 * @returns ValidTokenInterface
 * @throws Error
 *
 */
export function validateToken(bearer: string): ValidTokenInterface {
  if (typeof bearer !== "string") {
    throw new Error("Invalid auth token");
  }
  const token = bearer.split(" ")[1] || bearer;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("No JWT secret found. Please set JWT_SECRET in .env file.");
  }
  try {
    return jwt.verify(token, secret) as ValidTokenInterface;
  } catch (err) {
    throw new Error("Invalid Token. Please log in again.");
  }
}
