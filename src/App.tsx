import './App.scss';

import { GameData, ScoreData } from './shared/interfaces.ts';

import { useMemo } from 'react';
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

  const empty = useMemo(() => {
    return Object.keys(scoreData.scores).length === 0;
  }, [scoreData]);

  const resetScoreData = (force = false) => {
    const today = new Date().toDateString();

    if (scoreData.date !== today || force) {
      setScoreData({ date: today, scores: {} });
    }
  };

  resetScoreData();

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
      {!empty && (
        <button className="reset" onClick={() => resetScoreData(true)}>
          Reset
        </button>
      )}
      <Score scoreData={scoreData} />
      <Logger updateScore={updateScore} />
    </>
  );
}

export default App;
