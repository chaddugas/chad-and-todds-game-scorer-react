import './Score.scss';

import { ScoreData, GameData } from '../shared/interfaces.ts';

import { useMemo, useRef, useEffect } from 'react';

function Score({ scoreData }: { scoreData: ScoreData }) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const score = useMemo((): string => {
    return `Total: ${String(
      Object.values(scoreData.scores).reduce((acc: number, game: GameData) => {
        return acc + game.score;
      }, 0),
    )}`;
  }, [scoreData]);

  const shareText = useMemo(() => {
    return `${Object.values(scoreData.scores)
      .reduce((acc: string, game: GameData) => {
        return `${acc}${game.text}\nScore: ${game.score}\n\n`;
      }, '')
      .trim()}\n\nTotal: ${score}`;
  }, [scoreData, score]);

  const empty = useMemo(() => {
    return Object.keys(scoreData.scores).length === 0;
  }, [scoreData]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = '5px';
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
  }, [shareText]);

  return (
    <>
      <h1>{score}</h1>
      {!empty && (
        <div className="share">
          <textarea value={shareText} readOnly ref={inputRef} />
          <button onClick={() => navigator.clipboard.writeText(shareText)}>
            Copy
          </button>
        </div>
      )}
    </>
  );
}

export default Score;
