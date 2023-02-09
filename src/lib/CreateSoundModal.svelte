<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { CreateSoundModalData } from "../model";

    const dispatch = createEventDispatcher();
    export let soundModal: CreateSoundModalData = null;

    function close() {
        soundModal = null;
    }

    /**
     * Called when a sound should be created.
     * Loads the files as Base64 and dispatches event to the parent.
     */
    function save() {
        if (soundModal.sound != null && soundModal.image != null) {
            Promise.all([
                readFileToBase64(soundModal.sound[0]),
                readFileToBase64(soundModal.image[0]),
            ]).then((values) => {
                dispatch("add", {
                    sound: values[0],
                    image: values[1],
                });

                close();
            });
        }
    }

    /**
     * Reads a file to a Base64 string.
     * @param file File to read.
     */
    function readFileToBase64(file: File): Promise<string> {
        return new Promise((resolve) => {
            let reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
        });
    }
</script>

{#if soundModal != null}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-bg" on:click|stopPropagation={close}>
        <div on:click|stopPropagation class="modal-content">
            <h1>Add sound</h1>
            Sound:<input type="file" bind:files={soundModal.sound} /><br /><br
            />
            Image: <input type="file" bind:files={soundModal.image} /><br /><br
            />

            <button on:click={save}>Add</button>
        </div>
    </div>
{/if}
