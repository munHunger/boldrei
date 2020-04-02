import { writable, get } from "svelte/store";
import { fetchLights } from "./server";

export const rooms = writable([]);

export const activeRoom = writable({});

let prev = {};
activeRoom.subscribe(data => {
  if (prev.name !== data.name) {
    fetchLights(
      get(rooms)
        .find(room => room.name === data.name)
        .lights.map(light => light.id)
    );
  }
  prev = data;
});
