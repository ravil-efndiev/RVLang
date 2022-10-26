import Lexer from "./interprieter/lexer.js";
import Parser from "./interprieter/parser.js";
import Executor, {output} from "./interprieter/executor.js";

const textarea = document.getElementById("code");
const lineNumbers = document.querySelector(".line-numbers");

textarea.addEventListener("keyup", event => {
  const numberOfLines = event.target.value.split("\n").length;

  lineNumbers.innerHTML = Array(numberOfLines)
    .fill("<span></span>")
    .join("");
});

textarea.addEventListener("keydown", event => {
    if (event.key === "Tab") {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);

        event.preventDefault();
    }
});

const button = document.querySelector(".run_btn");
const _output = document.querySelector(".output");

button.addEventListener("click", event => {
    const code = textarea.value;
    const lexer = new Lexer(code);
    lexer.splitTokens();
    console.log(lexer.tokenList);   

    output.value = "";
    const parser = new Parser(lexer.tokenList);
    let node = parser.parseCode();

    let executor = new Executor();
    executor.run(node);

    _output.innerHTML = output.value;
});
