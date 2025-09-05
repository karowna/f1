interface APIResponse {
  "api": string;
  "url": string;
  "limit": number;
  "offset": number;
  "total": number;
  "season": number;
  "championshipId": string;
}

interface DriverBasic {
  "driverId": string;
  "name": string;
  "surname": string;
  "nationality": string;
  "birthday": string;
  "number": number;
  "shortName": string;
  "url": string;
}

interface TeamBasic {
  "teamId": string;
  "teamName": string;
  "teamNationality": string;
  "firstAppeareance": number;
  "constructorsChampionships": null;
  "driversChampionships": null;
  "url": string;
}

interface Schedule {
  "date": string | null;
  "time": string | null;
}

export interface DriverTeamContent {
  title: string;
  desc: string;
  elem: HTMLElement;
}

export interface PageClass {
  loaded?: () => void | Promise<void>;
  unloaded?: () => void;
  getHTML: () => string;
}

export interface Drivers extends APIResponse {
  "drivers": {
    "driverId":string;
    "name": string;
    "surname": string;
    "nationality": string;
    "birthday": string;
    "number": number;
    "shortName": string;
    "url": string;
    "teamId": string;
  }[];
}

export interface Driver extends APIResponse {
  "driver": DriverBasic;
  "team": TeamBasic;
  results: {
    "race": {
      "raceId": string;
      "name": string;
      "round": number;
      "date": string;
      "circuit": {
        "circuitId": string;
        "name": string;
        "country": string;
        "city": string;
        "length": number;
        "lapRecord": string;
        "firstParticipationYear": number;
        "numberOfCorners": number;
        "fastestLapDriverId": string;
        "fastestLapTeamId": string;
        "fastestLapYear": number;
      }
    },
    "result": {
      "finishingPosition": string;
      "gridPosition": number;
      "raceTime": string;
      "pointsObtained": number;
      "retired": null;
    },
    "sprintResult": null;
  }[];
}

export interface Team extends APIResponse {
  "team": TeamBasic[]
}

export interface Teams extends APIResponse {
  "teams": TeamBasic[]
}

export interface Races extends APIResponse {
  "championship": {
    "championshipId": string;
    "championshipName": string;
    "url": string;
    "year": number;
  },
  "races": {
    "raceId": string;
    "championshipId": string;
    "raceName": string;
    "schedule": {
      "race": Schedule;
      "qualy": Schedule;
      "fp1": Schedule;
      "fp2": Schedule;
      "fp3": Schedule;
      "sprintQualy": Schedule;
      "sprintRace": Schedule;
    };
    "laps": number;
    "round": number;
    "url": string;
    "fast_lap": {
      "fast_lap": string;
      "fast_lap_driver_id": string;
      "fast_lap_team_id": string;
    };
    "circuit": {
      "circuitId": string;
      "circuitName": string;
      "country": string;
      "city": string;
      "circuitLength": string;
      "lapRecord": string;
      "firstParticipationYear": number;
      "corners": number;
      "fastestLapDriverId": string;
      "fastestLapTeamId": string;
      "fastestLapYear": number;
      "url": string;
    };
    "winner": DriverBasic | null;
    "teamWinner": TeamBasic | null;
  }[];
}
