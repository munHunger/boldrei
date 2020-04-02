import { HueClient } from "./hueClient";
const logger = require("../logger").logger("Hue light");
import request from "request";
import {
  ObjectType,
  InputType,
  Query,
  Field,
  Mutation,
  Arg
} from "type-graphql";
import { Service } from "typedi";

@ObjectType()
@InputType("LightInput")
export class Light {
  @Field()
  id: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  on: boolean;
  @Field({ nullable: true })
  bri: number;
  @Field({ nullable: true })
  hue: number;
  @Field({ nullable: true })
  sat: number;

  constructor(light: Light) {
    Object.assign(this, light);
  }
}

@Service()
export class LightResolver {
  constructor(private readonly client: HueClient) {}

  @Mutation(() => String)
  async toggleLight(@Arg("id") lightId: string) {
    logger.info(`toggling light ${lightId}`);

    return this.client.whenReady().then(
      client =>
        new Promise((resolve, reject) => {
          this.getLight(lightId).then(light => {
            request(
              `http://${client.url}/api/${client.config.password}/lights/${light.id}/state`,
              {
                json: true,
                method: "PUT",
                body: {
                  on: !light.on
                }
              },
              (err, _res, body) => {
                if (err) {
                  logger.error(err);
                  reject(err);
                }
                logger.info("toggled", { data: body });
                resolve("OK");
              }
            );
          });
        })
    );
  }

  @Mutation(() => String)
  async setLight(@Arg("light") light: Light) {
    logger.info("setting light", { data: light });
    return this.client.whenReady().then(
      client =>
        new Promise((resolve, reject) => {
          request(
            `http://${client.url}/api/${client.config.password}/lights/${light.id}/state`,
            {
              json: true,
              method: "PUT",
              body: {
                bri: light.bri,
                sat: light.sat,
                hue: light.hue,
                on: true
              }
            },
            (err, _res, _body) => {
              if (err) {
                logger.error(err);
                reject(err);
              }
              logger.debug("response", { data: _body });
              resolve("OK");
            }
          );
        })
    );
  }

  @Query(() => [Light])
  async getLights(
    @Arg("ids", () => [String], { nullable: true }) ids: string[]
  ): Promise<Light[]> {
    return this.client.whenReady().then(client => {
      return new Promise((resolve, reject) => {
        request(
          `http://${client.url}/api/${client.config.password}/lights`,
          {
            json: true
          },
          (err, _res, body) => {
            if (err) {
              logger.error(err);
              reject(err);
            }

            let lights = Object.keys(body)
              .map(key => ({ ...body[key], id: key }))
              .map(light => this.toLight(light));
            if (ids != null) {
              resolve(lights.filter(light => ids.includes(light.id)));
            }
            resolve(lights);
          }
        );
      });
    });
  }

  @Query(() => Light)
  async getLight(@Arg("id") lightId: string): Promise<Light> {
    return this.client.whenReady().then(client => {
      return new Promise((resolve, reject) => {
        request(
          `http://${client.url}/api/${client.config.password}/lights/${lightId}`,
          {
            json: true
          },
          (err, _res, body) => {
            if (err) {
              logger.error(err);
              reject(err);
            }
            if (!body) {
              logger.error(`Missing light data for id ${lightId}`);
              return reject("No data");
            }
            let light = this.toLight({ ...body, id: lightId });
            logger.debug(`Loaded single light ${lightId}`, { data: light });
            resolve(light);
          }
        );
      });
    });
  }

  private toLight(raw: any): Light {
    return new Light({
      id: raw.id,
      type: raw.type,
      name: raw.name,
      on: raw.state.on,
      bri: raw.state.bri,
      hue: raw.state.hue,
      sat: raw.state.sat
    } as Light);
  }
}
