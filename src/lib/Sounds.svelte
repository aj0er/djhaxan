<script lang="ts">
    import Item from "./Item.svelte";
    import { createEventDispatcher } from "svelte";
    import type { Sound } from "../model";
    const dispatch = createEventDispatcher();

    export let sounds: Sound[];

    function add(e: { detail: Sound }) {
        dispatch("add", e.detail);
    }

    function createSound() {
        dispatch("createSound");
    }
</script>

<div class="sequence">
    {#each sounds as item}
        <Item on:add={add} item={item} />
    {/each}
    <div class="sound placeholder" on:click={createSound} on:keydown={createSound}>
        ➕
    </div>
</div>
