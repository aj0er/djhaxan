<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Item from "./Item.svelte";

    const dispatch = createEventDispatcher();

    export let speed;
    export let playbackRate;

    function play(_) {
        dispatch("play");
    }

    function add(e) {
        dispatch("add", e.detail);
    }
</script>

<div class="options">
    <div class="custom-items">
        <Item on:add={add} data={{ type: "SCRIPT" }} />
    </div>
    <div class="settings">
        <div class="input-gap">
            BPM <input
                bind:value={speed}
                type="range"
                step={100}
                min={0}
                max={1500}
            />
        </div>
        <div class="input-gap">
            Playback <input
                bind:value={playbackRate}
                type="range"
                step={0.05}
                min={0.05}
                max={5.0}
            />
        </div>

        <button class="play" on:click={play}>Play ▶</button>
    </div>
</div>

<style>
    .custom-items {
        background-color: rgb(51, 51, 51);
        padding: 20px;
        border-radius: 15px;
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .input-gap {
        display: flex;
        gap: 5px;
    }

    .settings {
        margin-top: 10px;
        background-color: rgb(51, 51, 51);
        padding: 20px;
        border-radius: 15px;
    }

    .options {
        max-width: 17rem;
    }

    .play {
        padding: 10px 12px;
        padding-right: 8px;
        border-radius: 10px;
        cursor: pointer;
        border: none;
        width: 100%;
        margin-top: 10px;
    }
</style>
