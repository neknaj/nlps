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
        this.tokenize();
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
        var tokenarr = [];
        this.tokenarr = tokenarr;
        var state = 0;
        var i = 0;
        console.log(tokenarr);
        this.tokenizerstates = ["TopLevel", "ImportStat.Sharp", "TopLevelDef.Exclam", "TopLevel.Blank", "TopLevel.EOL", "Error", "gVarDef.EOL", "ImportStat.EOL", "ImportStat.Error", "ImportStat.Declaration", "ImportStat.Blank", "ImportStat.Filename", "ImportStat.EOStat", "ImportStat.AfterBlank", "TopLevelDef.Error", "TopLevelDef.Declaration", "gVarDef.Colon1", "FunctionDef.Colon1", "FunctionDef.Blank1", "FunctionDef.Error", "FunctionDef.RetType", "FunctionDef.Blank2", "FunctionDef.Colon2", "gVarDef.Blank1", "gVarDef.Error", "gVarDef.gVarType", "gVarDef.Blank2", "gVarDef.Colon2", "gVarDef.Blank3", "gVarDef.Name", "gVarDef.EOStat", "gVarDef.AfterBlank"];
        var sts = this.tokenizerstates;
        while (i < this.code.length) {
            {
                if (false) { }
                else if (state == 0 && ((this.code[i] == "#"))) {
                    state = 1;
                }
                else if (state == 0 && ((this.code[i] == "!"))) {
                    state = 2;
                }
                else if (state == 0 && ((this.code[i] == " "))) {
                    state = 3;
                }
                else if (state == 0 && ((this.code[i] == "\n"))) {
                    state = 4;
                }
                else if (state == 0 && (!(this.code[i] == "#")) && (!(this.code[i] == "!")) && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[0], " => ").concat(sts[5], "; ").concat(sts[-1]), i);
                }
                else if (state == 3 && ((this.code[i] == "\n"))) {
                    state = 4;
                }
                else if (state == 3 && ((this.code[i] == "#"))) {
                    state = 1;
                }
                else if (state == 3 && ((this.code[i] == "!"))) {
                    state = 2;
                }
                else if (state == 3 && (!(this.code[i] == "#")) && (!(this.code[i] == "!")) && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[3], " => ").concat(sts[5], "; ").concat(sts[-1]), i);
                }
                else if (state == 4 && ((this.code[i] == " "))) {
                    state = 3;
                }
                else if (state == 4 && ((this.code[i] == "#"))) {
                    state = 1;
                }
                else if (state == 4 && ((this.code[i] == "!"))) {
                    state = 2;
                }
                else if (state == 4 && (!(this.code[i] == "#")) && (!(this.code[i] == "!")) && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[4], " => ").concat(sts[5], "; ").concat(sts[-1]), i);
                }
                else if (state == 6) {
                    state = 0;
                }
                else if (state == 7) {
                    state = 0;
                }
                else if (state == 1 && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[1], " => ").concat(sts[8], "; ").concat(sts[-1]), i);
                }
                else if (state == 1 && (!(this.code[i] == " "))) {
                    state = 9;
                }
                else if (state == 9 && ((this.code[i] == " ")) && ((tokenarr[tokenarr.length - 1].val == "include" || tokenarr[tokenarr.length - 1].val == "using"))) {
                    state = 10;
                }
                else if (state == 9 && ((this.code[i] == " ")) && (!(tokenarr[tokenarr.length - 1].val == "include" || tokenarr[tokenarr.length - 1].val == "using"))) {
                    throw this.tokenizeerror("".concat(sts[9], " => ").concat(sts[8], "; ").concat(sts[-1]), i);
                }
                else if (state == 10 && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[10], " => ").concat(sts[8], "; ").concat(sts[-1]), i);
                }
                else if (state == 10 && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = 11;
                }
                else if (state == 11 && (!(this.code[i] == " ")) && ((this.code[i] == ";"))) {
                    state = 12;
                }
                else if (state == 11 && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[11], " => ").concat(sts[8], "; ").concat(sts[-1]), i);
                }
                else if (state == 12 && ((this.code[i] == " "))) {
                    state = 13;
                }
                else if (state == 12 && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[12], " => ").concat(sts[8], "; ").concat(sts[-1]), i);
                }
                else if (state == 13 && ((this.code[i] == "\n"))) {
                    state = 7;
                }
                else if (state == 12 && ((this.code[i] == "\n"))) {
                    state = 7;
                }
                else if (state == 13 && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[13], " => ").concat(sts[8], "; ").concat(sts[-1]), i);
                }
                else if (state == 2 && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[2], " => ").concat(sts[14], "; ").concat(sts[-1]), i);
                }
                else if (state == 2 && (!(this.code[i] == " "))) {
                    state = 15;
                }
                else if (state == 15 && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("".concat(sts[15], " => ").concat(sts[14], "; ").concat(sts[-1]), i);
                }
                else if (state == 15 && ((this.code[i] == ":")) && (!(tokenarr[tokenarr.length - 1].val == "fn" || tokenarr[tokenarr.length - 1].val == "global"))) {
                    throw this.tokenizeerror("".concat(sts[15], " => ").concat(sts[14], "; ").concat(sts[-1]), i);
                }
                else if (state == 15 && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[15], " => ").concat(sts[14], "; ").concat(sts[-1]), i);
                }
                else if (state == 15 && ((this.code[i] == ":")) && ((tokenarr[tokenarr.length - 1].val == "global"))) {
                    state = 16;
                }
                else if (state == 15 && ((this.code[i] == ":")) && ((tokenarr[tokenarr.length - 1].val == "fn"))) {
                    state = 17;
                }
                else if (state == 17 && ((this.code[i] == " "))) {
                    state = 18;
                }
                else if (state == 17 && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[17], " => ").concat(sts[19], "; ").concat(sts[-1]), i);
                }
                else if (state == 17 && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = 20;
                }
                else if (state == 18 && (!(this.code[i] == " "))) {
                    state = 20;
                }
                else if (state == 20 && ((this.code[i] == " "))) {
                    state = 21;
                }
                else if (state == 21 && (!(this.code[i] == " ")) && (!(this.code[i] == ":"))) {
                    throw this.tokenizeerror("".concat(sts[21], " => ").concat(sts[19], "; ").concat(sts[-1]), i);
                }
                else if (state == 21 && ((this.code[i] == ":"))) {
                    state = 22;
                }
                else if (state == 16 && ((this.code[i] == " "))) {
                    state = 23;
                }
                else if (state == 16 && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[16], " => ").concat(sts[24], "; ").concat(sts[-1]), i);
                }
                else if (state == 16 && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = 25;
                }
                else if (state == 23 && (!(this.code[i] == " "))) {
                    state = 25;
                }
                else if (state == 25 && ((this.code[i] == " "))) {
                    state = 26;
                }
                else if (state == 26 && ((this.code[i] == ":"))) {
                    state = 27;
                }
                else if (state == 25 && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[25], " => ").concat(sts[24], "; ").concat(sts[-1]), i);
                }
                else if (state == 25 && ((this.code[i] == ":"))) {
                    state = 27;
                }
                else if (state == 26 && (!(this.code[i] == " ")) && (!(this.code[i] == ":"))) {
                    throw this.tokenizeerror("".concat(sts[26], " => ").concat(sts[24], "; ").concat(sts[-1]), i);
                }
                else if (state == 27 && ((this.code[i] == " "))) {
                    state = 28;
                }
                else if (state == 28 && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("".concat(sts[28], " => ").concat(sts[24], "; ").concat(sts[-1]), i);
                }
                else if (state == 28 && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = 29;
                }
                else if (state == 29 && ((this.code[i] == ";"))) {
                    state = 30;
                }
                else if (state == 30 && ((this.code[i] == " "))) {
                    state = 31;
                }
                else if (state == 30 && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[30], " => ").concat(sts[24], "; ").concat(sts[-1]), i);
                }
                else if (state == 31 && ((this.code[i] == "\n"))) {
                    state = 6;
                }
                else if (state == 30 && ((this.code[i] == "\n"))) {
                    state = 6;
                }
                else if (state == 31 && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("".concat(sts[31], " => ").concat(sts[24], "; ").concat(sts[-1]), i);
                }
            }
            if (state != 0) {
                console.log(i, this.code[i].replace(/\n/g, "\\n"), sts[state], state);
                if (tokenarr.length == 0 || state != tokenarr[tokenarr.length - 1].type) {
                    tokenarr.push({ type: state, val: this.code[i], i: i });
                }
                else {
                    tokenarr[tokenarr.length - 1].val += this.code[i];
                }
                //console.table(tokenarr)
                i++;
            }
        }
        console.table(tokenarr);
    };
    return NLPtool;
}());
if (!(typeof require != "undefined")) {
    var code_res = new NLPtool("./test4.nlp");
}
