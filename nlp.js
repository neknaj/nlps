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
        var tar_ = [];
        this.tokenarr = tar_;
        var state = 0;
        var i = 0;
        var tc = this.code;
        console.log(tar);
        this.tokenizerstates = ["split", "token"];
        var sts = this.tokenizerstates;
        var split_str = {
            " ": "space",
            ":": "colon",
            ".": "dot",
            ";": "semicolon",
            "\n": "LF",
        };
        while (i < this.code.length) {
            if (Object.keys(split_str).indexOf(tc[i]) != -1) {
                tar.push({ type: 0, type_str: split_str[this.code[i]], val: this.code[i], i: i });
            }
            else if (tc[i] == "\"") {
                tar.push({ type: 2, type_str: "quot", val: this.code[i], i: i });
            }
            else if (tc[i] == "#") {
                tar.push({ type: 2, type_str: "sharp", val: this.code[i], i: i });
            }
            else if (tc[i] == "!") {
                tar.push({ type: 2, type_str: "exclam", val: this.code[i], i: i });
            }
            else if (tc[i] == ">") {
                tar.push({ type: 2, type_str: "LT", val: this.code[i], i: i });
            }
            else if (tc[i] == "(") {
                tar.push({ type: 2, type_str: "lparen", val: this.code[i], i: i });
            }
            else if (tc[i] == ")") {
                tar.push({ type: 2, type_str: "rparen", val: this.code[i], i: i });
            }
            else if (tc[i] == "{") {
                tar.push({ type: 2, type_str: "lbracket", val: this.code[i], i: i });
            }
            else if (tc[i] == "}") {
                tar.push({ type: 2, type_str: "rbracket", val: this.code[i], i: i });
            }
            else {
                tar.push({ type: 1, type_str: "token", val: this.code[i], i: i });
            }
            i++;
        }
        var bft = 0;
        var tokenval = "";
        for (var _i = 0, tar_1 = tar; _i < tar_1.length; _i++) {
            var t = tar_1[_i];
            if (t.type == 1) {
                tokenval += t.val;
            }
            else if (bft == 1) {
                tar_.push({ type: 1, type_str: "token", val: tokenval, i: i });
                tokenval = "";
                tar_.push({ type: 0, type_str: t.type_str, val: t.val, i: t.i });
            }
            else {
                tar_.push({ type: 0, type_str: t.type_str, val: t.val, i: t.i });
            }
            // @ts-ignore
            bft = t.type;
        }
        console.table(tar);
        console.table(tar_);
        return this;
    };
    return NLPtool;
}());
if (typeof require != "undefined") {
    var code_res = new NLPtool("./test4.nlp").tokenize();
}
