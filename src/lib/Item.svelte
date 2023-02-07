<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { globalIcons, loadedSounds } from "../loadedSounds";
    import {
        type SongItem,
        type Sound,
        isAudioData,
    } from "../model";

    const dispatch = createEventDispatcher();

    export let item: Sound | SongItem;

    function onLeftClick() {
        if (item.data && isAudioData(item.data)) {
            new Audio(loadedSounds.sounds[item.data.sound].sound).play();
        }

        dispatch("add", item);
    }

    function onMouseDown(e: MouseEvent) {
        switch (e.buttons) {
            case 1: { // Left click
                onLeftClick();
                break;
            }

            case 2: { // Right click
                dispatch("remove", item);
                break;
            }
        }
    }

    function getImage(data: Sound | SongItem) {
        if (data.data != null && isAudioData(data.data)) {
            return loadedSounds.sounds[data.data.sound].image;
        }

        return globalIcons[data.type];
    }
</script>

<div class="sound" on:mousedown={onMouseDown}>
    <img alt="Sound" src={getImage(item)} />
</div>

<style>
    img {
        width: 3rem;
        min-height: 56px;
        border-radius: 10px;
    }
</style>
