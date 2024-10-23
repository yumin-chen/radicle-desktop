// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Embed } from "../thread/Embed";
import type { State } from "./State";

export type Action =
  | { type: "assign"; assignees: Array<string> }
  | { type: "edit"; title: string }
  | { type: "lifecycle"; state: State }
  | { type: "label"; labels: Array<string> }
  | { type: "comment"; body: string; replyTo?: string; embeds?: Array<Embed> }
  | { type: "comment.edit"; id: string; body: string; embeds?: Array<Embed> }
  | { type: "comment.redact"; id: string }
  | { type: "comment.react"; id: string; reaction: string; active: boolean };
