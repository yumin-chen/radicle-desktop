<script lang="ts">
  import type { DiffContent } from "@bindings/diff/DiffContent";
  import type { FileDiff } from "@bindings/diff/FileDiff";
  import type { Modification } from "@bindings/diff/Modification";

  import escape from "lodash/escape";

  import File from "@app/components/File.svelte";
  import Icon from "@app/components/Icon.svelte";

  interface Props {
    filePath: string;
    oldFilePath?: string | undefined;
    fileDiff: DiffContent;
    headerBadgeCaption: FileDiff["status"];
    expanded: boolean;
  }

  const {
    filePath,
    oldFilePath = undefined,
    fileDiff,
    headerBadgeCaption,
    expanded,
  }: Props = $props();

  function lineNumberR(line: Modification): string | number {
    switch (line.type) {
      case "addition": {
        return line.lineNo;
      }
      case "context": {
        return line.lineNoNew;
      }
      case "deletion": {
        return " ";
      }
    }
  }

  function lineNumberL(line: Modification): string | number {
    switch (line.type) {
      case "addition": {
        return " ";
      }
      case "context": {
        return line.lineNoOld;
      }
      case "deletion": {
        return line.lineNo;
      }
    }
  }

  function lineSign(line: Modification): string {
    switch (line.type) {
      case "addition": {
        return "+";
      }
      case "context": {
        return " ";
      }
      case "deletion": {
        return "-";
      }
    }
  }
</script>

<style>
  .container {
    font-size: var(--font-size-small);
    overflow-x: auto;
  }
  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  .browse {
    margin-left: auto;
  }
  .expand-button {
    cursor: pointer;
    user-select: none;
    margin-right: 0.5rem;
  }
  .diff {
    font-family: var(--font-family-monospace);
    table-layout: fixed;
    border-collapse: collapse;
    margin: 0.5rem 0;
    -webkit-touch-callout: initial;
    -webkit-user-select: text;
    user-select: text;
  }
  .diff-line {
    vertical-align: top;
  }
  .diff-line.type-addition > * {
    background-color: var(--color-fill-diff-green-light);
  }
  .diff-line.type-deletion > * {
    background-color: var(--color-fill-diff-red-light);
  }

  .diff-line.selected > * {
    background-color: var(--color-fill-float-hover);
  }
  .diff-line.selected.type-addition > * {
    background-color: var(--color-fill-diff-green);
  }
  .diff-line.selected.type-deletion > * {
    background-color: var(--color-fill-diff-red);
  }

  .type-addition > .diff-line-number,
  .type-addition > .diff-line-type {
    color: var(--color-foreground-success);
  }
  .type-deletion > .diff-line-number,
  .type-deletion > .diff-line-type {
    color: var(--color-foreground-red);
  }

  .diff-line.selected .selection-indicator-left {
    background-color: var(--color-fill-secondary);
  }
  .type-addition.diff-line.selected .selection-indicator-left {
    background-color: var(--color-fill-secondary);
  }
  .type-deletion.diff-line.selected .selection-indicator-left {
    background-color: var(--color-fill-secondary);
  }

  .diff-line.selected .selection-indicator-right {
    background-color: var(--color-fill-secondary);
  }
  .type-addition.diff-line.selected .selection-indicator-right {
    background-color: var(--color-fill-secondary);
  }
  .type-deletion.diff-line.selected .selection-indicator-right {
    background-color: var(--color-fill-secondary);
  }

  .selection-start {
    box-shadow: 0 -1px 0 0 var(--color-fill-secondary);
    z-index: 1;
  }
  .selection-end {
    box-shadow: 0 1px 0 0 var(--color-fill-secondary);
    z-index: 1;
  }

  .selection-start.selection-end {
    box-shadow: 0 0 0 1px var(--color-fill-secondary);
    z-index: 1;
  }

  .diff-line-number {
    font-family: var(--font-family-monospace);
    text-align: right;
    user-select: none;
    line-height: 1.5rem;
    min-width: 3rem;
    color: var(--color-foreground-disabled);
    -webkit-user-select: none;
    user-select: none;
  }
  .diff-line-number.left {
    position: relative;
    padding: 0 0.5rem 0 0.75rem;
  }
  .selection-indicator-left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
  }
  .selection-indicator-right {
    display: none; /* FIXME: fix the selection indicator */
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
  }
  .diff-line-number.right {
    padding: 0 0.75rem 0 0.5rem;
  }
  .diff-line-content {
    color: unset !important;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    width: 100%;
    padding-right: 0.5rem;
  }
  .diff-line-type {
    text-align: center;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    -webkit-user-select: none;
    user-select: none;
  }
  .diff-expand-header {
    padding-left: 0.5rem;
    color: var(--color-foreground-dim);
  }
  .added {
    color: var(--color-foreground-success);
    background-color: var(--color-fill-diff-green-light);
  }
  .deleted {
    color: var(--color-foreground-red);
    background-color: var(--color-fill-diff-red-light);
  }
  .moved,
  .copied {
    color: var(--color-foreground-dim);
    background: var(--color-fill-ghost);
  }
