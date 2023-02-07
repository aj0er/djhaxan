<script lang="ts">
    import { loadedSounds } from "../loadedSounds";
    import { loadSoundsJSON } from "../util";
    import { createEventDispatcher } from "svelte";
    import type { AudioData, SongItem, Sound } from "../model";

    const dispatch = createEventDispatcher();

    let soundsFile: FileList;
    let songFile: FileList;

    let soundsFileName: string = "sounds.json";
    let songFileName: string = "song.json";

    export let sounds: Sound[];
    export let song: SongItem[];

    function getSounds(){
        return sounds.map((item) => loadedSounds.sounds[(item.data as AudioData).sound]);
    }

    function saveSounds() {
        saveJSONFile(
            soundsFileName,
            getSounds()
        );
    }

    function saveSong() {
        saveJSONFile(songFileName, {
            sounds: getSounds(),
            song: song
        });
    }

    function saveJSONFile(fileName: string, data: any) {
        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:application/json;charset=utf-8," + JSON.stringify(data)
        );
        element.setAttribute("download", fileName);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function onSoundsUpload(){
        let reader = new FileReader();
        reader.readAsText(soundsFile[0]);
        reader.onload = () => {
            if (typeof reader.result != "string") return;

            let data = JSON.parse(reader.result);
            dispatch("sounds", loadSoundsJSON(data));
        };
    }

    function onSongUpload(){
        let reader = new FileReader();
        reader.readAsText(songFile[0]);
        reader.onload = () => {
            if (typeof reader.result != "string") return;

            let data = JSON.parse(reader.result);
            dispatch("sounds", loadSoundsJSON(data.sounds));
            dispatch("song", data.song);
        };
    }
</script>

<div class="io">
    <div>
        <div>
            Load sounds:
            <input bind:files={soundsFile} on:change={onSoundsUpload} type="file" />
        </div>
        <div class="mt">
            Load song:
            <input bind:files={songFile} on:change={onSongUpload} type="file" />
        </div>
    </div>
    <div>
        <div>
            <input type="text" bind:value={soundsFileName} />
            <button on:click={saveSounds}>Save sounds</button>
        </div>
        <div class="mt">
            <input type="text" bind:value={songFileName} />
            <button on:click={saveSong}>Save song</button>
        </div>
    </div>
</div>

<style>
    .io {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mt {
        margin-top: 5px;
    }
</style>
