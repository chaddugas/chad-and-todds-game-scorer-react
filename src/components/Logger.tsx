import './Logger.scss';

import { GameData } from '../shared/interfaces.ts';

import { useRef } from 'react';

function Logger({ updateScore }: { updateScore: (score: GameData) => void }) {
  const emojiRegex =
    /(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|\u2764)/gim;

  const scoreStrands = (text: string) => {
    const data = {
      game: 'strands',
      score: 10,
      text,
    };
    const emoji = text.match(emojiRegex);

    if (!emoji) return;

    const bonus = emoji[0] === '🟡';
    const hints = emoji.filter(e => e === '💡').length;

    if (bonus) data.score += 2;
    if (hints) data.score -= hints * 1.5;

    updateScore(data);
  };

  const scoreHang5 = (text: string) => {
    const data = {
      game: 'hang5',
      score: 10,
      text,
    };
    const emoji = text.match(emojiRegex);

    if (!emoji) return;

    const bonus = emoji.filter(e => e === '\u2764').length === 5;
    const errors = emoji.filter(e => e === '🖤').length;

    if (bonus) data.score += 2;
    for (let i = 0; i < errors; i++) {
      data.score -= i * 1;
    }

    updateScore(data);
  };

  const scoreConnections = (text: string) => {
    const data = {
      game: 'connections',
      score: 10,
      text,
    };
    let emoji: string[] | Array<string[]> = [...(text.match(emojiRegex) || [])];

    if (!emoji) return;

    emoji = emoji.reduce((acc: Array<string[]>, e: string, i: number) => {
      let group: Array<string>;
      if (i % 4 === 0) (group = []), acc.push(group);
      else group = acc.at(-1) || [];

      group.push(e);
      return acc;
    }, []);

    const bonus = emoji[0].filter((e: string) => e === '🟪').length === 4;
    const errors = emoji.reduce((acc: number, group: string[]) => {
      const mistake = new Set(group).size > 1 ? 1 : 0;
      return acc + mistake;
    }, 0);

    if (bonus) data.score += 2;
    if (errors) {
      for (let i = 0; i < errors; i++) {
        data.score -= (i + 1) * 1;
      }
    }

    updateScore(data);
  };

  const scoreClipboard = async (): Promise<void> => {
    const text = await navigator.clipboard.readText();

    const isStrands = /strands/i.test(text);
    const isHang5 = /hang five/i.test(text);
    const isConnections = /connections/i.test(text);

    if (isStrands) scoreStrands(text);
    if (isHang5) scoreHang5(text);
    if (isConnections) scoreConnections(text);
  };

  const minutesInput = useRef<HTMLInputElement>(null);
  const secondsInput = useRef<HTMLInputElement>(null);

  const scoreInput = () => {
    if (!minutesInput.current || !secondsInput.current) return;

    const minutes = parseInt(minutesInput.current.value) || 0;
    const seconds = parseInt(secondsInput.current.value) || 0;
    const time = minutes * 60 + seconds;
    const data = {
      game: 'crosswordMini',
      score: 10,
      text: `Crossword Mini\nTime: ${minutes}m ${seconds}s`,
    };

    if (time <= 30) data.score += 4;
    else if (time <= 45) data.score += 2;
    else if (time > 60) {
      const over = Math.floor((time - 60) / 15);
      data.score -= over * 2;
    }
    if (data.score < 0) data.score = 0;

    updateScore(data);
  };

  return (
    <>
      <button onClick={scoreClipboard}>Log Score from Clipboard</button>
      <div className="numberInput">
        <input
          onInput={scoreInput}
          ref={minutesInput}
          type="number"
          pattern="[0-9]*"
          placeholder="minutes"
        />
        <input
          onInput={scoreInput}
          ref={secondsInput}
          type="number"
          pattern="[0-9]*"
          placeholder="seconds"
        />
      </div>
    </>
  );
}

export default Logger;
