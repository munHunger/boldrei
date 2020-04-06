const CronJob = require("cron").CronJob;
const logger = require("../logger").logger("Schedule");

export function schedule(schedule: string, fn: any) {
  logger.debug("registering a schedule");
  new CronJob(schedule, fn, null, true, "Europe/Stockholm").start();
}
