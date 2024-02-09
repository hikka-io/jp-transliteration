import { getTokenizer } from 'kuromojin';





export default class Analyzer {
    _analyzer: any;

    constructor() {
        this._analyzer = null;
    }

    init() {
        return new Promise((resolve) => {
            getTokenizer({ dicPath: '/dict' }).then((tokenizer) => {
                this._analyzer = tokenizer;

                resolve(tokenizer);
            });
        });
    }

    parse(str: string = '') {
        if (!this._analyzer) {
            return Promise.reject(new Error('Analyzer not initialized'));
        }

        return new Promise((resolve) => {
            let result = this._analyzer.tokenize(str);

            result = result.map((token: any) => {
                return {
                    ...token,
                    verbose: {
                        word_id: token.word_id,
                        word_type: token.word_type,
                        word_position: token.word_position,
                    },
                };
            });

            resolve(result);
        });
    }
}
