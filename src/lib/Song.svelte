<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { dndzone } from "svelte-dnd-action";
    import type { SongItem } from "../model";
    import Item from "./Item.svelte";

    const dispatch = createEventDispatcher();

    export let song: SongItem[];

    function handler(e: { detail: { items: SongItem[]; }; }) {
        song = e.detail.items;
    }
</script>

<h2>Song</h2>
<div
    class="sequence"
    oncontextmenu="return false;"
    use:dndzone={{ items: song, dropTargetStyle: {} }}
    on:consider={handler}
    on:finalize={handler}
>
    {#each song as item (item.id)}
        <Item on:remove={(e) => dispatch("remove", e.detail)} item={item} />
    {/each}
</div>
