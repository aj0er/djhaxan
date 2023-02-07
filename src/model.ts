export type ItemType = "AUDIO" | "SCRIPT" | "BPM";

export interface LoadedSound {
    id: string,
    type: ItemType,
    sound: string // Base64-encoded audio
    image: string // Base64-encoded image
}

export interface SongItem {
    id: number,
    type: ItemType,
    data?: AudioData | ScriptData
}

export interface Sound {
    type: string,
    data?: AudioData | ScriptData
}

export interface AudioData {
    sound: string
}

export interface ScriptData {
    script: string
}

export function isAudioData(data: AudioData|ScriptData): data is AudioData {
    return 'sound' in data;
}

export interface CreateSoundModalData {
    sound: FileList,
    image: FileList
}