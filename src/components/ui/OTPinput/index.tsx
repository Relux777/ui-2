
'use client';

import { useRef, useState } from 'react';

const LENGTH = 4;

export default function OTPInput() {
  const [code, setCode] = useState<string[]>(Array(LENGTH).fill(''));
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

    // Поддержка вставки сразу нескольких цифр
    digits.split('').forEach((digit, i) => {
      const position = index + i;
      if (position < LENGTH) next[position] = digit;
    });

    setCode(next);

    const nextIndex = Math.min(index + digits.length, LENGTH - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const next = [...code];
        next[index] = '';
        setCode(next);
      } else if (index > 0) {
        const next = [...code];
        next[index - 1] = '';
        setCode(next);
        focusInput(index - 1);
      }

      e.preventDefault();
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
    <div
      role="group"
      aria-label="Код подтверждения из четырёх цифр"
      className="flex items-center gap-10"
    >
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={LENGTH}
          value={digit}
          aria-label={`Цифра ${index + 1} из ${LENGTH}`}
          onChange={(e) => updateCode(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
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
            'placeholder:text-muted',
          ].join(' ')}
        />
      ))}
    </div>
  );
}
