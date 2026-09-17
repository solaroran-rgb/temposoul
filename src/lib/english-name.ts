// src/lib/english-name.ts
import { letterToNumber, reduceToDigit } from '@/data/onomastics/english-name-mapping';
import { NUMBER_MEANINGS, NumberMeaning } from '@/data/onomastics/number-meanings';
import { getWuxingBySyllable } from '@/data/onomastics/chinese-transliteration-wuxing';

export interface EnglishNameAnalysis {
  fullName: string;
  lifePathNumber: number;
  expressionNumber: number;
  personalityNumber: number;
  chineseWuxingRef: string;
  meanings: NumberMeaning[];
}

export function analyzeEnglishName(fullName: string): EnglishNameAnalysis {
  const clean = fullName.replace(/[^a-zA-Z\s]/g, '');
  const consonants = clean.replace(/\s/g, '').match(/[^aeiou]/gi) ?? [];

  const allValues = clean.replace(/\s/g, '').split('').map(letterToNumber);

  const sumAll = allValues.reduce((a, b) => a + b, 0);
  const sumPersonality = consonants.map(letterToNumber).reduce((a, b) => a + b, 0);

  // 三个主数均直接调 reduceToDigit(sum)：循环内中途拦截 11/22/33，绝不手写先行归约。
  const lifePathNumber = reduceToDigit(sumAll);
  const expressionNumber = reduceToDigit(sumAll);
  const personalityNumber = reduceToDigit(sumPersonality);

  const firstChar = clean.trim().charAt(0).toLowerCase();
  const chineseWuxingRef = getWuxingBySyllable(firstChar);

  const meanings = NUMBER_MEANINGS.filter((m) =>
    [lifePathNumber, expressionNumber, personalityNumber].includes(m.number),
  );

  return {
    fullName,
    lifePathNumber,
    expressionNumber,
    personalityNumber,
    chineseWuxingRef,
    meanings,
  };
}
