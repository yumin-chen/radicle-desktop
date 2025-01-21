// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Action } from "../patch/Action";
import type { ActionWithAuthor } from "./ActionWithAuthor";
import type { RefUpdate } from "./RefUpdate";
import type { State } from "../patch/State";

export type Patch = {
  rowId: string;
  id: string;
  update: RefUpdate;
  timestamp: number;
  title: string;
  status: State;
  actions: Array<ActionWithAuthor<Action>>;
};
