const logger = require("../logger").logger("Hue room");
import { Light, LightResolver } from "./light";
import { Sensor } from "./sensor";
import Container, { Service } from "typedi";
import { HueClient } from "./hueClient";
import { Query, ObjectType, Field } from "type-graphql";
import request from "request";

@ObjectType()
export class Room {
  @Field()
  name: string;
  @Field(type => Light)
  lights: Light[];
  //@Field(type => Sensor)
  sensors: Sensor[];

  constructor(room: Room) {
    Object.assign(this, room);
  }
}

@Service()
export class RoomResolver {
  constructor(private readonly client: HueClient) {}

  @Query(() => [Room])
  async getRooms() {
    return this.client.whenReady().then(client => {
      return new Promise((resolve, reject) => {
        request(
          `http://${client.url}/api/${client.config.password}/groups`,
          {
            json: true
          },
          (err, _res, body) => {
            if (err) {
              logger.error(err);
              reject(err);
            }

            Container.get(LightResolver)
              .getLights(null)
              .then(lights => {
                body = Object.keys(body)
                  .map(key => body[key])
                  .filter(group => group.type === "Room");
                body.forEach((room: any) => {
                  room.lights = room.lights.map((light: string) =>
                    lights.find(l => l.id === light)
                  );
                });
                resolve(body.map((room: any) => this.toRoom(room)));
              });
          }
        );
      });
    });
  }

  toRoom(raw: any): Room {
    return new Room({
      name: raw.name,
      lights: raw.lights,
      sensors: []
    });
  }
}
