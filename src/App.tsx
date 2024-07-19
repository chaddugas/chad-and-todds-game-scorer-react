import { GameData, ScoreData } from './shared/interfaces.ts';

import useLocalStorageState from 'use-local-storage-state';

import Output from './components/Output.tsx';
import Input from './components/Input.tsx';

function App() {
  const [scoreData, setScoreData] = useLocalStorageState<ScoreData>('score', {
    defaultValue: {
      date: new Date().toDateString(),
      scores: {},
    },
  });

  const updateScore = (score: GameData) => {
    setScoreData((prev: ScoreData) => {
      const scores = { ...prev.scores };

      scores[score.game] = {
        game: score.game,
        text: score.text,
        score: score.score,
      };

      return { date: prev.date, scores };
    });
  };

  const resetScoreData = (force = false) => {
    const today = new Date().toDateString();

    if (scoreData.date !== today || force) {
      setScoreData({ date: today, scores: {} });
    }
  };

  resetScoreData();

  return (
    <>
      <Output scoreData={scoreData} resetScoreData={resetScoreData} />
      <Input updateScore={updateScore} />
    </>
  );
}

export default App;
