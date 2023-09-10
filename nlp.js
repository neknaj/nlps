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
        var tokenarr = [{ type: "SOF", val: "" }];
        var state = "TopLevel";
        var i = 0;
        console.log(tokenarr);
        while (i < this.code.length) {
            switch (state) {
                case "TopLevel":
                    if (this.code[i] == "#") {
                        state = "ImportStat";
                    }
                    if (this.code[i] == "!") {
                        state = "toplevel_dec";
                    }
                    break;
                case "ImportStat":
                    if (this.code[i] == " ") {
                        throw this.tokenizeerror("\u30A4\u30F3\u30DD\u30FC\u30C8\u5BA3\u8A00\u306E\"!\"\u306E\u76F4\u5F8C\u306B\u7A7A\u767D\u3092\u7F6E\u304F\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093", i);
                    }
                    else {
                        state = "ImportStat.Declaration";
                    }
                    break;
                case "ImportStat.Declaration":
                    if (this.code[i] == " ") {
                        state = "ImportStat.Blank";
                    }
                    // @ts-ignore
                    else if (tokenarr[tokenarr.length - 1].val == "include" || tokenarr[tokenarr.length - 1].val == "using") {
                        throw this.tokenizeerror("\u30A4\u30F3\u30DD\u30FC\u30C8\u306E\u30BF\u30A4\u30D7\u306F\"include\"\u304B\"using\"\u306E\u307F\u3067\u3059", i);
                    }
                    break;
                case "ImportStat.Blank":
                    if (this.code[i] != " ") {
                        state = "ImportStat.Filename";
                    }
                    break;
                case "ImportStat.Filename":
                    if (this.code[i] == " ") {
                        throw this.tokenizeerror("\u30A4\u30F3\u30DD\u30FC\u30C8\u3059\u308B\u30D5\u30A1\u30A4\u30EB\u306E\u540D\u524D\u306B\u7A7A\u767D\u306F\u4F7F\u3048\u307E\u305B\u3093", i);
                    }
                    else if (this.code[i] == ";") {
                        state = "ImportStat.EOStat";
                    }
                    break;
                case "ImportStat.EOStat":
                    if (this.code[i] == " ") {
                        state = "ImportStat.AfterBlank";
                    }
                    else if (this.code[i] == "\n") {
                        state = "ImportStat.EOL";
                    }
                    break;
                case "ImportStat.AfterBlank":
                    if (this.code[i] == " ") {
                    }
                    else if (this.code[i] == "\n") {
                        state = "ImportStat.EOL";
                    }
                    else {
                        throw this.tokenizeerror("\u30A4\u30F3\u30DD\u30FC\u30C8\u6587\u306E\u5F8C\u308D\u306B\u306F\u7A7A\u767D\u4EE5\u5916\u306F\u8A31\u3055\u308C\u307E\u305B\u3093", i);
                    }
                    break;
                case "ImportStat.EOL":
                    state = "TopLevel";
                    i--;
                    break;
            }
            if (state != "TopLevel") {
                console.log(i, this.code[i].replace(/\n/g, "\\n"), state);
                // @ts-ignore
                if (state != tokenarr[tokenarr.length - 1].type) {
                    tokenarr.push({ type: state, val: this.code[i], i: i });
                }
                else {
                    // @ts-ignore
                    tokenarr[tokenarr.length - 1].val += this.code[i];
                }
                //console.table(tokenarr)
            }
            i++;
        }
    };
    return NLPtool;
}());
{
    var parsed = new NLPtool("http://127.0.0.1:5500/test4.nlp");
    console.log(parsed);
}
