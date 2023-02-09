<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let scriptModal: boolean;

    let script: string;

    function save() {
        dispatch("add", script);
        close();
    }

    function close() {
        script = "";
        scriptModal = null;
    }
</script>

{#if scriptModal }
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-bg" on:click|stopPropagation={close}>
        <div on:click|stopPropagation class="modal-content">
            <h1>Add JavaScript</h1>
            <textarea bind:value={script} /><br />

            <button on:click={save}>Add</button>
        </div>
    </div>
{/if}

<style>
    textarea {
        resize: none;
        width: 100%;
        min-height: 7rem;
        margin-bottom: 20px;
    }
</style>
