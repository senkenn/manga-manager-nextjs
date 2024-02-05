export type TypedOmit<T, K extends keyof T> = Omit<T, K>;

export const ObjectKeys = <T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
  return Object.keys(obj);
};

type Err<T> = {
  error: {
    type: string;
  } & {
    [K in keyof T]: T[K];
  };
};

export function err<T extends { type: string }>(functionName: string, param: T): Err<T> {
  console.error(functionName, 'err', param);
  return {
    error: {
      ...param,
    },
  };
}

// TODO: #20 ok function's return type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ok<T>(functionName: string, param?: T) {
  console.log(functionName, 'ok', param);
  if (param) {
    return {
      ...param,
      error: undefined,
    };
  } else {
    return {
      error: undefined,
    };
  }
}

/**
 * @example using Result
 * - ResultNonReturnTypeFunction = Result<unknown, unknown>
 * - ResultReturnTypeFunction = Result<AnyType, unknown>
 * - ResultReturnNotFoundErrorFunction = Result<unknown, {
 *     type: "not-found";
 *   }>
 */
export type Result<T, E extends { type: unknown }> =
  | (T & { error?: undefined })
  | ({ [K in keyof T]?: undefined } & { error: E });
