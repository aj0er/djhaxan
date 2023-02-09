<script lang="ts">
    import Item from "./Item.svelte";
    import { createEventDispatcher } from "svelte";
    import type { Sound } from "../model";
    const dispatch = createEventDispatcher();

    export let sounds: Sound[];

    /**
     * Called when a sound is supposed to be added to the song
     * @param e Item add sound event
     */
    function add(e: { detail: Sound }) {
        dispatch("add", e.detail);
    }

    /**
     * Called when the create sound button is called.
     */
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
