export class Sensor {
  ids: string[];
  state: State;
}

export class State {
  lightlevel: number;
  dark: boolean;
  daylight: boolean;
  presence: boolean;

  lastupdated: string;
}
