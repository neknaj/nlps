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
        var tokenarr = [{ type: "SOF", val: "", i: 0 }];
        this.tokenarr = tokenarr;
        var state = "TopLevel";
        var i = 0;
        console.log(tokenarr);
        while (i < this.code.length) {
            {
                if (false) { }
                else if (state == "TopLevel" && ((this.code[i] == "#"))) {
                    state = "ImportStat.Sharp";
                }
                else if (state == "TopLevel" && ((this.code[i] == "!"))) {
                    state = "TopLevelDef.Exclam";
                }
                else if (state == "TopLevel" && ((this.code[i] == " "))) {
                    state = "TopLevel.Blank";
                }
                else if (state == "TopLevel" && ((this.code[i] == "\n"))) {
                    state = "TopLevel.EOL";
                }
                else if (state == "TopLevel" && (!(this.code[i] == "#")) && (!(this.code[i] == "!")) && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("TopLevel => Error; !sharp&!exclam&!space&!LF", i);
                }
                else if (state == "TopLevel.Blank" && ((this.code[i] == "\n"))) {
                    state = "TopLevel.EOL";
                }
                else if (state == "TopLevel.Blank" && ((this.code[i] == "#"))) {
                    state = "ImportStat.Sharp";
                }
                else if (state == "TopLevel.Blank" && ((this.code[i] == "!"))) {
                    state = "TopLevelDef.Exclam";
                }
                else if (state == "TopLevel.Blank" && (!(this.code[i] == "#")) && (!(this.code[i] == "!")) && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("TopLevel.Blank => Error; !sharp&!exclam&!space&!LF", i);
                }
                else if (state == "TopLevel.EOL" && ((this.code[i] == " "))) {
                    state = "TopLevel.Blank";
                }
                else if (state == "TopLevel.EOL" && ((this.code[i] == "#"))) {
                    state = "ImportStat.Sharp";
                }
                else if (state == "TopLevel.EOL" && ((this.code[i] == "!"))) {
                    state = "TopLevelDef.Exclam";
                }
                else if (state == "TopLevel.EOL" && (!(this.code[i] == "#")) && (!(this.code[i] == "!")) && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("TopLevel.EOL => Error; !sharp&!exclam&!space&!LF", i);
                }
                else if (state == "gVarDef.EOL") {
                    state = "TopLevel";
                }
                else if (state == "ImportStat.EOL") {
                    state = "TopLevel";
                }
                else if (state == "ImportStat.Sharp" && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("ImportStat.Sharp => ImportStat.Error; space", i);
                }
                else if (state == "ImportStat.Sharp" && (!(this.code[i] == " "))) {
                    state = "ImportStat.Declaration";
                }
                else if (state == "ImportStat.Declaration" && ((this.code[i] == " ")) && ((tokenarr[tokenarr.length - 1].val == "include" || tokenarr[tokenarr.length - 1].val == "using"))) {
                    state = "ImportStat.Blank";
                }
                else if (state == "ImportStat.Declaration" && ((this.code[i] == " ")) && (!(tokenarr[tokenarr.length - 1].val == "include" || tokenarr[tokenarr.length - 1].val == "using"))) {
                    throw this.tokenizeerror("ImportStat.Declaration => ImportStat.Error; space&!decl=(\"include\"|\"using\")", i);
                }
                else if (state == "ImportStat.Blank" && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("ImportStat.Blank => ImportStat.Error; semicolon", i);
                }
                else if (state == "ImportStat.Blank" && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = "ImportStat.Filename";
                }
                else if (state == "ImportStat.Filename" && (!(this.code[i] == " ")) && ((this.code[i] == ";"))) {
                    state = "ImportStat.EOStat";
                }
                else if (state == "ImportStat.Filename" && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("ImportStat.Filename => ImportStat.Error; space", i);
                }
                else if (state == "ImportStat.EOStat" && ((this.code[i] == " "))) {
                    state = "ImportStat.AfterBlank";
                }
                else if (state == "ImportStat.EOStat" && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("ImportStat.EOStat => ImportStat.Error; !space&!LF", i);
                }
                else if (state == "ImportStat.AfterBlank" && ((this.code[i] == "\n"))) {
                    state = "ImportStat.EOL";
                }
                else if (state == "ImportStat.EOStat" && ((this.code[i] == "\n"))) {
                    state = "ImportStat.EOL";
                }
                else if (state == "ImportStat.AfterBlank" && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("ImportStat.AfterBlank => ImportStat.Error; !space&!LF", i);
                }
                else if (state == "TopLevelDef.Exclam" && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("TopLevelDef.Exclam => TopLevelDef.Error; space", i);
                }
                else if (state == "TopLevelDef.Exclam" && (!(this.code[i] == " "))) {
                    state = "TopLevelDef.Declaration";
                }
                else if (state == "TopLevelDef.Declaration" && ((this.code[i] == " "))) {
                    throw this.tokenizeerror("TopLevelDef.Declaration => TopLevelDef.Error; space", i);
                }
                else if (state == "TopLevelDef.Declaration" && ((this.code[i] == ":")) && (!(tokenarr[tokenarr.length - 1].val == "fn" || tokenarr[tokenarr.length - 1].val == "global"))) {
                    throw this.tokenizeerror("TopLevelDef.Declaration => TopLevelDef.Error; colon&!decl=(\"fn\"|\"global\")", i);
                }
                else if (state == "TopLevelDef.Declaration" && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("TopLevelDef.Declaration => TopLevelDef.Error; semicolon", i);
                }
                else if (state == "TopLevelDef.Declaration" && ((this.code[i] == ":")) && ((tokenarr[tokenarr.length - 1].val == "global"))) {
                    state = "gVarDef.Colon1";
                }
                else if (state == "TopLevelDef.Declaration" && ((this.code[i] == ":")) && ((tokenarr[tokenarr.length - 1].val == "fn"))) {
                    state = "FunctionDef.Colon1";
                }
                else if (state == "FunctionDef.Colon1" && ((this.code[i] == " "))) {
                    state = "FunctionDef.Blank1";
                }
                else if (state == "FunctionDef.Colon1" && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("FunctionDef.Colon1 => FunctionDef.Error; semicolon", i);
                }
                else if (state == "FunctionDef.Colon1" && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = "FunctionDef.RetType";
                }
                else if (state == "FunctionDef.Blank1" && (!(this.code[i] == " "))) {
                    state = "FunctionDef.RetType";
                }
                else if (state == "FunctionDef.RetType" && ((this.code[i] == " "))) {
                    state = "FunctionDef.Blank2";
                }
                else if (state == "FunctionDef.Blank2" && (!(this.code[i] == " ")) && (!(this.code[i] == ":"))) {
                    throw this.tokenizeerror("FunctionDef.Blank2 => FunctionDef.Error; !space&!colon", i);
                }
                else if (state == "FunctionDef.Blank2" && ((this.code[i] == ":"))) {
                    state = "FunctionDef.Colon2";
                }
                else if (state == "gVarDef.Colon1" && ((this.code[i] == " "))) {
                    state = "gVarDef.Blank1";
                }
                else if (state == "gVarDef.Colon1" && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("gVarDef.Colon1 => gVarDef.Error; semicolon", i);
                }
                else if (state == "gVarDef.Colon1" && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = "gVarDef.gVarType";
                }
                else if (state == "gVarDef.Blank1" && (!(this.code[i] == " "))) {
                    state = "gVarDef.gVarType";
                }
                else if (state == "gVarDef.gVarType" && ((this.code[i] == " "))) {
                    state = "gVarDef.Blank2";
                }
                else if (state == "gVarDef.Blank2" && ((this.code[i] == ":"))) {
                    state = "gVarDef.Colon2";
                }
                else if (state == "gVarDef.gVarType" && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("gVarDef.gVarType => gVarDef.Error; semicolon", i);
                }
                else if (state == "gVarDef.gVarType" && ((this.code[i] == ":"))) {
                    state = "gVarDef.Colon2";
                }
                else if (state == "gVarDef.Blank2" && (!(this.code[i] == " ")) && (!(this.code[i] == ":"))) {
                    throw this.tokenizeerror("gVarDef.Blank2 => gVarDef.Error; !space&!colon", i);
                }
                else if (state == "gVarDef.Colon2" && ((this.code[i] == " "))) {
                    state = "gVarDef.Blank3";
                }
                else if (state == "gVarDef.Blank3" && ((this.code[i] == ";"))) {
                    throw this.tokenizeerror("gVarDef.Blank3 => gVarDef.Error; semicolon", i);
                }
                else if (state == "gVarDef.Blank3" && (!(this.code[i] == " ")) && (!(this.code[i] == ";"))) {
                    state = "gVarDef.Name";
                }
                else if (state == "gVarDef.Name" && ((this.code[i] == ";"))) {
                    state = "gVarDef.EOStat";
                }
                else if (state == "gVarDef.EOStat" && ((this.code[i] == " "))) {
                    state = "gVarDef.AfterBlank";
                }
                else if (state == "gVarDef.EOStat" && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("gVarDef.EOStat => gVarDef.Error; !space&!LF", i);
                }
                else if (state == "gVarDef.AfterBlank" && ((this.code[i] == "\n"))) {
                    state = "gVarDef.EOL";
                }
                else if (state == "gVarDef.EOStat" && ((this.code[i] == "\n"))) {
                    state = "gVarDef.EOL";
                }
                else if (state == "gVarDef.AfterBlank" && (!(this.code[i] == " ")) && (!(this.code[i] == "\n"))) {
                    throw this.tokenizeerror("gVarDef.AfterBlank => gVarDef.Error; !space&!LF", i);
                }
            }
            if (state != "TopLevel") {
                console.log(i, this.code[i].replace(/\n/g, "\\n"), state);
                if (state != tokenarr[tokenarr.length - 1].type) {
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
