interface GameData {
  text: string;
  score: number;
  game: string;
}

interface ScoreData {
  date: string;
  scores: { [key: string]: GameData };
}

export type { GameData, ScoreData };
