// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Author } from "../Author";

export type ActionWithAuthor<T> = {
  oid: string;
  timestamp: number;
  author: Author;
} & T;
