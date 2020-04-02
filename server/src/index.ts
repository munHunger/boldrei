import "reflect-metadata";
import { Server } from "./server";
import { SelfUpdater } from "./selfupdate/updater";

new SelfUpdater();
new Server().startBackend(5001);
