import './Score.scss';

import { ScoreData, GameData } from '../shared/interfaces.ts';

import { useMemo, useRef, useEffect, useState } from 'react';

function Score({ scoreData }: { scoreData: ScoreData }) {
  const [shared, setShared] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const doShare = () => {
    if (navigator.share) {
      navigator.share({
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
    setShared(true);
    setTimeout(() => {
      setShared(false);
    }, 1000);
  };

  const shareButton = useMemo(() => {
    let text: string;

    //todo: change to if ('share' in navigator)
    // @ts-expect-error typescript thinks navigator.share will always exist, but it doesn't on desktop browsers.
    if (navigator.share) {
      if (shared) text = 'Shared';
      else text = 'Share';
    } else {
      if (shared) text = 'Copied';
      else text = 'Copy';
    }

    return text;
  }, [shared]);

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
        return `${acc}${game.text}\nScore: ${game.score}\n-------------\n`;
      }, '')
      .trim()}\n\n${score}`;
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
          <button className={shared ? 'shared' : ''} onClick={doShare}>
            {shareButton}
          </button>
          <textarea value={shareText} readOnly ref={inputRef} />
        </div>
      )}
    </>
  );
}

export default Score;
