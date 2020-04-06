import "graphql-import-node";
import { PubSub } from "graphql-subscriptions";
import { buildSchema, PubSubEngine } from "type-graphql";
import { Container } from "typedi";
import { LightResolver } from "./hue/light";
import "./hue/hueClient";
import { RoomResolver } from "./hue/room";
import { SensorResolver } from "./hue/sensor";

Container.set("pubsub", new PubSub() as PubSubEngine);
const schema = buildSchema({
  resolvers: [LightResolver, RoomResolver, SensorResolver],
  container: Container,
  pubSub: Container.get<PubSubEngine>("pubsub")
});
export default schema;
