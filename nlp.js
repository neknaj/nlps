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
        this.tokenizerstates = ["start", "split", "special", "comment.start", "string.start", "token", "comment.blockstart", "comment.linecomment", "comment.lineend", "comment.blockend", "comment.blockcomment", "comment.LF"];
        var sts = this.tokenizerstates;
        while (i < this.code.length) {
            {
                if (false) { }
                else if (state == 0 && (((tc[i] == " ")) || ((tc[i] == ":")) || ((tc[i] == ",")) || ((tc[i] == ",")) || ((tc[i] == ";")) || ((tc[i] == "\n")))) {
                    state = 1;
                }
                else if (state == 0 && (((tc[i] == "!")) || ((tc[i] == "(")) || ((tc[i] == ")")) || ((tc[i] == "{")) || ((tc[i] == "}")))) {
                    state = 2;
                }
                else if (state == 0 && (((tc[i] == "#")))) {
                    state = 3;
                }
                else if (state == 0 && (((tc[i] == "\"")))) {
                    state = 4;
                }
                else if (state == 0) {
                    state = 5;
                }
                else if (state == 1 && (((tc[i] == "!")) || ((tc[i] == "(")) || ((tc[i] == ")")) || ((tc[i] == "{")) || ((tc[i] == "}")))) {
                    state = 2;
                }
                else if (state == 1 && (((tc[i] == "#")))) {
                    state = 3;
                }
                else if (state == 1 && (((tc[i] == "\"")))) {
                    state = 4;
                }
                else if (state == 1) {
                    state = 5;
                }
                else if (state == 2 && (((tc[i] == " ")) || ((tc[i] == ":")) || ((tc[i] == ",")) || ((tc[i] == ",")) || ((tc[i] == ";")) || ((tc[i] == "\n")))) {
                    state = 1;
                }
                else if (state == 2 && (((tc[i] == "#")))) {
                    state = 3;
                }
                else if (state == 2 && (((tc[i] == "\"")))) {
                    state = 4;
                }
                else if (state == 2) {
                    state = 5;
                }
                else if (state == 3 && (((tc[i] == "*")))) {
                    state = 6;
                }
                else if (state == 3 && ((!(tc[i] == "*")))) {
                    state = 7;
                }
                else if (state == 7 && (((tc[i] == "\n")))) {
                    state = 8;
                }
                else if (state == 6 && (((tc[i] == "#")))) {
                    state = 9;
                }
                else if (state == 6 && ((!(tc[i] == "#")) && (!(tc[i] == "\n")))) {
                    state = 10;
                }
                else if (state == 6 && (((tc[i] == "\n")))) {
                    state = 11;
                }
                else if (state == 10 && (((tc[i] == "#")))) {
                    state = 9;
                }
                else if (state == 10 && (((tc[i] == "\n")))) {
                    state = 11;
                }
                else if (state == 11 && (((tc[i] == "#")))) {
                    state = 9;
                }
                else if (state == 11 && ((!(tc[i] == "#")) && (!(tc[i] == "\n")))) {
                    state = 10;
                }
                else if (state == 8 && (((tc[i] == " ")) || ((tc[i] == ":")) || ((tc[i] == ",")) || ((tc[i] == ",")) || ((tc[i] == ";")) || ((tc[i] == "\n")))) {
                    state = 1;
                }
                else if (state == 8 && (((tc[i] == "!")) || ((tc[i] == "(")) || ((tc[i] == ")")) || ((tc[i] == "{")) || ((tc[i] == "}")))) {
                    state = 2;
                }
                else if (state == 8 && (((tc[i] == "#")))) {
                    state = 3;
                }
                else if (state == 8 && (((tc[i] == "\"")))) {
                    state = 4;
                }
                else if (state == 8) {
                    state = 5;
                }
                else if (state == 9 && (((tc[i] == " ")) || ((tc[i] == ":")) || ((tc[i] == ",")) || ((tc[i] == ",")) || ((tc[i] == ";")) || ((tc[i] == "\n")))) {
                    state = 1;
                }
                else if (state == 9 && (((tc[i] == "!")) || ((tc[i] == "(")) || ((tc[i] == ")")) || ((tc[i] == "{")) || ((tc[i] == "}")))) {
                    state = 2;
                }
                else if (state == 9 && (((tc[i] == "#")))) {
                    state = 3;
                }
                else if (state == 9 && (((tc[i] == "\"")))) {
                    state = 4;
                }
                else if (state == 9) {
                    state = 5;
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
