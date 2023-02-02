<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { dndzone } from "svelte-dnd-action";
    import Item from "./Item.svelte";

    const dispatch = createEventDispatcher();

    export let added;

    function handler(e) {
        added = e.detail.items;
    }
</script>

<h2>Song</h2>
<div
    class="sequence"
    oncontextmenu="return false;"
    use:dndzone={{ items: added, dropTargetStyle: {} }}
    on:consider={handler}
    on:finalize={handler}
>
    {#each added as item (item.id)}
        <Item on:remove={(e) => dispatch("remove", e.detail)} data={item} />
    {/each}
</div>
