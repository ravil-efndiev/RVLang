import Token from "./token.js";
import { TokenTypeList } from "./tokenType.js";

export default class Lexer {
    constructor (code) {
        this.code = code;
        this.globalPos = 0;
        this.tokenList = [];
    }

    splitTokens() {
        this.code = this.code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'');

        while (this.nextToken())
        {
            console.log("found");
        }
        return this.tokenList;
    }

    nextToken() {
        if (this.globalPos >= this.code.length)
        {
            return false;
        }

        const tokenTypesValues = Object.values(TokenTypeList);

        for (let i = 0; i < tokenTypesValues.length; i++) {
            const tokenType = tokenTypesValues[i];
            const regex = new RegExp("^" + tokenType.regex);
            const result = this.code.substr(this.globalPos).match(regex);
            if (result && result[0]) {
                const token = new Token(tokenType, result[0], this.pos);
                this.globalPos += result[0].length;
                this.tokenList.push(token);
                return true;
            }
        }
        throw new Error(`on position ${this.globalPos} found token error`);
    }
}
