<script lang="ts">
  import type { Config } from "@bindings/config/Config";
  import type { UnlistenFn } from "@tauri-apps/api/event";
  import type { SyncStatus } from "@bindings/repo/SyncStatus";

  import { SvelteMap } from "svelte/reactivity";
  import { onDestroy, onMount } from "svelte";

  import { invoke } from "@app/lib/invoke";
  import { listen } from "@tauri-apps/api/event";

  import * as router from "@app/lib/router";
  import { nodeRunning, syncStatus } from "@app/lib/events";
  import { theme } from "@app/components/ThemeSwitch.svelte";
  import { unreachable } from "@app/lib/utils";

  import AuthenticationError from "@app/views/AuthenticationError.svelte";
  import CreateIssue from "@app/views/repo/CreateIssue.svelte";
  import Inbox from "./views/home/Inbox.svelte";
  import Issue from "@app/views/repo/Issue.svelte";
  import Issues from "@app/views/repo/Issues.svelte";
  import Patch from "@app/views/repo/Patch.svelte";
  import Patches from "@app/views/repo/Patches.svelte";
  import Repos from "./views/home/Repos.svelte";
  import { dynamicInterval, checkAuth } from "./lib/auth";

  const activeRouteStore = router.activeRouteStore;

  let unlistenEvents: UnlistenFn | undefined = undefined;
  let unlistenNodeEvents: UnlistenFn | undefined = undefined;
  let unlistenSyncStatus: UnlistenFn | undefined = undefined;

  let error = $state<undefined | unknown>();

  onMount(async () => {
    try {
      await invoke<Config>("startup");
    } catch (e: unknown) {
      error = e;
      return;
    }

    if (window.__TAURI_INTERNALS__) {
      unlistenEvents = await listen("event", () => {
        // Add handler for incoming events
      });

      unlistenSyncStatus = await listen<Record<string, SyncStatus>>(
        "sync_status",
        event => {
          syncStatus.set(new SvelteMap(Object.entries(event.payload)));
        },
      );

      unlistenNodeEvents = await listen<boolean>("node_running", event => {
        nodeRunning.set(event.payload);
      });
    }

    try {
      await invoke("authenticate");
      void router.loadFromLocation();
      void dynamicInterval(
        checkAuth,
        import.meta.env.VITE_AUTH_LONG_DELAY || 30_000,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      void router.push({
        resource: "authenticationError",
        params: {
          error: e.err,
          hint: e.hint,
        },
      });
      void dynamicInterval(checkAuth, 1000);
    }
  });

  onDestroy(() => {
    if (unlistenEvents) {
      unlistenEvents();
    }
    if (unlistenSyncStatus) {
      unlistenSyncStatus();
    }
    if (unlistenNodeEvents) {
      unlistenNodeEvents();
    }
  });

  $effect(() => document.documentElement.setAttribute("data-theme", $theme));
</script>

{#if $activeRouteStore.resource === "booting"}
  {#if error && typeof error === "object" && "err" in error && typeof error.err === "string"}
    <AuthenticationError error={error.err} />
  {/if}
  <!-- Don't show anything -->
{:else if $activeRouteStore.resource === "home"}
  <Repos {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "inbox"}
  <Inbox {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "repo.createIssue"}
  <CreateIssue {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "repo.issue"}
  <Issue {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "repo.issues"}
  <Issues {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "repo.patch"}
  <Patch {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "repo.patches"}
  <Patches {...$activeRouteStore.params} />
{:else if $activeRouteStore.resource === "authenticationError"}
  <AuthenticationError {...$activeRouteStore.params} />
{:else}
  {unreachable($activeRouteStore)}
{/if}
