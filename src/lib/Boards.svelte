<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SoundBoardPreset } from "../model";
    const dispatch = createEventDispatcher();

    let boards: SoundBoardPreset[] = [
        {
            name: "Häxan surtant",
            url: "soundboards/haxansurtant.json",
        },
    ];
</script>

<div class="boards">
    {#each boards as board}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="board" on:click={() => dispatch("select", board.url)}>
            {board.name}
        </div>
    {/each}
</div>

<style>
    .board {
        background-color: rgb(51, 51, 51);
        padding: 10px;
        cursor: pointer;
        border-radius: 10px;
    }

    .boards {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
</style>
