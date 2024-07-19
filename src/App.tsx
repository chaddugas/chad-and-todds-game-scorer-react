import './App.scss';

import { GameData, ScoreData } from './shared/interfaces.ts';

import { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import Score from './components/Score.tsx';
import Logger from './components/Logger.tsx';

function App() {
  const [scoreData, setScoreData] = useLocalStorageState<ScoreData>('score', {
    defaultValue: {
      date: new Date().toDateString(),
      scores: {},
    },
  });

  useEffect(() => {
    const resetScoreData = () => {
      const today = new Date().toDateString();

      if (scoreData.date !== today) {
        setScoreData({ date: today, scores: {} });
      }
    };

    resetScoreData();
  }, [scoreData, setScoreData]);

  const updateScore = (score: GameData) => {
    setScoreData((prev: ScoreData) => {
      const scores = { ...prev.scores };

      scores[score.game] = {
        game: score.game,
        text: score.text.replace(/\t/g, '').replace(/ {2,}/g, '').trim(),
        score: score.score,
      };

      return { date: prev.date, scores };
    });
  };

  return (
    <>
      <Score scoreData={scoreData} />
      <Logger updateScore={updateScore} />
    </>
  );
}

export default App;
