export interface PageClass {
  loaded?: () => void | Promise<void>;
  unloaded?: () => void;
  getHTML: () => string;
}

interface APIResponse {
  "api": string;
  "url": string;
  "limit": number;
  "offset": number;
  "total": number;
  "season": number;
  "championshipId": string;
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
  "driver": {
    "driverId": string;
    "name": string;
    "surname": string;
    "nationality": string;
    "birthday": string;
    "number": number;
    "shortName": string;
    "url": string;
  },
  "team": {
    "teamId": string;
    "teamName": string;
    "teamNationality": string;
    "firstAppeareance": number;
    "constructorsChampionships": null;
    "driversChampionships": null;
    "url": string;
  },
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
