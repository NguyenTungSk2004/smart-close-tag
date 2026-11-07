declare function suite(name: string, fn: () => void): void;
declare function test(name: string, fn: () => void | Promise<void>): void;

declare namespace suite {
  function only(name: string, fn: () => void): void;
  function skip(name: string, fn: () => void): void;
}

declare namespace test {
  function only(name: string, fn: () => void | Promise<void>): void;
  function skip(name: string, fn: () => void | Promise<void>): void;
}

declare module 'assert' {
  export function ok(value: unknown, message?: string | Error): void;
  export function strictEqual<T>(actual: unknown, expected: T, message?: string | Error): void;
  export function deepStrictEqual<T>(actual: unknown, expected: T, message?: string | Error): void;
  export function notStrictEqual(actual: unknown, expected: unknown, message?: string | Error): void;
}
