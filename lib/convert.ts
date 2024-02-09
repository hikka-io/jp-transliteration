'use client';

import Kuroshiro from '@sglkc/kuroshiro';

import Analyzer from '@/lib/analyzer';
import {
    HIRA_UK_ALPHABET,
    KANA_UK_ALPHABET,
    ROMAJI_UK_ALPHABET,
} from '@/lib/constants';





const ALPHABET: Record<string, string> = {
    ...HIRA_UK_ALPHABET,
    ...KANA_UK_ALPHABET,
    ...ROMAJI_UK_ALPHABET,
};

const kuroshiro = new Kuroshiro();
kuroshiro.init(new Analyzer());

export async function romajiToKovalenko(text: string): Promise<string> {
    const convertKanji = await kuroshiro.convert(text, {
        to: 'romaji',
        romajiSystem: 'passport',
    });

    const lowerRomaji = convertKanji.toLowerCase();
    let translated: string = '';
    let i: number = 0;

    while (i < lowerRomaji.length) {
        if (lowerRomaji[i] === ' ') {
            translated += ' ';
            i++;
        } else {
            let checkLen: number = Math.min(3, lowerRomaji.length - i);

            while (checkLen > 0) {
                const checkStr: string = lowerRomaji.slice(i, i + checkLen);

                if (ALPHABET[checkStr] !== undefined) {
                    if (
                        ['a', 'u', 'i', 'o', 'e'].includes(
                            lowerRomaji.slice(i - 1, i)
                        ) &&
                        checkStr === 'i'
                    ) {
                        if (lowerRomaji.slice(i + 1, i + 2) === ' ') {
                            translated += 'й';
                        } else {
                            translated += 'ї';
                        }
                    } else if (
                        checkStr === 'e' &&
                        lowerRomaji.slice(i - 1, i) === 'i'
                    ) {
                        translated += 'є';
                    } else if (
                        checkStr === 'n' &&
                        ['m', 'b', 'p'].includes(
                            lowerRomaji.slice(i + 1, i + 2)
                        )
                    ) {
                        translated += 'м';
                    } else {
                        translated += ALPHABET[checkStr];
                    }

                    i += checkLen;

                    if (i < lowerRomaji.length) {
                        if (
                            lowerRomaji[i] === 'o' &&
                            lowerRomaji.slice(i - 1, i) === 'o'
                        ) {
                            translated += ALPHABET['u'];
                            i++;
                        } else if (
                            lowerRomaji[i] === 'e' &&
                            lowerRomaji.slice(i - 1, i) === 'e'
                        ) {
                            translated += ALPHABET['i'];
                            i++;
                        }
                    }

                    break;
                }

                checkLen--;
            }

            if (checkLen === 0) {
                if (text[i] !== undefined) {
                    translated += text[i];
                }
                i++;
            }
        }
    }

    return translated;
}
