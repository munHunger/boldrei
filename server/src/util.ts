import os from "os";

export function resolveHome(path: string) {
  return path.split("~").join(os.homedir());
}
