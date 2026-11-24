
'use client';

import { useRef, useState } from 'react';

const LENGTH = 4;
const POSITIONS = Array.from({ length: LENGTH }, (_, i) => i);

export default function OTPInput() {
  const [code, setCode] = useState<string[]>(() => Array(LENGTH).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const updateCode = (value: string, index: number) => {
    const digits = value.replace(/\D/g, '');

    if (!digits) {
      const next = [...code];
      next[index] = '';
      setCode(next);
      return;
    }

    const next = [...code];

    digits.split('').forEach((digit, i) => {
      const position = index + i;
      if (position < LENGTH) next[position] = digit;
    });

    setCode(next);
    focusInput(Math.min(index + digits.length, LENGTH - 1));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      const next = [...code];

      if (code[index]) {
        next[index] = '';
        setCode(next);
      } else if (index > 0) {
        next[index - 1] = '';
        setCode(next);
        focusInput(index - 1);
      }

      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }

    if (e.key === 'ArrowRight' && index < LENGTH - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, LENGTH);

    if (!digits) return;

    const next = Array(LENGTH).fill('');
    digits.split('').forEach((digit, i) => {
      next[i] = digit;
    });

    setCode(next);
    focusInput(Math.min(digits.length, LENGTH - 1));
  };

  return (
    <fieldset className="flex items-center gap-10 border-0 p-0 m-0">
      <legend className="sr-only">
        Код подтверждения из четырёх цифр
      </legend>

      {POSITIONS.map((position) => (
        <input
          key={`otp-${position}`}
          ref={(el) => {
            inputsRef.current[position] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={position === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={LENGTH}
          value={code[position]}
          aria-label={`Цифра ${position + 1} из ${LENGTH}`}
          onChange={(e) => updateCode(e.target.value, position)}
          onKeyDown={(e) => handleKeyDown(e, position)}
          onPaste={handlePaste}
          className={[
            'size-44 shrink-0',
            'br-14 border border-border',
            'bg-surface text-center',
            'font-18 font-w-700 tabular-nums',
            'text-foreground',
            'transition-[border-color,box-shadow,background-color]',
            'duration-200 ease-out',
            'focus:border-secondary',
            'focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]',
            'focus:outline-none',
          ].join(' ')}
        />
      ))}
    </fieldset>
  );
}
