export class TokenType {
    constructor(name, regex, category = "") {
        this.name = name;
        this.regex = regex;
        this.category = category;
    }
}

export const TokenTypeList = {
    number: new TokenType("number", "[0-9]*"),
    string: new TokenType("string", String.raw`(["'])(?:(?=(\\?))\2.)*?\1`),
    boolean: new TokenType("boolean", "(true|false)"),
    int_keyword: new TokenType("int_type_keyword", "int", "datatype"),
    string_keyword: new TokenType("string_type_keyword", "string", "datatype"),
    bool_keyword: new TokenType("bool_type_keyword", "bool", "datatype"),
    variable_keyword: new TokenType("var_keyword", "var"),
    function_keyword: new TokenType("function_keyword", "func"),
    if_keyword: new TokenType("if_keyword", "if"),
    while_keyword: new TokenType("while_keyword", "while"),
    usable_name: new TokenType("use_name", "[a-zA-z_]+[a-zA-z0-9]*"),
    space: new TokenType("space", "[\ \\n\\t\\r]*"),
    semicolon: new TokenType("semicolon", ";"),
    equal: new TokenType("equal", "(==)", "logic"),
    notEqual: new TokenType("not_equal", "(!=)", "logic"),
    moreEqual: new TokenType("more_equal", ">=", "logic"),
    lessEqual: new TokenType("less_equal", "<=", "logic"),
    more: new TokenType("more", ">", "logic"),
    less: new TokenType("less", "<", "logic"),
    assign: new TokenType("assign", "\\="),
    plus: new TokenType("plus", "\\+", "math"),
    minus: new TokenType("minus", "\\-", "math"),
    sub: new TokenType("sub", "\\*", "math"),
    divide: new TokenType("divide", "\\/", "math"),
    lpar: new TokenType("left_par", "\\("),
    rpar: new TokenType("right_par", "\\)"),
    coma: new TokenType("coma", ","),
    lc_bracket: new TokenType("lef_curly_bracket", "\\{"),
    rc_bracket: new TokenType("lef_curly_bracket", "\\}"),
};
