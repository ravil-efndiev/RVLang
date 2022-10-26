import { BinaryOperatorNode, BooleanNode, CodeAreaNode, FunctionNode, MultipleValuesNode, NumberNode, StatementsNode, StringNode, VariableNode } from "./ast.js";
import { TokenTypeList } from "./tokenType.js";
import { arrEquals } from "./helper.js";
import { dataTypes } from "./datatypes.js";

Array.prototype.equals = arrEquals;

class Variable {
    constructor(value, scope, type, hard) {
        this.value = value;
        this.scope = scope;
        this.type = type;
        this.hard = hard;
    }
}
class Function {
    constructor(code, scope) {
        this.code = code;
        this.scope = scope;
    }
}

export let output = {value: ""};

export default class executor {
    constructor() {
        this.variales = {};

        this.systemFunctions = {
            print(parameters) {
                if (!Array.isArray(parameters)) {
                    output.value = output.value.concat(String(parameters) + "\n");
                    return;
                }

                parameters.forEach(parameter => {
                    output.value = output.value.concat(String(parameter) + "\n")
                });
            }
        };

        this.createdFunctions = {};
    }

    selectType(value) {
        if (typeof value == "number") return dataTypes.int;
        if (typeof value == "string") return dataTypes.string;
        if (typeof value == "boolean") return dataTypes.bool;
    }

    runAssignOp(node, scope = []) {
        let result = this.run(node.rightValue);
        let name = node.leftValue;

        if (node.extraParam == "redeclare" && this.variales[name.variable.text] && 
        ((this.variales[name.variable.text].scope.length < scope.length) ||
        (this.variales[name.variable.text].scope.equals(scope))) ) {

            if (this.variales[name.variable.text].hard != true) {
                this.variales[name.variable.text].value = result;
            }
            else {
                if (this.selectType(result) == this.variales[name.variable.text].type)  
                    this.variales[name.variable.text].value = result;
                else 
                    throw new Error(`cannot set ${this.selectType(result)} value to hardly-typed variable ${name.variable.text} of type ${this.variales[name.variable.text].type}`)
            }
            return;
        }
        else if (node.extraParam == "redeclare" && (!this.variales[name.variable.text] ||!(  
            ((this.variales[name.variable.text].scope.length < scope.length) ||
            (this.variales[name.variable.text].scope.equals(scope)))))) {
            throw new Error(`no such variable ${name.variable.text}`);
        }

        if (name.datatype != dataTypes.any) {
            if (this.selectType(result) != name.datatype)
                throw new Error(`trying to asssign ${name.datatype} variable with ${this.selectType(result)} value`)
            this.variales[name.variable.text] = new Variable(result, scope, name.datatype, true);
        }
        else if (name.datatype == dataTypes.any)
            this.variales[name.variable.text] = new Variable(result, scope, this.selectType(result), false);
    }

    runMathOp(node, type) {
        let finalLeft = this.run(node.leftValue);
        let finalRight = this.run(node.rightValue);

        if (!(this.selectType(finalLeft) == dataTypes.int && this.selectType(finalLeft) == dataTypes.int)&&
            !(this.selectType(finalLeft) == dataTypes.string && this.selectType(finalLeft) == dataTypes.string) && 
            type == TokenTypeList.plus) 
                throw new Error("value must have only number type or only string type");
        else if (type != TokenTypeList.plus && 
            !(this.selectType(finalLeft) == dataTypes.int && this.selectType(finalLeft) == dataTypes.int))
                throw new Error("value must have number type");

        switch (type) {
            case TokenTypeList.plus:
                return finalLeft + finalRight;
        
            case TokenTypeList.minus:     
                return finalLeft - finalRight;

            case TokenTypeList.sub:
                return finalLeft * finalRight;

            case TokenTypeList.divide:
                return finalLeft / finalRight;
        }
    }

    runLogicOp(node, type) {
        let finalLeft = this.run(node.leftValue);
        let finalRight = this.run(node.rightValue);

        if (this.selectType(finalLeft) != this.selectType(finalRight)) {
            throw new Error(`illegal comparsion between ${this.selectType(finalLeft)} and ${this.selectType(finalRight)}`);
        }

        switch (type) {
            case TokenTypeList.equal:
                return finalLeft == finalRight;
            case TokenTypeList.more:
                return finalLeft > finalRight;
            case TokenTypeList.less:
                return finalLeft < finalRight;
            case TokenTypeList.moreEqual:
                return finalLeft >= finalRight;
            case TokenTypeList.lessEqual:
                return finalLeft <= finalRight; 
            case TokenTypeList.notEqual:
                return finalLeft != finalRight;
        }
    }
    
    run(node, scope = []) {
        if (node instanceof NumberNode) {
            return parseInt(node.number.text);
        }
        if (node instanceof StringNode) {
            let string = node.string.text.replace(/['"]+/g, '');
            return string;
        }
        if (node instanceof BooleanNode) {
            return (node.bool.text === "true");
        }
        if (node instanceof BinaryOperatorNode) {
            if (node.operator.type == TokenTypeList.assign) {
                this.runAssignOp(node, scope);
            }
            else if (node.operator.type.category == "logic") {
                return this.runLogicOp(node, node.operator.type);
            }
            else if (node.operator.type.category == "math") {
                return this.runMathOp(node, node.operator.type);
            }
        }
        if (node instanceof VariableNode) {

            if (this.variales[node.variable.text] && 
                ((this.variales[node.variable.text].scope.length < scope.length) ||
                (this.variales[node.variable.text].scope.equals(scope))) ) {
               
                return this.variales[node.variable.text].value;
            }
            throw new Error(`no variable with name ${node.variable.text} found`);
        }
        if (node instanceof FunctionNode) {
            if (this.systemFunctions[node.name.text]) {
 
                this.systemFunctions[node.name.text](this.run(node.parameter, node.scope));
            }
            else if (this.createdFunctions[node.name.text]) {
                this.createdFunctions[node.name.text].code.forEach(line => {
                    this.run(line, this.createdFunctions[node.name.text].scope);
                });  
            }
        } 
        if (node instanceof MultipleValuesNode) {
            let values = [];
            node.values.forEach(value => {
                values.push(this.run(value, scope));
            });
            return values;
        }   
        if (node instanceof CodeAreaNode) {
            if (node.type == "func_decl") {
                console.log(`func lol scope is ${node.scope}`)
                this.createdFunctions[node.asociatedName] = new Function(node.lines, node.scope);
            }
            if (node.type == "if") {
                if (this.run(node.args[0]) == true) {
                    node.lines.forEach(line => {this.run(line, node.scope)});
                }
            }
        }
        if (node instanceof StatementsNode) {
            node.codeLines.forEach(codeLine => {this.run(codeLine)});
        }
    }
}
