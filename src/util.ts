import { loadedSounds } from "./loadedSounds";

export function loadSoundsJSON(data){
    let map = {};
    data.forEach(s => {
        map[s.id] = s;
    });

    loadedSounds.sounds = map; 

    return data.map(s => {
        return {
            data: {
                sound: s.id,
            },
            type: s.type
        }
    });
}