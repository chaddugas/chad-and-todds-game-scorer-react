import styles from './Input.module.scss';

import { GameData } from '../shared/interfaces.ts';

import { useState, useRef } from 'react';

function Input({ updateScore }: { updateScore: (score: GameData) => void }) {
  const emojiRegex =
    /(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|\u2764)/gim;

  const scoreStrands = (text: string) => {
    const data = {
      game: 'strands',
      score: 10,
      text: '',
    };
    const emoji = text.match(emojiRegex);

    if (!emoji) return;

    const bonus = emoji[0] === '🟡';
    const hints = emoji.filter(e => e === '💡').length;

    if (hints) data.score -= hints * 2;
    if (data.score < 0) data.score = 0;

    if (bonus) data.score += 2;

    const midPoint = Math.ceil(emoji.length / 2);
    const groupedEmoji = [emoji.slice(0, midPoint), emoji.slice(midPoint)];

    data.text = `Strands\n${groupedEmoji
      .map((group: string[]) => group.join(''))
      .join('\n')}`;

    updateScore(data);
  };

  const scoreHang5 = (text: string) => {
    const data = {
      game: 'hang5',
      score: 10,
      text: '',
    };
    const emoji = text.match(emojiRegex);

    if (!emoji) return;

    const bonus = emoji.filter(e => e === '\u2764').length === 5;
    const errors = emoji.filter(e => e === '🖤').length;

    if (bonus) data.score += 2;
    for (let i = 0; i < errors; i++) {
      data.score -= i * 1;
    }

    data.text = `Hang Five\n${emoji.join('').replace(/\u2764/g, '❤️')}`;

    updateScore(data);
  };

  const scoreConnections = (text: string) => {
    const data = {
      game: 'connections',
      score: 10,
      text: '',
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

    data.text = `Connections\n${emoji
      .map((group: string[]) => group.join(''))
      .join('\n')}`;

    updateScore(data);
  };

  const minutesInput = useRef<HTMLInputElement>(null);
  const secondsInput = useRef<HTMLInputElement>(null);

  const [minutes, setMinutes] = useState<null | number>(null);
  const [seconds, setSeconds] = useState<null | number>(null);

  const handleMinutesChange = () => {
    if (!minutesInput.current) return;
    setMinutes(parseInt(minutesInput.current.value || '0', 10));
  };

  const handleSecondsChange = () => {
    if (!secondsInput.current) return;
    setSeconds(parseInt(secondsInput.current.value || '0', 10));
  };

  const scoreCrosswordMini = () => {
    if (!minutes && !seconds) return;
    const time = (minutes || 0) * 60 + (seconds || 0);
    const data = {
      game: 'crosswordMini',
      score: 10,
      text: `Crossword Mini\n⏱️ ${Math.floor(time / 60)}m ${time % 60}s`,
    };

    if (time <= 30) data.score += 4;
    else if (time <= 45) data.score += 2;
    else if (time > 60) {
      const over = time - 60;
      const firstOver = Math.min(over, 60);
      const secondOver = over > 60 ? over - 60 : 0;

      data.score -= Math.ceil(firstOver / 15) * 1;
      data.score -= Math.ceil(secondOver / 15) * 2;
    }

    if (data.score < 0) data.score = 0;

    updateScore(data);
    setMinutes(null);
    setSeconds(null);
  };

  const scoreClipboard = async (): Promise<void> => {
    const text = await navigator.clipboard.readText();

    const isAlreadyProcessed = /-------------/i.test(text);

    if (isAlreadyProcessed) return;

    const isStrands = /strands/i.test(text);
    const isHang5 = /hang five/i.test(text);
    const isConnections = /connections/i.test(text);

    if (isStrands) scoreStrands(text);
    if (isHang5) scoreHang5(text);
    if (isConnections) scoreConnections(text);
  };

  return (
    <>
      <button onClick={scoreClipboard}>Log Score from Clipboard</button>
      <div className={styles.number__input}>
        <label>Crossword Mini Time:</label>
        <input
          ref={minutesInput}
          value={minutes || ''}
          onInput={handleMinutesChange}
          type="number"
          pattern="[0-9]*"
          placeholder="minutes"
        />
        <input
          ref={secondsInput}
          value={seconds || ''}
          type="number"
          onInput={handleSecondsChange}
          pattern="[0-9]*"
          placeholder="seconds"
        />
        <button onClick={scoreCrosswordMini}>✔</button>
      </div>
    </>
  );
}

export default Input;
