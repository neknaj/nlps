var NLPtool = (function () {
    function NLPtool(filename) {
        this.filename = filename;
        {
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
    }
    NLPtool.prototype.tokenizeerror = function (message, i) {
        var error = new Error(message, this.filename);
        error.name = "NLP_TokenizeError";
        var LineAndCol = this.getLineAndCol(i);
        error.lineNumber = LineAndCol.line;
        error.columnNumber = LineAndCol.col;
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
        this.tokengroup = {
            "start": "null",
            "LF": "LF",
            "comment.LF": "LF",
            "blank": "blank",
            "split": "split",
            "string.space": "string",
            "lassign": "assign",
            "rassign": "assign",
            "special": "special",
            "comment.start": "comment",
            "string.start": "string",
            "token": "token",
            "comment.notestart": "comment",
            "comment.blockstart": "comment",
            "comment.linecomment": "comment",
            "comment.notebeforeblank": "comment",
            "comment.note": "note",
            "comment.blockend1": "comment",
            "comment.blockend": "comment",
            "comment.blockcomment": "comment",
            "string.escape1": "string",
            "string.end": "string",
            "string.char": "string",
            "string.escape2": "string",
            "lassign_": "assign",
            "rassign_": "assign",
        };
        this.tokenizerstates = ["start", "LF", "comment.LF", "blank", "split", "special", "lassign", "comment.start", "string.start", "token", "comment.notestart", "comment.blockstart", "comment.linecomment", "comment.notebeforeblank", "comment.note", "comment.blockend1", "comment.blockcomment", "comment.blockend", "string.escape1", "string.end", "string.space", "string.char", "string.escape2", "lassign_"];
        var sts = this.tokenizerstates;
        while (i < this.code.length) {
            switch (state) {
                case 0:
                    if ((tc[i] == ":") && (tc[i + 1] == ">"))
                        state = 6;
                    else if ((tc[i] == " "))
                        state = 3;
                    else if ((tc[i] == ":") || (tc[i] == ",") || (tc[i] == ";"))
                        state = 4;
                    else if ((tc[i] == "!") || (tc[i] == "(") || (tc[i] == ")") || (tc[i] == "{") || (tc[i] == "}"))
                        state = 5;
                    else if ((tc[i] == "#"))
                        state = 7;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\""))
                        state = 8;
                    else
                        state = 9;
                    break;
                case 7:
                    if ((tc[i] == ":"))
                        state = 10;
                    else if ((tc[i] == "*"))
                        state = 11;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    else
                        state = 12;
                    break;
                case 10:
                    if ((tc[i] == " "))
                        state = 13;
                    else if ((tc[i] != "\n"))
                        state = 14;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 13:
                    if ((tc[i] != "\n"))
                        state = 14;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 14:
                    if ((tc[i] != "\n"))
                        state = 14;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 12:
                    if ((tc[i] != "\n"))
                        state = 12;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 11:
                    if ((tc[i] == "*") && (tc[i + 1] == "#"))
                        state = 15;
                    else if ((tc[i] != "#") && (tc[i] != "\n"))
                        state = 16;
                    else if ((tc[i] == "\n"))
                        state = 2;
                    break;
                case 16:
                    if ((tc[i] == "*") && (tc[i + 1] == "#"))
                        state = 15;
                    else if ((tc[i] != "#") && (tc[i] != "\n"))
                        state = 16;
                    else if ((tc[i] == "\n"))
                        state = 2;
                    break;
                case 2:
                    if ((tc[i] == "*") && (tc[i + 1] == "#"))
                        state = 15;
                    else if ((tc[i] != "#") && (tc[i] != "\n"))
                        state = 16;
                    else if ((tc[i] == "\n"))
                        state = 2;
                    break;
                case 15:
                    state = 17;
                    break;
                case 8:
                    if ((tc[i] == "\\"))
                        state = 18;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\""))
                        state = 19;
                    else if ((tc[i] == " "))
                        state = 20;
                    else
                        state = 21;
                    break;
                case 21:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\\"))
                        state = 18;
                    else if ((tc[i] == "\""))
                        state = 19;
                    else if ((tc[i] == " "))
                        state = 20;
                    else
                        state = 21;
                    break;
                case 20:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\\"))
                        state = 18;
                    else if ((tc[i] == "\""))
                        state = 19;
                    else if ((tc[i] == " "))
                        state = 20;
                    else
                        state = 21;
                    break;
                case 18:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else
                        state = 22;
                    break;
                case 22:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\""))
                        state = 19;
                    else if ((tc[i] == "\\"))
                        state = 18;
                    else if ((tc[i] == " "))
                        state = 20;
                    else
                        state = 21;
                    break;
                case 6:
                    state = 23;
                    break;
                case 3:
                    state = 0;
                    break;
                case 4:
                    state = 0;
                    break;
                case 5:
                    state = 0;
                    break;
                case 9:
                    state = 0;
                    break;
                case 1:
                    state = 0;
                    break;
                case 17:
                    state = 0;
                    break;
                case 19:
                    state = 0;
                    break;
                case 23:
                    state = 0;
            }
            if (state != 0) {
                var LineAndCol = this.getLineAndCol(i);
                if (tar.length == 0 || state != tar[tar.length - 1].ttype || state == 1 || state == 2 || state == 3 || state == 4 || state == 5) {
                    tar.push({ ttype: state, ptype: null, ttype_str: sts[state], ptype_str: null, val: this.code[i], i: i, line: LineAndCol.line, col: LineAndCol.col, group: this.tokengroup[sts[state]] });
                }
                else {
                    tar[tar.length - 1].val += this.code[i];
                }
                i++;
            }
        }
        console.table(tar);
        return this;
    };
    NLPtool.prototype.parse = function () {
        var state = 1;
        var i = 0;
        var tar = this.tokenarr;
        this.parserstates = ["Error", "TL.root", "Block.root", "TLdef.exclam", "TL.comment", "TL.blank", "TL.LF", "TL.note", "TLdef.include", "TLdef.using", "TLdef.replace", "TLdef.global", "TLdef.func", "TLdef.include.colon1", "TLdef.include.blank1", "TLdef.include.filename", "TLdef.include.EOS", "TLdef.using.colon1", "TLdef.using.blank1", "TLdef.using.filename", "TLdef.using.EOS", "TLdef.replace.colon1", "TLdef.replace.blank1", "TLdef.replace.defname", "TLdef.replace.colon2", "TLdef.replace.blank2", "TLdef.replace.defval", "TLdef.replace.EOS", "TLdef.global.colon1", "TLdef.global.blank1", "TLdef.global.deftype", "TLdef.global.colon2", "TLdef.global.blank2", "TLdef.global.defname", "TLdef.global.EOS", "TLdef.func.colon1", "TLdef.func.blank1", "TLdef.func.rettype", "TLdef.func.blank2", "TLdef.func.lparen", "TLdef.func.args.blank1", "TLdef.func.args.argstype", "TLdef.func.rparen", "TLdef.func.args.colon", "TLdef.func.args.blank2", "TLdef.func.args.defname", "TLdef.func.args.blank3", "TLdef.func.args.comma", "TLdef.func.colon2", "TLdef.func.blank3", "TLdef.func.defname", "TLdef.func.blank4", "TLdef.func.lbracket", "Block.exclam", "Block.comment", "Block.blank", "Block.LF", "Block.stat.expr.token", "Block.note", "Block.stat.expr.blank", "Block.stat.assign", "Block.stat.assign_"];
        var sts = this.parserstates;
        while (i < tar.length) {
            var state_copy = state;
            state = 0;
            switch (state_copy) {
                case 1:
                    if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 3;
                    else if ((tar[i].group == "comment"))
                        state = 4;
                    else if ((tar[i].group == "blank"))
                        state = 5;
                    else if ((tar[i].group == "LF"))
                        state = 6;
                    break;
                case 4:
                    if ((tar[i].group == "note"))
                        state = 7;
                    else
                        state = 1;
                    break;
                case 7:
                    state = 1;
                    break;
                case 5:
                    state = 1;
                    break;
                case 6:
                    state = 1;
                    break;
                case 3:
                    if ((tar[i].group == "token") && (tar[i].val == "include"))
                        state = 8;
                    else if ((tar[i].group == "token") && (tar[i].val == "using"))
                        state = 9;
                    else if ((tar[i].group == "token") && (tar[i].val == "replace"))
                        state = 10;
                    else if ((tar[i].group == "token") && (tar[i].val == "global"))
                        state = 11;
                    else if ((tar[i].group == "token") && (tar[i].val == "fn"))
                        state = 12;
                    break;
                case 8:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 13;
                    break;
                case 13:
                    if ((tar[i].group == "blank"))
                        state = 14;
                    else if ((tar[i].group == "token"))
                        state = 15;
                    break;
                case 14:
                    if ((tar[i].group == "blank"))
                        state = 14;
                    else if ((tar[i].group == "token"))
                        state = 15;
                    break;
                case 15:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 16;
                    break;
                case 16:
                    state = 1;
                    break;
                case 9:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 17;
                    break;
                case 17:
                    if ((tar[i].group == "blank"))
                        state = 18;
                    else if ((tar[i].group == "token"))
                        state = 19;
                    break;
                case 18:
                    if ((tar[i].group == "blank"))
                        state = 18;
                    else if ((tar[i].group == "token"))
                        state = 19;
                    break;
                case 19:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 20;
                    break;
                case 20:
                    state = 1;
                    break;
                case 10:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 21;
                    break;
                case 21:
                    if ((tar[i].group == "blank"))
                        state = 22;
                    else if ((tar[i].group == "token"))
                        state = 23;
                    break;
                case 22:
                    if ((tar[i].group == "blank"))
                        state = 22;
                    else if ((tar[i].group == "token"))
                        state = 23;
                    break;
                case 23:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 24;
                    break;
                case 24:
                    if ((tar[i].group == "blank"))
                        state = 25;
                    else if ((tar[i].group == "token"))
                        state = 26;
                    break;
                case 25:
                    if ((tar[i].group == "blank"))
                        state = 25;
                    else if ((tar[i].group == "token"))
                        state = 26;
                    break;
                case 26:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 27;
                    break;
                case 27:
                    state = 1;
                    break;
                case 11:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 28;
                    break;
                case 28:
                    if ((tar[i].group == "blank"))
                        state = 29;
                    else if ((tar[i].group == "token"))
                        state = 30;
                    break;
                case 29:
                    if ((tar[i].group == "blank"))
                        state = 29;
                    else if ((tar[i].group == "token"))
                        state = 30;
                    break;
                case 30:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 31;
                    break;
                case 31:
                    if ((tar[i].group == "blank"))
                        state = 32;
                    else if ((tar[i].group == "token"))
                        state = 33;
                    break;
                case 32:
                    if ((tar[i].group == "blank"))
                        state = 32;
                    else if ((tar[i].group == "token"))
                        state = 33;
                    break;
                case 33:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 34;
                    break;
                case 34:
                    state = 1;
                    break;
                case 12:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 35;
                    break;
                case 35:
                    if ((tar[i].group == "blank"))
                        state = 36;
                    else if ((tar[i].group == "token"))
                        state = 37;
                    break;
                case 36:
                    if ((tar[i].group == "blank"))
                        state = 36;
                    else if ((tar[i].group == "token"))
                        state = 37;
                    break;
                case 37:
                    if ((tar[i].group == "blank"))
                        state = 38;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 39;
                    break;
                case 38:
                    if ((tar[i].group == "blank"))
                        state = 38;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 39;
                    break;
                case 39:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "token"))
                        state = 41;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 42;
                    break;
                case 40:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "token"))
                        state = 41;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 42;
                    break;
                case 41:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 43;
                    break;
                case 43:
                    if ((tar[i].group == "blank"))
                        state = 44;
                    else if ((tar[i].group == "token"))
                        state = 45;
                    break;
                case 44:
                    if ((tar[i].group == "blank"))
                        state = 44;
                    else if ((tar[i].group == "token"))
                        state = 45;
                    break;
                case 45:
                    if ((tar[i].group == "blank"))
                        state = 46;
                    else if ((tar[i].group == "split") && (tar[i].val == ","))
                        state = 47;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 42;
                    break;
                case 46:
                    if ((tar[i].group == "blank"))
                        state = 46;
                    else if ((tar[i].group == "split") && (tar[i].val == ","))
                        state = 47;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 42;
                    break;
                case 47:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "token"))
                        state = 41;
                    break;
                case 42:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 48;
                    break;
                case 48:
                    if ((tar[i].group == "blank"))
                        state = 49;
                    else if ((tar[i].group == "token"))
                        state = 50;
                    break;
                case 49:
                    if ((tar[i].group == "blank"))
                        state = 49;
                    else if ((tar[i].group == "token"))
                        state = 50;
                    break;
                case 50:
                    if ((tar[i].group == "blank"))
                        state = 51;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 52;
                    break;
                case 51:
                    if ((tar[i].group == "blank"))
                        state = 51;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 52;
                    break;
                case 52:
                    state = 2;
                    break;
                case 2:
                    if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 53;
                    else if ((tar[i].group == "comment"))
                        state = 54;
                    else if ((tar[i].group == "blank"))
                        state = 55;
                    else if ((tar[i].group == "LF"))
                        state = 56;
                    else if ((tar[i].group == "token"))
                        state = 57;
                    break;
                case 54:
                    if ((tar[i].group == "note"))
                        state = 58;
                    else
                        state = 2;
                    break;
                case 58:
                    state = 2;
                    break;
                case 55:
                    state = 2;
                    break;
                case 56:
                    state = 2;
                    break;
                case 57:
                    if ((tar[i].group == "blank"))
                        state = 59;
                    break;
                case 59:
                    if ((tar[i].group == "token"))
                        state = 57;
                    else if ((tar[i].group == "assign") && (tar[i].val == ":"))
                        state = 60;
                    break;
                case 60:
                    if ((tar[i].group == "assign") && (tar[i].val == ">"))
                        state = 61;
            }
            if (state == 0) {
                throw JSON.stringify({ val: tar[i].val, state: state, state_before: state_copy, state_str: sts[state], group: tar[i].group, ttype_str: tar[i].ttype_str, i: tar[i].i });
            }
            if (!(state == 1 || state == 2)) {
                tar[i].ptype = state;
                tar[i].ptype_str = sts[state];
                console.log({ val: tar[i].val, state: state, state_str: sts[state], group: tar[i].group, ttype_str: tar[i].ttype_str, i: tar[i].i });
                i++;
            }
        }
        return this;
    };
    return NLPtool;
}());
if ((typeof require != "undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
    code_res.parse();
}
