import { BinaryOperatorNode, BooleanNode, CodeAreaNode, FunctionNode, MultipleValuesNode, NumberNode, StatementsNode, StringNode, VariableNode } from "./ast.js";
import { dataTypes } from "./datatypes.js";
import { TokenTypeList } from "./tokenType.js";

export default class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;

        this.namelessStatementCounter = 0;

        for (let i = 0; i < this.tokens.length; i++) {
            let token = this.tokens[i];
            if (token.type == TokenTypeList.space)
                this.tokens.splice(i, 1);
        }
    }

    search(...wanted) {
        if (this.pos < this.tokens.length) {
            let currentToken = this.tokens[this.pos];

            if (wanted.find(type => type.name == currentToken.type.name)) {
                this.pos += 1;
                return currentToken;
            }
        }
        return null;
    }

    require(...wanted) {
        let token = this.search(...wanted);
        if (token == null)
            throw new Error(`required ${wanted[0].name} on ${this.pos}`);
        return token;
    }

    parseCode() {
        const main = new StatementsNode();
        
        while(this.pos < this.tokens.length) {
            let lineNode = this.parseLine();
            if (!(lineNode instanceof CodeAreaNode)) 
                this.require(TokenTypeList.semicolon);
            main.addNode(lineNode);
        }
        return main;
    }

    parseLine(inScope = []) {
        if (this.search(TokenTypeList.variable_keyword)) return this.parseStartVariable();
        if (this.search(TokenTypeList.int_keyword)) return this.parseStartVariable(dataTypes.int);
        if (this.search(TokenTypeList.bool_keyword)) return this.parseStartVariable(dataTypes.bool);
        if (this.search(TokenTypeList.string_keyword)) return this.parseStartVariable(dataTypes.string);

        if (this.search(TokenTypeList.function_keyword)) {
            return this.parseStartFunction();
        }
        let name = this.search(TokenTypeList.usable_name);
        if (name) {
            return this.parseStartName(name, inScope);
        }
        if (this.search(TokenTypeList.if_keyword)) {
            return this.parseStartIf(inScope);
        }
    }

    // parseline help methods
    parseStartVariable(datatype = dataTypes.any) {
        let variableName = this.require(TokenTypeList.usable_name);
        let assignOperator = this.require(TokenTypeList.assign);

        let leftNode = new VariableNode(variableName, datatype);
        console.log(datatype);
        let rightNode = this.parseExpression();
        let assignNode = new BinaryOperatorNode(assignOperator, leftNode, rightNode);
        return assignNode;
    }
    parseStartName(name, inScope = []) {
        if (this.search(TokenTypeList.lpar)) {
            // function call
            let value = this.parseMultipleValues();
            this.require(TokenTypeList.rpar);
            let func = new FunctionNode(name, value, inScope);
            return func;
        }
        let assignOp = this.search(TokenTypeList.assign);
        if (assignOp) {
            //redeclare of variable
            let left = new VariableNode(name);
            let right = this.parseExpression();
            let assignNode = new BinaryOperatorNode(assignOp, left, right, "redeclare");
            return assignNode;
        }
    }
    parseStartFunction() {
        let funcName = this.require(TokenTypeList.usable_name);
        let lpar = this.require(TokenTypeList.lpar);
        
        let rpar = this.require(TokenTypeList.rpar);
        let leftBracket = this.require(TokenTypeList.lc_bracket);
        let rightBracket = this.search(TokenTypeList.rc_bracket);
        const codeAreaNode = new CodeAreaNode("func_decl", funcName.text, [], ["fn" + funcName.text]);
        while (!rightBracket) {
            const line = this.parseLine(["fn" + funcName.text]);
            if (!(line instanceof CodeAreaNode)) 
                this.require(TokenTypeList.semicolon);
            codeAreaNode.addLine(line);
            rightBracket = this.search(TokenTypeList.rc_bracket);
        }
        return codeAreaNode;
    }
    parseStartIf(inScope = []) {
        let expression = this.parseExpression();
        this.require(TokenTypeList.lc_bracket);
        let rightBracket = this.search(TokenTypeList.rc_bracket);
        this.namelessStatementCounter++;
        const codeAreaNode = new CodeAreaNode("if", "1", [expression], [].concat(inScope, "nms" + String(this.namelessStatementCounter)));
        while (!rightBracket) {
            const line = this.parseLine([].concat(inScope, "nms" + String(this.namelessStatementCounter)));
            if (!(line instanceof CodeAreaNode)) 
                this.require(TokenTypeList.semicolon);
            codeAreaNode.addLine(line);
            rightBracket = this.search(TokenTypeList.rc_bracket);
        }
        return codeAreaNode;
    }

    // normal parse methods
    parseExpression() {
        let leftNode = this.parseBrackets();
        let operator = this.search(TokenTypeList.plus, TokenTypeList.minus, TokenTypeList.sub, TokenTypeList.divide, TokenTypeList.equal, TokenTypeList.more, TokenTypeList.less, TokenTypeList.moreEqual, TokenTypeList.lessEqual, TokenTypeList.notEqual);
        while (operator) {
            let rightNode = this.parseBrackets();
            leftNode = new BinaryOperatorNode(operator, leftNode, rightNode);
            operator = this.search(TokenTypeList.plus, TokenTypeList.minus, TokenTypeList.sub, TokenTypeList.divide, TokenTypeList.equal, TokenTypeList.more, TokenTypeList.less, TokenTypeList.moreEqual, TokenTypeList.lessEqual, TokenTypeList.notEqual);
        }
        return leftNode;
    }

    parseBrackets() {
        if (this.search(TokenTypeList.lpar)) {
            let expression = this.parseExpression();
            this.require(TokenTypeList.rpar);
            return expression;
        }
        else {
            return this.parseUsable();
        }
    }

    parseUsable() {
        let number = this.search(TokenTypeList.number);
        if (number) return new NumberNode(number);
        
        let variable = this.search(TokenTypeList.usable_name);
        if (variable) return new VariableNode(variable);

        let string = this.search(TokenTypeList.string);
        if (string) return new StringNode(string);

        let bool = this.search(TokenTypeList.boolean);
        if (bool) return new BooleanNode(bool);
    }

    parseMultipleValues() {
        let first = this.parseExpression();
        let operator = this.search(TokenTypeList.coma);
        if (!operator) return first;

        let finalArray = [first];
        while (operator) {
            let next = this.parseExpression();
            finalArray.push(next);
            operator = this.search(TokenTypeList.coma);
        }
        let returns = new MultipleValuesNode(finalArray);
        return returns;
    }
}
