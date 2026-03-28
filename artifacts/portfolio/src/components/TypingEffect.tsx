"use client";

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function TypingEffect({ 
  words, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseTime = 2000 
}: TypingEffectProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer: number;

    if (isDeleting) {
      timer = window.setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      timer = window.setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          timer = window.setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center min-h-[40px] md:min-h-[56px]">
      <span className="text-primary font-display font-semibold">{text}</span>
      <span className="w-[3px] h-[1em] bg-primary ml-1 animate-cursor-blink"></span>
    </span>
  );
}
