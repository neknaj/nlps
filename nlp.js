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
    NLPtool.prototype.tokenizeerror = function (message) {
        // @ts-ignore
        var error = new Error(message, this.filename);
        error.name = "NLP_TokenizeError";
        // @ts-ignore
        error.lineNumber = 5;
        // @ts-ignore
        error.columnNumber = 10;
        return error;
    };
    NLPtool.prototype.tokenize = function () {
        var tokenarr = [];
        var blocknest = 0;
        var state = "toplevel";
        var i = 0;
        var nowtoken = "";
        while (i < this.code.length) {
            switch (state) {
                case "toplevel":
                    if (this.code[i] == "#") {
                        state = "import_dec";
                        nowtoken += this.code[i];
                        tokenarr.push({ type: "import_dec", val: nowtoken, index: i });
                        nowtoken = "";
                    }
                    if (this.code[i] == "!") {
                        state = "toplevel_dec";
                        nowtoken += this.code[i];
                        tokenarr.push({ type: "toplevel_dec", val: nowtoken, index: i });
                        nowtoken = "";
                    }
                    break;
                case "import_dec":
                    if (this.code[i] == " ") {
                        state = "import_blank";
                        tokenarr.push({ type: "import_type", val: nowtoken, index: i });
                        if (nowtoken != "include" && nowtoken != "using") {
                            throw this.tokenizeerror("\u30A4\u30F3\u30DD\u30FC\u30C8\u306E\u30BF\u30A4\u30D7\u306F\"include\"\u304B\"using\"\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059");
                        }
                        nowtoken = "";
                    }
                    else {
                        nowtoken += this.code[i];
                    }
                    break;
                case "import_blank":
                    if (this.code[i] != " ") {
                        i--;
                        state = "import_file";
                    }
                    break;
                case "import_file":
                    if (this.code[i] == ";") {
                        state = "import_semicolon";
                        tokenarr.push({ type: "import_file", val: nowtoken, index: i });
                        nowtoken = "";
                    }
                    else if (this.code[i] == "\n") {
                        throw this.tokenizeerror("\u6587\u306E\u4E2D\u306B\u6539\u884C\u3092\u542B\u3081\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093");
                    }
                    else if (this.code[i] == " ") {
                        throw this.tokenizeerror("\u30D5\u30A1\u30A4\u30EB\u540D\u306B\u7A7A\u767D\u3092\u542B\u3081\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093");
                    }
                    else {
                        nowtoken += this.code[i];
                    }
                    break;
                case "import_semicolon":
                    if (this.code[i] == "\n") {
                        state = "toplevel";
                    }
                    else if (this.code[i] == " ") {
                    }
                    else {
                        throw this.tokenizeerror("\u30A4\u30F3\u30DD\u30FC\u30C8\u306E\u30BB\u30DF\u30B3\u30ED\u30F3\u306E\u5F8C\u308D\u306F\u7A7A\u767D\u306E\u307F\u304C\u8A31\u3055\u308C\u307E\u3059");
                    }
                    break;
                case "toplevel_dec":
                    if (this.code[i] == " ") {
                        throw this.tokenizeerror("\u5BA3\u8A00\u306E\u76F4\u5F8C\u306F\u7A2E\u985E\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059");
                    }
                    else if (this.code[i] == ":") {
                        tokenarr.push({ type: "toplevel_dectype", val: nowtoken, index: i });
                        if (nowtoken == "global") {
                            state = "global_var_dectype";
                        }
                        else if (nowtoken == "fn") {
                            state = "fn_dec_rettype";
                        }
                        nowtoken = "";
                    }
                    else {
                        nowtoken += this.code[i];
                    }
            }
            i++;
        }
        console.dir(tokenarr);
    };
    return NLPtool;
}());
{
    var parsed = new NLPtool("./test4.nlp");
    console.log(parsed);
}
