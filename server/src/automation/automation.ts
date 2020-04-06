import { PubSubEngine } from "type-graphql";
import Container from "typedi";
import { Sensor, SensorResolver } from "../hue/sensor";
import { LightResolver, Light } from "../hue/light";

const logger = require("../logger").logger("Automation");

export class Automation {
  constructor() {
    this.deskLightSensor();
    this.dusk();
  }

  dusk() {
    let lightResolver = Container.get(LightResolver);
    let sensorResolver = Container.get(SensorResolver);

    const onSensor = (sensor: Sensor) => {
      if (sensor.state.lightlevel < 3500) {
        let lights = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11"
        ];
        lights.reduce(
          (acc, val) =>
            acc.then(() =>
              lightResolver.setLight(
                new Light({
                  id: val,
                  on: true,
                  bri: Math.floor((1 - sensor.state.lightlevel / 3500) * 254)
                } as Light)
              )
            ),
          Promise.resolve()
        );
      }
    };
    sensorResolver.getSensors().then(sensors => onSensor(sensors[0]));
    Container.get<PubSubEngine>("pubsub").subscribe(
      "SENSOR_CHANGE",
      (sensor: Sensor[]) => {
        onSensor(sensor[0]);
      },
      {}
    );
  }

  deskLightSensor() {
    let lastPrecence = 0;
    let timeoutFun: NodeJS.Timeout;

    let lightResolver = Container.get(LightResolver);

    Container.get<PubSubEngine>("pubsub").subscribe(
      "SENSOR_CHANGE",
      (sensor: Sensor[]) => {
        let state = sensor[0].state;
        if (state.presence) {
          if (timeoutFun) clearTimeout(timeoutFun);
          logger.info("Presence detected at desk, turning on light");
          lightResolver.setLight(new Light({ id: "12", on: true } as Light));
          lastPrecence = new Date().getTime();
        } else {
          timeoutFun = setTimeout(() => {
            logger.info("no precense at desk, turning light off");
            lightResolver.setLight(new Light({ id: "12", on: false } as Light));
          }, 120_000);
        }
      },
      {}
    );
  }
}
