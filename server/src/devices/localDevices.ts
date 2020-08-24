const netList = require("network-list");
import fs from "fs";
import { resolveHome } from "../util";

import { schedule } from "../schedule/schedule";
import { detailedDiff } from "deep-object-diff";
import { db } from "../datastore";
const logger = require("../logger").logger("local devices");

export class Person {
  name: string;
  mac: string;
}

export class NetworkDevice {
  ip: string;
  mac: string;
  vendor: string;
}

export class LocalDevices {
  knownPeople: Person[] = [];
  devices: NetworkDevice[];
  constructor() {
    this.loadConfig();

    schedule("*/10 * * * * *", () => {
      new Promise((resolve) => {
        netList.scan({}, (err: any, arr: any) => {
          resolve(arr.filter((v: { alive: any }) => v.alive));
        });
      }).then((devices: NetworkDevice[]) => {
        let diff: any = detailedDiff(this.devices, devices);
        if (Object.keys(diff.added || {}).length > 0) {
          logger.info("new device appeared on network", { data: diff.added });
        }
        if (Object.keys(diff.deleted || {}).length > 0) {
          logger.info("device removed from network", { data: diff.deleted });
        }
        let knownDevices = devices
          .map((device) =>
            this.knownPeople.find((person) => person.mac === device.mac)
          )
          .filter((v) => v);
        logger.debug("scan run", { data: knownDevices });
        this.devices = devices;

        if (!db.get("devices")) {
          db.createTable("devices", { index: "TIME" });
        }
        db.get("devices").register(new Date().getTime(), devices);
      });
    });
  }

  loadConfig(): Promise<void> {
    return new Promise((resolve, _reject) => {
      if (fs.existsSync(resolveHome("~/.config/boldrei/config.json"))) {
        logger.debug("boldrei config exists");
        fs.promises
          .readFile(resolveHome("~/.config/boldrei/config.json"), "utf-8")
          .then((data) => JSON.parse(data))
          .then((data) => data.people as Person[])
          .then((people) => (this.knownPeople = people))
          .then((_) => {
            logger.debug("config loaded", { data: this.knownPeople });
            resolve();
          });
      } else {
        logger.error("Config does not exist");
      }
    });
  }
}
