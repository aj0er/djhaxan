<script lang="ts">
    import AddSoundModal from "./lib/AddSoundModal.svelte";
    import { loadedSounds } from "./loadedSounds";

    import { v4 as uuidv4 } from "uuid";
    import AddScriptModal from "./lib/AddScriptModal.svelte";
    import Boards from "./lib/Boards.svelte";
    import Song from "./lib/Song.svelte";
    import Options from "./lib/Options.svelte";
    import Sounds from "./lib/Sounds.svelte";
    import Io from "./lib/Io.svelte";
    import { loadSoundsJSON } from "./util";
    import { onMount } from "svelte";

    let items: any[] = [];

    let i: any = 0;
    let speed: any = 0;
    let playbackRate: any = 1.0;

    let currentAudio: any = null;
    let added: any = [];
    let soundModal: any = null;
    let scriptModal = null;

    function add(e) {
        switch (e.detail.type) {
            case "AUDIO": {
                added = [
                    ...added,
                    {
                        id: Date.now(),
                        type: e.detail.type,
                        sound: e.detail.sound,
                    },
                ];
                break;
            }
            case "SCRIPT": {
                scriptModal = true;
                break;
            }
        }
    }

    function play() {
        if (i >= added.length) {
            i = 0;
            return;
        }

        let item = added[i];
        i++;

        switch (item.type) {
            case "AUDIO":
                currentAudio = new Audio(loadedSounds.sounds[item.sound].sound);
                currentAudio.playbackRate = playbackRate;
                currentAudio.play();
                break;
            case "SCRIPT":
                eval(item.script);
                break;
        }

        setTimeout(play, 1500 - speed);
    }

    function onSpeedChange(speed) {
        if (speed == null || currentAudio == null) return;

        currentAudio.playbackRate = speed;
    }

    async function onBoardSelect(e) {
        let data = await fetch(e.detail);
        let json = await data.json();

        items = loadSoundsJSON(json);
    }

    function onSoundAdded(e) {
        const id = uuidv4();
        loadedSounds.sounds[id] = {
            id,
            type: "AUDIO",
            sound: e.detail.sound,
            image: e.detail.image,
        };

        items = [
            ...items,
            {
                sound: id,
                type: "AUDIO",
            },
        ];
    }

    function removeSound(e) {
        added = added.filter((i) => i.id != e.detail.id);
    }

    function onScriptAdded(e) {
        added = [
            ...added,
            {
                id: Date.now(),
                type: "SCRIPT",
                script: e.detail,
            },
        ];
    }

    function onSongLoaded(e) {
        added = e.detail;
    }

    function onSoundsLoaded(e) {
        items = e.detail;
    }

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('l');

        if(myParam == null)
            return;

        console.log(atob(myParam));
    })

    $: onSpeedChange(playbackRate);
</script>

<main>
    <h1>DJ Häxan</h1>

    <Io on:song={onSongLoaded} on:sounds={onSoundsLoaded} {added} {items} />

    <Boards on:select={onBoardSelect} />

    <AddSoundModal bind:soundModal on:add={onSoundAdded} />
    <AddScriptModal bind:scriptModal on:add={onScriptAdded} />

    <h2>Sounds</h2>
    <div class="sections">
        <div class="main-section">
            <Sounds
                on:addSound={() => (soundModal = {})}
                bind:items
                on:add={add}
            />
            <Song bind:added on:remove={removeSound} />
        </div>
        <Options on:add={add} on:play={play} bind:speed bind:playbackRate />
    </div>
</main>

<style>
    main {
        width: 80%;
        margin: 0 auto;
    }

    .main-section {
        flex: 1;
    }

    .sections {
        display: flex;
        gap: 20px;
    }
</style>
