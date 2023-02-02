<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { globalIcons, loadedSounds } from "../loadedSounds";

    const dispatch = createEventDispatcher();
    function play() {
        if (data.sound) {
            new Audio(loadedSounds.sounds[data.sound].sound).play();
        }

        dispatch("add", data);
    }

    function mouseDown(e) {
        if (e.buttons == 1) {
            play();
        } else if (e.buttons == 2) {
            dispatch("remove", data);
        }
    }

    function getImage(data) {
        if (data.sound) return loadedSounds.sounds[data.sound].image;

        return globalIcons[data.type];
    }

    export let data;
</script>

<div class="sound" on:mousedown={mouseDown}>
    <img alt="Sound.." src={getImage(data)} />
</div>

<style>
    img {
        width: 3rem;
        min-height: 56px;
        border-radius: 10px;
    }
</style>
