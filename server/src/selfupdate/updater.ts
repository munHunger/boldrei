import fs from "fs";
import { resolveHome } from "../util";
const logger = require("../logger").logger("Self updater");
const simplegit = require("simple-git")();
import * as exec from "child_process";

class UpdateConfig {
  hash: string;
  location: string;
}

export class SelfUpdater {
  private url = "https://github.com/munhunger/boldrei.git";
  private config: UpdateConfig;

  constructor() {
    this.loadConfig().then(() => this.pollGit());
  }

  loadConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(resolveHome("~/.config/boldrei/config.json"))) {
        logger.debug("boldrei config exists");
        fs.promises
          .readFile(resolveHome("~/.config/boldrei/config.json"), "utf-8")
          .then(data => JSON.parse(data))
          .then(data => data.git as UpdateConfig)
          .then(conf => (this.config = conf))
          .then(_ => {
            logger.debug("config loaded", { data: this.config });
            if (this.config) resolve();
            else {
              logger.error("git config not present in settings");
              reject();
            }
          });
      } else {
        logger.error("Config does not exist");
      }
    });
  }

  async saveConfig() {
    return fs.promises
      .readFile(resolveHome("~/.config/boldrei/config.json"), "utf-8")
      .then(data => JSON.parse(data))
      .then(data => {
        data.git = this.config;
        logger.info("saving new config", { data });
        fs.promises.writeFile(
          resolveHome("~/.config/boldrei/config.json"),
          JSON.stringify(data, null, 2),
          "utf8"
        );
      });
  }

  pollGit() {
    simplegit.listRemote([this.url, "HEAD"], (err: string, tags: string) => {
      if (err) logger.err("error listing remote \n" + err);
      let hash = tags.split("\t")[0];
      logger.debug(`listed remote ${this.url} latest hash ${hash}`);
      logger.debug(`current hash ${this.config.hash}`);

      if (this.config.hash !== hash) {
        logger.info(
          `latest hash does not match latest remote, triggering update`,
          { data: { remote: hash, local: this.config.hash } }
        );
        this.config.hash = hash;

        exec.execSync("git pull", {
          stdio: "inherit"
        });
        this.saveConfig();
      }
    });
    setTimeout(() => this.pollGit(), 5 * 60 * 1000);
  }
}
