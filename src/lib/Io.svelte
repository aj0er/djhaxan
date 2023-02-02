<script lang="ts">
    import { loadedSounds } from "../loadedSounds";
    import { loadSoundsJSON } from "../util";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let soundsFile;
    let songFile;

    export let items;
    export let added;

    function loadSounds() {
        let reader = new FileReader();
        reader.readAsText(soundsFile[0]);
        reader.onload = function () {
            if (typeof reader.result != "string") return;

            let data = JSON.parse(reader.result);
            dispatch("sounds", loadSoundsJSON(data));
        };
    }

    function loadSong() {
        let reader = new FileReader();
        reader.readAsText(songFile[0]);
        reader.onload = function () {
            if (typeof reader.result != "string") return;

            dispatch("song", JSON.parse(reader.result));
        };
    }

    function saveSounds() {
        saveJSON(
            "items.json",
            items.map((item) => loadedSounds.sounds[item.sound])
        );
    }

    function saveSong() {
        saveJSON("song.json", added);
    }

    function saveJSON(fileName, data) {
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

    function copy(){
        let itemsStr = JSON.stringify(loadedSounds);
        let addedStr = JSON.stringify(added);

        let str = itemsStr + "|:|" + addedStr;
        window.location.href = "http://localhost:5173/l?=" + btoa(str);
    }
</script>

<div class="io">
    <div>
        <div>
            Load sounds:
            <input bind:files={soundsFile} type="file" name="g" />
            <button on:click={loadSounds}>Load</button>
        </div>
        <div>
            Load song:
            <input bind:files={songFile} type="file" name="g" />
            <button on:click={loadSong}>Load</button>
        </div>
    </div>
    <div>
        <div>
            <input type="text" value="sounds.json" />
            <button on:click={saveSounds}>Save sounds</button>
        </div>
        <div>
            <input type="text" value="song.json" />
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

    .copy {
        width: 100%;
    }
</style>
