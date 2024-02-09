'use client';

import { useEffect, useState } from 'react';
import { Copy, Info } from 'lucide-react';
import { toast } from 'sonner';

import { romajiToKovalenko } from '@/lib/convert';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TypoH3 from '@/components/typo/typoH3';





export default function IndexPage() {
    const [text, setText] = useState<string>('');
    const [convertedText, setConvertedText] = useState<string>('');

    useEffect(() => {
        romajiToKovalenko(text).then((res) => setConvertedText(res));
    }, [text]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Текст успішно скопійований.')
        } catch (error) {
            toast.error('Виникла помилка при спробі скопіювати текст.')
        }
    };

    return (
        <section className="container max-w-screen-md gap-6 pb-8 pt-6 md:py-10 ">
            <div className="flex w-full flex-col gap-6">
                <Alert>
                    <Info className="size-4" />
                    <AlertTitle>Важливо</AlertTitle>
                    <AlertDescription>
                        Транслітерація може бути неточною, або неправильною.
                        Інструмент наразі не завершений, правильність
                        конвертації залишається за Вами.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col gap-2">
                    <Label>Фраза</Label>
                    <Input
                        value={text}
                        placeholder="Введіть фразу"
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="relative overflow-hidden rounded-md border bg-background">
                    <div className=" flex max-h-56 min-h-40 items-center justify-center overflow-y-auto p-4">
                        <div className="m-auto text-center capitalize">
                            <TypoH3
                                className={cn(
                                    'break-words',
                                    !convertedText && 'text-muted-foreground'
                                )}
                            >
                                {convertedText || '[...]'}
                            </TypoH3>
                        </div>
                    </div>
                    <div className="absolute right-2 top-2 z-10">
                        <Button
                            disabled={!convertedText}
                            variant="outline"
                            size="icon"
                            className="bg-background"
                            onClick={() =>
                              copyToClipboard(convertedText)
                            }
                        >
                            <Copy className="size-5" />
                        </Button>
                    </div>
                    <div className="absolute left-0 top-0 h-12 w-full bg-gradient-to-b from-background to-transparent" />
                    <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-background to-transparent" />
                </div>
            </div>
        </section>
    );
}
