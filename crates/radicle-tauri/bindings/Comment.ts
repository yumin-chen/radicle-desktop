// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Author } from "./Author";
import type { Edit } from "./Edit";
import type { Reaction } from "./Reaction";

export type Comment<T> = {
  id: string;
  author: Author;
  edits: Array<Edit>;
  reactions: Array<Reaction>;
  replyTo?: string;
  location?: T;
  embeds: { name: string; content: string }[];
  resolved: boolean;
};
