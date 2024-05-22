import { TransportAction, TransportSubAction } from "../types";

export function camelCase(input: string[]): string {
  return input
    .map(
      (word, idx) =>
        (idx === 0 ? word[0].toLowerCase() : word[0].toUpperCase()) +
        word.toLowerCase().slice(1)
    )
    .join("");
}

export function createMethodName(
  action: TransportAction,
  subAction?: TransportSubAction
): string {
  const arr = ["handle", action];
  if (subAction) arr.push(subAction);
  return camelCase(arr);
}
