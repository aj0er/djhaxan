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

    /**
     * Called when an item should be added.
     * This does not actually add the item to the song if it requires extra info from the user, such as scripts
     * @param e item add event
     */
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

    /**
     * Actually plays the song. 
     * This is recursively called for each sound.
     */
    function play() {
        if (currentItemIdx >= song.length) { // Song has ended.
            currentItemIdx = 0;
            return;
        }

        let item = song[currentItemIdx];
        currentItemIdx++;

        // Execute the action of the item, e.g play the sound or run a script etc
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

    /**
     * Called when the playback rate is changed by the user
     * @param speed new playback rate
     */
    function onSpeedChange(speed) {
        if (speed == null || currentPlayingAudio == null) return;

        currentPlayingAudio.playbackRate = speed;
    }

    /**
     * Called when a board is selected
     * @param e board select event
     */
    async function onBoardSelect(e: { detail: string; }) {
        let data = await fetch(e.detail);
        let json = await data.json();

        sounds = loadSoundsJSON(json);
    }

    /**
     * Called when the user creates a new sound
     * @param e sound create event
     */
    function onSoundCreated(e: { detail: { sound: string; image: string; }; }) {
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

    /**
     * Called when a sound should be removed.
     * @param e remove sound file event
     */
    function removeSound(e: { detail: { id: number; }; }) {
        song = song.filter((i) => i.id != e.detail.id);
    }

    /**
     * Called when a script item is supposed to be added.
     * @param e script add event.
     */
    function onScriptAdd(e: { detail: string; }) {
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

    /**
     * Called when a song file has been loaded.
     * @param e song load event
     */
    function onSongLoaded(e: { detail: SongItem[]; }) {
        song = e.detail;
    }

    /**
     * Called when a sounds file has been loaded.
     * @param e sounds load event
     */
    function onSoundsLoaded(e: { detail: Sound[]; }) {
        sounds = e.detail;
    }

    /**
     * Opens the create sound modal.
     */
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

    <AddSoundModal bind:soundModal={createSoundModal} on:add={onSoundCreated} />
    <AddScriptModal bind:scriptModal on:add={onScriptAdd} />

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
    <p>Not affiliated with SVT or Häxan surtant, no copyright infringement intended.</p>
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

    p {
        margin-top: 10rem;
        font-size: 12px;
    }
</style>
