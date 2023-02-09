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

    /**
     * Whether the item should have a white background, useful for darker icons.
     */
    export let white: boolean = false;

    /**
     * Called when the left mouse button is pressed on an item.
     * Plays the sound if it's a sound item and attempts to add it to the song.
     * If no event handler is defined for "add", the item is not added.
     */
    function onLeftClick() {
        if (item.data && isAudioData(item.data)) {
            new Audio(loadedSounds.sounds[item.data.sound].sound).play();
        }

        dispatch("add", item);
    }

    /**
     * Called when the mouse is pressed on an item
     * @param e mouse event
     */
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

    /**
     * Gets the image of the item, if it's a sound it tries to find it in loadedSounds.
     * Otherwise, it's a global/custom item and can be found in globalIcons.
     * @param data sound or song to get image from
     * @returns either base-64 encoded image or a URL
     */
    function getImage(data: Sound | SongItem): string {
        if (data.data != null && isAudioData(data.data)) {
            return loadedSounds.sounds[data.data.sound].image;
        }

        return globalIcons[data.type];
    }
</script>

<div class="sound" class:white={white} on:mousedown={onMouseDown}>
    <img alt="Sound" src={getImage(item)} />
</div>

<style>
    .white {
        background-color: white;
    }
    img {
        width: 3rem;
        min-height: 56px;
        border-radius: 10px;
    }
</style>
