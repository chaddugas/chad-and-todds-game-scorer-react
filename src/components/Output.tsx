import styles from './Output.module.scss';

import { ScoreData, GameData } from '../shared/interfaces.ts';

import { useMemo, useRef, useEffect, useState } from 'react';

function Output({
  scoreData,
  resetScoreData,
}: {
  scoreData: ScoreData;
  resetScoreData: (force?: boolean) => void;
}) {
  const [shared, setShared] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const doShare = () => {
    if (window.navigator.share) {
      window.navigator.share({
        text: shareText,
      });
    } else {
      window.navigator.clipboard.writeText(shareText);
    }
    setShared(true);
    setTimeout(() => {
      setShared(false);
    }, 1000);
  };

  const shareButtonText = useMemo(() => {
    let text: string;

    // @ts-expect-error typescript thinks window.navigator.share will always exist, but it doesn't on desktop browsers.
    if (window.navigator.share) {
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
        return `${acc}${game.text}\n🏆 Score: ${game.score}\n-------------\n`;
      }, '')
      .trim()}\n\n${score}`;
  }, [scoreData, score]);

  const isReset = useMemo(() => {
    return Object.keys(scoreData.scores).length === 0;
  }, [scoreData]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '5px';
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  }, [shareText]);

  return (
    <>
      <div className={styles.header}>
        <h1>{score}</h1>
        {!isReset && (
          <button className={styles.reset} onClick={() => resetScoreData(true)}>
            Reset
          </button>
        )}
      </div>
      {!isReset && (
        <div className={styles.share}>
          <button className={shared ? styles.shared : ''} onClick={doShare}>
            {shareButtonText}
          </button>
          <textarea value={shareText} readOnly ref={textareaRef} />
        </div>
      )}
    </>
  );
}

export default Output;