</style>

{#snippet styledPath(fullPath: string)}
  <!-- prettier-ignore -->
  <span class="txt-small" style:white-space="nowrap" style:-webkit-touch-callout="initial" style:-webkit-user-select="text" style:user-select="text"><span style:color="var(--color-fill-gray)" style:font-weight="var(--font-weight-regular)">{fullPath.match(/^.*\/|/)?.values().next().value}</span><span style:font-weight="var(--font-weight-semibold)">{fullPath.split("/").slice(-1)}</span></span>
{/snippet}

{#snippet emptyPlaceholder()}
  <div class="global-flex" style:margin="1rem 0" style:justify-content="center">
    <Icon name="none" />Empty file
  </div>
{/snippet}

<File {expanded}>
  {#snippet leftHeader()}
    {#if (headerBadgeCaption === "moved" || headerBadgeCaption === "copied") && oldFilePath}
      <span style="display: flex; align-items: center; flex-wrap: wrap;">
        {@render styledPath(filePath)}
        <span style:padding="0 0.5rem">→</span>
        {@render styledPath(filePath)}
      </span>
    {:else}
      {@render styledPath(filePath)}
    {/if}

    {#if headerBadgeCaption === "added"}
      <span class="global-counter added">added</span>
    {:else if headerBadgeCaption === "deleted"}
      <span class="global-counter deleted">deleted</span>
    {:else if headerBadgeCaption === "moved"}
      <span class="global-counter moved">moved</span>
    {:else if headerBadgeCaption === "copied"}
      <span class="global-counter copied">copied</span>
    {/if}
  {/snippet}

  {#snippet children()}
    <div class="container">
      {#if fileDiff.type === "plain"}
        {#if fileDiff.hunks.length > 0}
          <table class="diff" data-file-diff-select>
            {#each fileDiff.hunks as hunk, hunkIdx}
              <!-- svelte-ignore node_invalid_placement_ssr -->
              <tr class="diff-line hunk-header">
                <td colspan={2} style:position="relative">
                  <div class="selection-indicator-left"></div>
                </td>
                <td
                  colspan={6}
                  class="diff-expand-header"
                  style:position="relative">
                  {hunk.header}
                  <div class="selection-indicator-right"></div>
                </td>
              </tr>
              {#each hunk.lines as line, lineIdx}
                <!-- svelte-ignore node_invalid_placement_ssr -->
                <tr
                  style="position: relative;"
                  class={`diff-line type-${line.type}`}>
                  <td
                    id={[filePath, "H" + hunkIdx, "L" + lineIdx].join("-")}
                    class="diff-line-number left">
                    <div class="selection-indicator-left"></div>
                    {lineNumberL(line)}
                  </td>
                  <td class="diff-line-number right">
                    {lineNumberR(line)}
                  </td>
                  <td class="diff-line-type" data-line-type={line.type}>
                    {lineSign(line)}
                  </td>
                  <td class="diff-line-content">
                    {#if line.highlight?.items.length === 0 || line.line === ""}
                      <br />
                    {:else if line.highlight}
                      {@html line.highlight.items
                        .map(
                          s =>
                            `<span class="syntax ${s.style}">${escape(s.item)}</span>`,
                        )
                        .join("")}
                    {:else}
                      {line.line}
                    {/if}
                  </td>
                  <td class="selection-indicator-right"></td>
                </tr>
              {/each}
            {/each}
          </table>
        {:else}
          {@render emptyPlaceholder()}
        {/if}
      {:else}
        {@render emptyPlaceholder()}
      {/if}
    </div>
  {/snippet}
</File>
