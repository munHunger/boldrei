import "graphql-import-node";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { LightResolver } from "./hue/light";
import "./hue/hueClient";
import { RoomResolver } from "./hue/room";

const schema = buildSchema({
  resolvers: [LightResolver, RoomResolver],
  container: Container
});
export default schema;
