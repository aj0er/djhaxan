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

    /**
     * Extracts the actual loaded sounds from the sounds array instead of the ID reference.
     */
    function getLoadedSounds(){
        return sounds.map((item) => loadedSounds.sounds[(item.data as AudioData).sound]);
    }

    /**
     * Saves the sounds to the specified sounds file name.
     */
    function saveSounds() {
        saveJSONFile(
            soundsFileName,
            getLoadedSounds()
        );
    }

    /**
     * Saves both the song and the necessary sounds to the specified song file name.
     */
    function saveSong() {
        saveJSONFile(songFileName, {
            sounds: getLoadedSounds(),
            song: song
        });
    }

    /**
     * Initiates a download in the browser for a JSON file with the specified content.
     * Creates a link which is programatically clicked.
     * @param fileName name of the file to save
     * @param data data to transform to JSON
     */
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

    /**
     * Called when a sounds file has been uploaded and should be loaded.
     */
    function onSoundsUpload(){
        let reader = new FileReader();
        reader.readAsText(soundsFile[0]);
        reader.onload = () => {
            if (typeof reader.result != "string") return;

            let data = JSON.parse(reader.result);
            dispatch("sounds", loadSoundsJSON(data));
        };
    }

    /**
     * Called when a song file has been uploaded and should be loaded.
     */
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
