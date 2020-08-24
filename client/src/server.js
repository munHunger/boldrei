import { SubscriptionClient } from "subscriptions-transport-ws";
import { gql } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";

import { get } from "svelte/store";
import { rooms, activeRoom } from "./data";

const wsClient = new SubscriptionClient("ws://192.168.0.178:5001/graphql", {
  reconnect: true,
});

const client = new WebSocketLink(wsClient);

function fetchRooms() {
  client
    .request({
      query: gql`
        query {
          getRooms {
            name
            lights {
              id
            }
          }
        }
      `,
      variables: {},
    })
    .subscribe((res) => {
      rooms.set(res.data.getRooms);
      activeRoom.set(res.data.getRooms.slice(-2)[0]);
    });
}

export function fetchLights(lights) {
  client
    .request({
      query: gql`
        query GetLights($lights: [String!]) {
          getLights(ids: $lights) {
            id
            type
            name
            on
            bri
          }
        }
      `,
      variables: { lights },
    })
    .subscribe((res) =>
      activeRoom.update((n) => {
        n.lights = res.data.getLights;
        return n;
      })
    );
}

export function toggleLight(id) {
  client
    .request({
      query: gql`
        mutation ToggleLight($id: String!) {
          toggleLight(id: $id)
        }
      `,
      variables: { id },
    })
    .subscribe(() => {
      fetchLights(get(activeRoom).lights.map((light) => light.id));
    });
}

export function setLight(light, skipRefresh) {
  client
    .request({
      query: gql`
        mutation setLight($light: LightInput!) {
          setLight(light: $light)
        }
      `,
      variables: { light },
    })
    .subscribe(() => {
      if (!skipRefresh)
        fetchLights(get(activeRoom).lights.map((light) => light.id));
    });
}
fetchRooms();
