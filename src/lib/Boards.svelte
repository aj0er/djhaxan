<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let boards = [
        {
            name: "Häxan surtant",
            url: "https://te19adjo.kgwebb.se/sb/hax.php",
        },
    ];
</script>

<div class="boards">
    {#each boards as board}
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
