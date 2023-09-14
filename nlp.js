var NLPtool = /** @class */ (function () {
    function NLPtool(filename) {
        this.filename = filename;
        { // Define the fRead function
            if (typeof require != "undefined") {
                var fs_1 = require('fs');
                this.fRead = function (filename) {
                    return fs_1.readFileSync(filename, 'utf8').replace(/\r\n/g, "\n");
                };
            }
            else {
                this.fRead = function (filename) {
                    var hr = new XMLHttpRequest();
                    hr.open("GET", filename, false);
                    hr.send(null);
                    if (hr.status == 200 || hr.status == 304) {
                        return hr.responseText.replace(/\r\n/g, "\n");
                    }
                    else {
                        throw "err " + filename;
                    }
                };
            }
        }
        this.code = this.fRead(filename);
        console.log(this.code);
    }
    NLPtool.prototype.tokenizeerror = function (message, i) {
        // @ts-ignore
        var error = new Error(message, this.filename);
        error.name = "NLP_TokenizeError";
        var LineAndCol = this.getLineAndCol(i);
        // @ts-ignore
        error.lineNumber = LineAndCol.line;
        error.columnNumber = LineAndCol.col;
        //error.stack = ""
        return error;
    };
    NLPtool.prototype.getLineAndCol = function (i) {
        var j = 0;
        var line = 1;
        var col = 1;
        while (j < i) {
            if (this.code[j] == "\n") {
                line++;
                col = 0;
            }
            else {
                col++;
            }
            j++;
        }
        return { line: line, col: col };
    };
    NLPtool.prototype.tokenize = function () {
        var tar = [];
        this.tokenarr = tar;
        var state = 0;
        var i = 0;
        var tc = this.code;
        console.log(tar);
        this.tokenizerstates = ["TopLevel", "ImportStat.Sharp", "TopLevelDef.Exclam", "TopLevel.Blank", "TopLevel.EOL", "Error", "gVarDef.EOL", "ImportStat.EOL", "ImportStat.Error", "ImportStat.Declaration", "ImportStat.Blank", "ImportStat.Filename", "ImportStat.EOStat", "ImportStat.AfterBlank", "TopLevelDef.Error", "TopLevelDef.Declaration", "gVarDef.Colon1", "FunctionDef.Colon1", "gVarDef.Blank1", "gVarDef.Error", "gVarDef.gVarType", "gVarDef.Blank2", "gVarDef.Colon2", "gVarDef.Blank3", "gVarDef.Name", "gVarDef.EOStat", "gVarDef.AfterBlank", "FunctionDef.Blank1", "FunctionDef.Error", "FunctionDef.RetType", "FunctionDef.Blank2", "FunctionDef.Colon2", "FunctionDef.Arg.Lparen", "FunctionDef.ArgBody", "FunctionDef.Arg.Blank", "FunctionDef.Comma", "FunctionDef.Rparen", "FunctionDef.Colon3", "FunctionDef.Blank3", "FunctionDef.FName", "FunctionDef.Blank4", "BlockTop"];
        var sts = this.tokenizerstates;
        while (i < this.code.length) {
            {
                if (false) { }
                else if (state == 0 && ((tc[i] == "#"))) {
                    state = 1;
                }
                else if (state == 0 && ((tc[i] == "!"))) {
                    state = 2;
                }
                else if (state == 0 && ((tc[i] == " "))) {
                    state = 3;
                }
                else if (state == 0 && ((tc[i] == "\n"))) {
                    state = 4;
                }
                else if (state == 0 && (!(tc[i] == "#")) && (!(tc[i] == "!")) && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[0], " => ").concat(sts[5], "; !sharp&!exclam&!space&!LF"), i);
                }
                else if (state == 3 && ((tc[i] == "\n"))) {
                    state = 4;
                }
                else if (state == 3 && ((tc[i] == "#"))) {
                    state = 1;
                }
                else if (state == 3 && ((tc[i] == "!"))) {
                    state = 2;
                }
                else if (state == 3 && (!(tc[i] == "#")) && (!(tc[i] == "!")) && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[3], " => ").concat(sts[5], "; !sharp&!exclam&!space&!LF"), i);
                }
                else if (state == 4 && ((tc[i] == " "))) {
                    state = 3;
                }
                else if (state == 4 && ((tc[i] == "#"))) {
                    state = 1;
                }
                else if (state == 4 && ((tc[i] == "!"))) {
                    state = 2;
                }
                else if (state == 4 && (!(tc[i] == "#")) && (!(tc[i] == "!")) && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[4], " => ").concat(sts[5], "; !sharp&!exclam&!space&!LF"), i);
                }
                else if (state == 6) {
                    state = 0;
                }
                else if (state == 7) {
                    state = 0;
                }
                else if (state == 1 && ((tc[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[1], " => ").concat(sts[8], "; space"), i);
                }
                else if (state == 1 && (!(tc[i] == " "))) {
                    state = 9;
                }
                else if (state == 9 && ((tc[i] == " ")) && ((tar[tar.length - 1].val == "include" || tar[tar.length - 1].val == "using"))) {
                    state = 10;
                }
                else if (state == 9 && ((tc[i] == " ")) && (!(tar[tar.length - 1].val == "include" || tar[tar.length - 1].val == "using"))) {
                    throw this.tokenizeerror("".concat(sts[9], " => ").concat(sts[8], "; space&!decl=(\"include\"|\"using\")"), i);
                }
                else if (state == 10 && ((tc[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[10], " => ").concat(sts[8], "; semicolon"), i);
                }
                else if (state == 10 && (!(tc[i] == " ")) && (!(tc[i] == ";"))) {
                    state = 11;
                }
                else if (state == 11 && (!(tc[i] == " ")) && ((tc[i] == ";"))) {
                    state = 12;
                }
                else if (state == 11 && ((tc[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[11], " => ").concat(sts[8], "; space"), i);
                }
                else if (state == 12 && ((tc[i] == " "))) {
                    state = 13;
                }
                else if (state == 12 && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[12], " => ").concat(sts[8], "; !space&!LF"), i);
                }
                else if (state == 13 && ((tc[i] == "\n"))) {
                    state = 7;
                }
                else if (state == 12 && ((tc[i] == "\n"))) {
                    state = 7;
                }
                else if (state == 13 && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[13], " => ").concat(sts[8], "; !space&!LF"), i);
                }
                else if (state == 2 && ((tc[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[2], " => ").concat(sts[14], "; space"), i);
                }
                else if (state == 2 && (!(tc[i] == " "))) {
                    state = 15;
                }
                else if (state == 15 && ((tc[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[15], " => ").concat(sts[14], "; space"), i);
                }
                else if (state == 15 && ((tc[i] == ":")) && (!(tar[tar.length - 1].val == "fn" || tar[tar.length - 1].val == "global"))) {
                    throw this.tokenizeerror("".concat(sts[15], " => ").concat(sts[14], "; colon&!decl=(\"fn\"|\"global\")"), i);
                }
                else if (state == 15 && ((tc[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[15], " => ").concat(sts[14], "; semicolon"), i);
                }
                else if (state == 15 && ((tc[i] == ":")) && ((tar[tar.length - 1].val == "global"))) {
                    state = 16;
                }
                else if (state == 15 && ((tc[i] == ":")) && ((tar[tar.length - 1].val == "fn"))) {
                    state = 17;
                }
                else if (state == 16 && ((tc[i] == " "))) {
                    state = 18;
                }
                else if (state == 16 && ((tc[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[16], " => ").concat(sts[19], "; semicolon"), i);
                }
                else if (state == 16 && (!(tc[i] == " ")) && (!(tc[i] == ";"))) {
                    state = 20;
                }
                else if (state == 18 && (!(tc[i] == " "))) {
                    state = 20;
                }
                else if (state == 20 && ((tc[i] == " "))) {
                    state = 21;
                }
                else if (state == 21 && ((tc[i] == ":"))) {
                    state = 22;
                }
                else if (state == 20 && ((tc[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[20], " => ").concat(sts[19], "; semicolon"), i);
                }
                else if (state == 20 && ((tc[i] == ":"))) {
                    state = 22;
                }
                else if (state == 21 && (!(tc[i] == " ")) && (!(tc[i] == ":"))) {
                    throw this.tokenizeerror("".concat(sts[21], " => ").concat(sts[19], "; !space&!colon"), i);
                }
                else if (state == 22 && ((tc[i] == " "))) {
                    state = 23;
                }
                else if (state == 23 && ((tc[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[23], " => ").concat(sts[19], "; semicolon"), i);
                }
                else if (state == 23 && (!(tc[i] == " ")) && (!(tc[i] == ";"))) {
                    state = 24;
                }
                else if (state == 24 && ((tc[i] == ";"))) {
                    state = 25;
                }
                else if (state == 25 && ((tc[i] == " "))) {
                    state = 26;
                }
                else if (state == 25 && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[25], " => ").concat(sts[19], "; !space&!LF"), i);
                }
                else if (state == 26 && ((tc[i] == "\n"))) {
                    state = 6;
                }
                else if (state == 25 && ((tc[i] == "\n"))) {
                    state = 6;
                }
                else if (state == 26 && (!(tc[i] == " ")) && (!(tc[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[26], " => ").concat(sts[19], "; !space&!LF"), i);
                }
                else if (state == 17 && ((tc[i] == " "))) {
                    state = 27;
                }
                else if (state == 17 && ((tc[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[17], " => ").concat(sts[28], "; semicolon"), i);
                }
                else if (state == 17 && (!(tc[i] == " ")) && (!(tc[i] == ";"))) {
                    state = 29;
                }
                else if (state == 27 && (!(tc[i] == " "))) {
                    state = 29;
                }
                else if (state == 29 && ((tc[i] == " "))) {
                    state = 30;
                }
                else if (state == 30 && (!(tc[i] == " ")) && (!(tc[i] == ":"))) {
                    throw this.tokenizeerror("".concat(sts[30], " => ").concat(sts[28], "; !space&!colon"), i);
                }
                else if (state == 30 && ((tc[i] == ":"))) {
                    state = 31;
                }
                else if (state == 31 && ((tc[i] == "("))) {
                    state = 32;
                }
                else if (state == 31 && (!(tc[i] == "("))) {
                    throw this.tokenizeerror("".concat(sts[31], " => ").concat(sts[28], "; !lparen"), i);
                }
                else if (state == 32 && ((tc[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[32], " => ").concat(sts[28], "; space"), i);
                }
                else if (state == 32 && (!(tc[i] == " "))) {
                    state = 33;
                }
                else if (state == 34 && (!(tc[i] == " "))) {
                    state = 33;
                }
                else if (state == 33 && ((tc[i] == ","))) {
                    state = 35;
                }
                else if (state == 33 && ((tc[i] == ")"))) {
                    state = 36;
                }
                else if (state == 35 && ((tc[i] == " "))) {
                    state = 34;
                }
                else if (state == 35 && (!(tc[i] == " "))) {
                    state = 33;
                }
                else if (state == 36 && ((tc[i] == ":"))) {
                    state = 37;
                }
                else if (state == 36 && (!(tc[i] == ":"))) {
                    throw this.tokenizeerror("".concat(sts[36], " => ").concat(sts[28], "; !colon"), i);
                }
                else if (state == 37 && ((tc[i] == " "))) {
                    state = 38;
                }
                else if (state == 37 && (!(tc[i] == " "))) {
                    state = 39;
                }
                else if (state == 38 && (!(tc[i] == " "))) {
                    state = 39;
                }
                else if (state == 39 && ((tc[i] == " "))) {
                    state = 40;
                }
                else if (state == 39 && ((tc[i] == "{"))) {
                    state = 41;
                }
                else if (state == 40 && (!(tc[i] == " "))) {
                    state = 41;
                }
            }
            if (state != 0) {
                console.log(i, this.code[i].replace(/\n/g, "\\n"), sts[state], state);
                if (tar.length == 0 || state != tar[tar.length - 1].type) {
                    tar.push({ type: state, type_str: sts[state], val: this.code[i], i: i });
                }
                else {
                    tar[tar.length - 1].val += this.code[i];
                }
                //console.table(tar)
                i++;
            }
        }
        console.table(tar);
        return this;
    };
    return NLPtool;
}());
if (!(typeof require != "undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
}
