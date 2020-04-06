import "reflect-metadata";
import { Server } from "./server";
import { SelfUpdater } from "./selfupdate/updater";
import Container from "typedi";
import { SensorResolver } from "./hue/sensor";
import { HueClient } from "./hue/hueClient";
import { Automation } from "./automation/automation";

new SelfUpdater();
new Server().startBackend(5001);

HueClient.createClient()
  .then(client => Container.set(HueClient, client))
  .then(() => {
    Container.get(SensorResolver);
  })
  .then(() => new Automation());
