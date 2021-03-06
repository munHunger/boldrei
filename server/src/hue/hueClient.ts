const logger = require("../logger").logger("Hue");
import request from "request";
import { resolveHome } from "../util";
import fs from "fs";
import { Sensor } from "./sensor";
import { UPNPClient } from "../upnp/upnp";
import { Service } from "typedi";

export class HueConfig {
  constructor(public appname: string, public password: string) {}
}

@Service()
export class HueClient {
  static singleton: HueClient;
  isLoaded = false;
  config: HueConfig;
  url: string;

  constructor() {
    this.url = "not yet loaded";
    logger.debug("constructing client");
  }

  async whenReady(): Promise<HueClient> {
    if (HueClient.singleton) return Promise.resolve(HueClient.singleton);
    return HueClient.createClient().then(client => {
      HueClient.singleton = client;
      return client;
    });
  }

  static async createClient(): Promise<HueClient> {
    logger.info("Creating client");
    return new Promise(resolve => {
      new UPNPClient().getHueBridge().then(addr => {
        logger.info("Found hue bridge", { data: addr });
        let client = new HueClient();
        client.url = addr;
        resolve(client);
      });
    }).then((client: HueClient) => client.loadConfig());
  }

  loadConfig(): Promise<HueClient> {
    return new Promise(resolve => {
      if (fs.existsSync(resolveHome("~/.config/boldrei/config.json"))) {
        logger.debug("Hue config exists");
        fs.promises
          .readFile(resolveHome("~/.config/boldrei/config.json"), "utf-8")
          .then(data => JSON.parse(data))
          .then(data => data.hue as HueConfig)
          .then(conf => (this.config = conf))
          .then(_ => {
            logger.debug("config loaded", { data: this.config });
            this.isLoaded = true;
            resolve(this);
            //   this.getSensors();
            // this.getGroups();
          });
      } else {
        logger.info("Hue config does not exist, creating it");
        this.createUser();
      }
    });
  }

  createUser() {
    request(
      `http://${this.url}/api`,
      {
        json: true,
        method: "POST",
        body: { devicetype: "boldrei" }
      },
      (err, _res, body) => {
        if (err) logger.error(err);
        let user = new HueConfig("boldrei", body.username);
        fs.writeFile(
          resolveHome("~/.config/boldrei/config.json"),
          JSON.stringify({ hue: user }, null, 2),
          err => {
            if (err) logger.error(err);
          }
        );
      }
    );
  }
}
