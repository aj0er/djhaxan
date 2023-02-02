<script lang="ts">
    import Item from "./Item.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let items;

    function add(e) {
        dispatch("add", e.detail);
    }

    function addSound() {
        dispatch("addSound");
    }
</script>

<div class="sequence">
    {#each items as item}
        <Item on:add={add} data={item} />
    {/each}
    <div class="sound placeholder" on:click={addSound} on:keydown={addSound}>
        ➕
    </div>
</div>
