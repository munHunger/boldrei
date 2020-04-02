var ssdp = require("node-ssdp-lite");
var request = require("request");
var _ = require("lodash");
var parseString = require("xml2js").parseString;
const logger = require("../logger").logger("UPNP Client");

export class UPNPClient {
  private client = new ssdp();
  private endpoints = {};

  private locationFilter = function(msg: string) {
    var start = msg.search("LOCATION:") + "LOCATION:".length;
    var _temp = msg.substr(start);
    var end = _temp.indexOf("\n");
    return _temp.substr(0, end).replace("\r", "");
  };

  newEndpoint(data: any) {
    console.log("Found device:", data.address);
    console.log("Name:", data.name);
    console.log("Vendor:", data.vendor);
    console.log("Device Type:", data.device);
    console.log("Serialnumber:", data.serialnumber);
    console.log("Model description:", data.model.desc);
    console.log("Model name:", data.model.name);
    console.log("Model no.:", data.model.no);
    console.log("-----------------");
  }

  parseMessage(msg: string): any {
    let res: any = {};
    msg.split("\n").forEach(
      row =>
        (res[row.split(":")[0].toLowerCase()] = row
          .split(":")
          .slice(1)
          .join(":")
          .trim())
    );
    return res;
  }

  constructor() {}
  discover() {
    this.client.search("ssdp:discover");
  }

  getHueBridge(): Promise<any> {
    return new Promise((resolve, _) => {
      this.client.on("response", (msg: any, rinfo: any) => {
        msg = msg.replace(/\r/g, "");
        msg = this.parseMessage(msg);
        if (msg["hue-bridgeid"]) resolve(rinfo.address);
      });
      this.discover();
    });
  }
}
