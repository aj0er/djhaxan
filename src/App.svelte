<script lang="ts">
    import AddSoundModal from "./lib/CreateSoundModal.svelte";
    import { loadedSounds } from "./loadedSounds";

    import { v4 as uuidv4 } from "uuid";
    import AddScriptModal from "./lib/AddScriptModal.svelte";
    import Boards from "./lib/Boards.svelte";
    import Song from "./lib/Song.svelte";
    import Options from "./lib/Options.svelte";
    import Sounds from "./lib/Sounds.svelte";
    import Io from "./lib/Io.svelte";
    import { loadSoundsJSON } from "./util";
    import type { AudioData, CreateSoundModalData, ScriptData, SongItem, Sound } from "./model";

    let sounds: Sound[] = [];
    let song: SongItem[] = [];

    let currentItemIdx: number = 0;

    let bpm: number = 0;
    let playbackRate: number = 1.0;

    let currentPlayingAudio: HTMLAudioElement = null;

    let createSoundModal: CreateSoundModalData = null;
    let scriptModal = false;

    function onItemAdded(e: { detail: { type: any; data: any; }; }) {
        switch (e.detail.type) {
            case "AUDIO": {
                song = [
                    ...song,
                    {
                        id: Date.now(),
                        type: e.detail.type,
                        data: e.detail.data 
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
        if (currentItemIdx >= song.length) {
            currentItemIdx = 0;
            return;
        }

        let item = song[currentItemIdx];
        currentItemIdx++;

        switch (item.type) {
            case "AUDIO":{
                let data = item.data as AudioData;

                currentPlayingAudio = new Audio(loadedSounds.sounds[data.sound].sound);
                currentPlayingAudio.playbackRate = playbackRate;
                currentPlayingAudio.play();
                break;
            }
            case "SCRIPT":{
                let data = item.data as ScriptData;

                eval(data.script);
                break;
            }
            case "BPM":{
                break;
            }

        }

        setTimeout(play, 1500 - bpm);
    }

    function onSpeedChange(speed) {
        if (speed == null || currentPlayingAudio == null) return;

        currentPlayingAudio.playbackRate = speed;
    }

    async function onBoardSelect(e) {
        let data = await fetch(e.detail);
        let json = await data.json();

        sounds = loadSoundsJSON(json);
    }

    function onSoundAdded(e) {
        const id = uuidv4();
        loadedSounds.sounds[id] = {
            id,
            sound: e.detail.sound,
            image: e.detail.image,
        };

        sounds = [
            ...sounds,
            {
                type: "AUDIO",
                data: {
                    sound: id,
                }
            },
        ];
    }

    function removeSound(e) {
        song = song.filter((i) => i.id != e.detail.id);
    }

    function onScriptAdded(e) {
        song = [
            ...song,
            {
                id: Date.now(),
                type: "SCRIPT",
                data: {
                    script: e.detail,
                }
            },
        ];
    }

    function onSongLoaded(e) {
        song = e.detail;
    }

    function onSoundsLoaded(e) {
        sounds = e.detail;
    }

    function createSound(){
        createSoundModal = {
            sound: null, 
            image: null
        };
    }

    $: onSpeedChange(playbackRate);
</script>

<main>
    <h1>DJ Häxan</h1>

    <Io on:song={onSongLoaded} on:sounds={onSoundsLoaded} song={song} sounds={sounds} />

    <Boards on:select={onBoardSelect} />

    <AddSoundModal bind:soundModal={createSoundModal} on:add={onSoundAdded} />
    <AddScriptModal bind:scriptModal on:add={onScriptAdded} />

    <h2>Sounds</h2>
    <div class="sections">
        <div class="main-section">
            <Sounds
                on:createSound={createSound}
                bind:sounds={sounds}
                on:add={onItemAdded}
            />
            <Song bind:song={song} on:remove={removeSound} />
        </div>
        <Options on:add={onItemAdded} on:play={play} bind:speed={bpm} bind:playbackRate />
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
