import { HueClient } from "./hueClient";
import Container, { Service, Inject } from "typedi";
import request from "request";
import {
  Query,
  ObjectType,
  Field,
  Subscription,
  Root,
  PubSub,
  Publisher,
  PubSubEngine
} from "type-graphql";
import { schedule } from "../schedule/schedule";
import { detailedDiff } from "deep-object-diff";
const logger = require("../logger").logger("Hue sensor");

@ObjectType()
export class State {
  @Field()
  lightlevel: number;
  @Field()
  dark: boolean;
  @Field()
  daylight: boolean;
  @Field()
  presence: boolean;

  @Field()
  lastupdated: string;
}

@ObjectType()
export class Sensor {
  @Field(() => [String])
  ids: string[];
  @Field(() => State)
  state: State;
}

@Service()
export class SensorResolver {
  private lastState: Sensor[];
  constructor(private client: HueClient) {
    logger.debug("Constructing sensor resolver");
    if (this.client == null) logger.error("client is null");
    schedule("*/2 * * * * *", () => {
      this.getSensors()
        .then(sensorArray => {
          let diff: any = detailedDiff(this.lastState, sensorArray);
          if (Object.keys(diff.updated || {}).length > 0) {
            Container.get<PubSubEngine>("pubsub").publish(
              "SENSOR_CHANGE",
              sensorArray
            );
          }
          return sensorArray;
        })
        .then(sensorArray => (this.lastState = sensorArray));
    });
  }

  @Subscription(() => [Sensor], {
    topics: "SENSOR_CHANGE"
  })
  sensorChange(@Root() newState: Sensor[]): Sensor[] {
    return newState;
  }

  @Query(() => [Sensor])
  async getSensors(): Promise<[Sensor]> {
    logger.debug("fetching sensor data");
    return this.client.whenReady().then(
      client =>
        new Promise<[Sensor]>((resolve, reject) => {
          request(
            `http://${client.url}/api/${client.config.password}/sensors`,
            {
              json: true
            },
            (err, _res, body) => {
              if (err) {
                logger.error(err);
                reject(err);
              }
              let sensors = Object.keys(body)
                .map(key => ({ ...body[key], id: key }))
                .filter(
                  (val: { productname: string }) =>
                    val.productname === "Hue ambient light sensor" ||
                    val.productname === "Hue motion sensor"
                );
              let sensor = new Sensor();
              sensor.ids = sensors.map(s => s.id);
              sensor.state = sensors
                .map(s => s.state)
                .reverse()
                .reduce((acc, val) => ({ ...acc, ...val }), {});
              resolve([sensor]);
            }
          );
        })
    );
  }
}
