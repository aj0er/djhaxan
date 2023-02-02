<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let soundModal = null;

    function close() {
        soundModal = null;
    }

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

    function readFileToBase64(file) {
        return new Promise((resolve) => {
            let reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = function () {
                resolve(reader.result);
            };
        });
    }
</script>

{#if soundModal != null}
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
