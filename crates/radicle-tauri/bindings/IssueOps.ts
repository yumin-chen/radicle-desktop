// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Author } from "./Author";
import type { IssueAction } from "./IssueAction";

export type IssueOps = {
  id: string;
  action: IssueAction;
  timestamp: number;
  author: Author;
};
