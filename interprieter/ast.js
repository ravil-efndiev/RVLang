import { dataTypes } from "./datatypes.js";

export class ExpressionNode {}

export class StatementsNode extends ExpressionNode {
    codeLines = [];

    addNode(node) {
        this.codeLines.push(node);
    }
}

export class VariableNode extends ExpressionNode {
    constructor(variable, datatype = dataTypes.any) {
        super();
        this.variable = variable;
        this.datatype = datatype;
    }
}

export class NumberNode extends ExpressionNode {
    constructor(number) {
        super();
        this.number = number;
    }
}

export class StringNode extends ExpressionNode {
    constructor(string) {
        super();
        this.string = string;
    }
}

export class BooleanNode extends ExpressionNode {
    constructor(bool) {
        super();
        this.bool = bool;
    }
}

export class BinaryOperatorNode extends ExpressionNode {
    constructor(operator, leftValue, rightValue, extraParam = "") {
        super();
        this.operator = operator;
        this.leftValue = leftValue;
        this.rightValue = rightValue;
        this.extraParam = extraParam;
    }
}

export class MultipleValuesNode extends ExpressionNode {
    constructor(values) {
        super();
        this.values = values;
    } 
}

export class FunctionNode extends ExpressionNode {
    constructor(name, parameter, scope = []) {
        super();
        this.name = name;
        this.parameter = parameter;
        this.scope = scope;
    }
}

export class CodeAreaNode extends ExpressionNode {
    constructor(type, asociatedName = "", args = [], scope = []) {
        super();
        this.lines = [];
        this.type = type;
        this.asociatedName = asociatedName;
        this.args = args;
        this.scope = scope
    }

    addLine(line) {
        this.lines.push(line);
    }
}
