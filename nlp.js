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
        this.tokenizerstates = ["start", "LF", "comment.LF", "blank", "split", "special", "lassign_", "string.start", "string.end", "lassign", "comment.start", "token", "comment.notestart", "comment.blockstart", "comment.linecomment", "comment.notebeforeblank", "comment.note", "comment.blockend1", "comment.blockcomment", "comment.blockend", "string.escape1", "string.space", "string.char", "string.escape2"];
        var sts = this.tokenizerstates;
        while (i < this.code.length) {
            switch (state) {
                case 0:
                    if ((tc[i] == ":") && (tc[i + 1] == ">"))
                        state = 9;
                    else if ((tc[i] == " "))
                        state = 3;
                    else if ((tc[i] == ":") || (tc[i] == ",") || (tc[i] == ";"))
                        state = 4;
                    else if ((tc[i] == "!") || (tc[i] == "(") || (tc[i] == ")") || (tc[i] == "{") || (tc[i] == "}"))
                        state = 5;
                    else if ((tc[i] == "#"))
                        state = 10;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\""))
                        state = 7;
                    else
                        state = 11;
                    break;
                case 10:
                    if ((tc[i] == ":"))
                        state = 12;
                    else if ((tc[i] == "*"))
                        state = 13;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    else
                        state = 14;
                    break;
                case 12:
                    if ((tc[i] == " "))
                        state = 15;
                    else if ((tc[i] != "\n"))
                        state = 16;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 15:
                    if ((tc[i] != "\n"))
                        state = 16;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 16:
                    if ((tc[i] != "\n"))
                        state = 16;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 14:
                    if ((tc[i] != "\n"))
                        state = 14;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    break;
                case 13:
                    if ((tc[i] == "*") && (tc[i + 1] == "#"))
                        state = 17;
                    else if ((tc[i] != "#") && (tc[i] != "\n"))
                        state = 18;
                    else if ((tc[i] == "\n"))
                        state = 2;
                    break;
                case 18:
                    if ((tc[i] == "*") && (tc[i + 1] == "#"))
                        state = 17;
                    else if ((tc[i] != "#") && (tc[i] != "\n"))
                        state = 18;
                    else if ((tc[i] == "\n"))
                        state = 2;
                    break;
                case 2:
                    if ((tc[i] == "*") && (tc[i + 1] == "#"))
                        state = 17;
                    else if ((tc[i] != "#") && (tc[i] != "\n"))
                        state = 18;
                    else if ((tc[i] == "\n"))
                        state = 2;
                    break;
                case 17:
                    state = 19;
                    break;
                case 7:
                    if ((tc[i] == "\\"))
                        state = 20;
                    else if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\""))
                        state = 8;
                    else if ((tc[i] == " "))
                        state = 21;
                    else
                        state = 22;
                    break;
                case 22:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\\"))
                        state = 20;
                    else if ((tc[i] == "\""))
                        state = 8;
                    else if ((tc[i] == " "))
                        state = 21;
                    else
                        state = 22;
                    break;
                case 21:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\\"))
                        state = 20;
                    else if ((tc[i] == "\""))
                        state = 8;
                    else if ((tc[i] == " "))
                        state = 21;
                    else
                        state = 22;
                    break;
                case 20:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else
                        state = 23;
                    break;
                case 23:
                    if ((tc[i] == "\n"))
                        state = 1;
                    else if ((tc[i] == "\""))
                        state = 8;
                    else if ((tc[i] == "\\"))
                        state = 20;
                    else if ((tc[i] == " "))
                        state = 21;
                    else
                        state = 22;
                    break;
                case 9:
                    state = 6;
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
                case 11:
                    state = 0;
                    break;
                case 1:
                    state = 0;
                    break;
                case 19:
                    state = 0;
                    break;
                case 8:
                    state = 0;
                    break;
                case 6:
                    state = 0;
            }
            if (state != 0) {
                var LineAndCol = this.getLineAndCol(i);
                if ((tar.length == 0 || state != tar[tar.length - 1].ttype || state == 1 || state == 2 || state == 3 || state == 4 || state == 5) && state != 6) {
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
        var depth = 0;
        var tar = this.tokenarr;
        this.parserstates = ["Error", "TL.root", "Block.root", "Block.entry", "Block.exit", "TLdef.exclam", "TL.comment", "TL.blank", "TL.LF", "TL.note", "TLdef.include", "TLdef.using", "TLdef.replace", "TLdef.global", "TLdef.func", "TLdef.include.colon1", "TLdef.include.blank1", "TLdef.include.filename", "TLdef.include.EOS", "TLdef.using.colon1", "TLdef.using.blank1", "TLdef.using.filename", "TLdef.using.EOS", "TLdef.replace.colon1", "TLdef.replace.blank1", "TLdef.replace.defname", "TLdef.replace.colon2", "TLdef.replace.blank2", "TLdef.replace.defval", "TLdef.replace.EOS", "TLdef.global.colon1", "TLdef.global.blank1", "TLdef.global.deftype", "TLdef.global.colon2", "TLdef.global.blank2", "TLdef.global.defname", "TLdef.global.EOS", "TLdef.func.colon1", "TLdef.func.blank1", "TLdef.func.rettype", "TLdef.func.blank2", "TLdef.func.lparen", "TLdef.func.args.blank1", "TLdef.func.args.argstype", "TLdef.func.rparen", "TLdef.func.args.colon", "TLdef.func.args.blank2", "TLdef.func.args.defname", "TLdef.func.args.blank3", "TLdef.func.args.comma", "TLdef.func.colon2", "TLdef.func.blank3", "TLdef.func.defname", "TLdef.func.blank4", "TLdef.func.lbracket", "Block.exclam.decl", "Block.comment", "Block.blank", "Block.LF", "Block.stat.expr.token", "Block.note", "Block.exclam.local", "Block.exclam.ctrl", "Block.exclam.local.colon1", "Block.exclam.local.deftype", "Block.exclam.local.blank1", "Block.exclam.local.colon2", "Block.exclam.local.blank2", "Block.exclam.local.defname", "Block.exclam.local.end", "Block.exclam.ctrl.colon1", "Block.exclam.ctrl.blank1", "Block.exclam.ctrl.lparen", "Block.exclam.ctrl.cond.blank", "Block.exclam.ctrl.cond.token", "Block.exclam.ctrl.rparen", "Block.exclam.ctrl.blank2", "Block.exclam.ctrl.type.if", "Block.exclam.ctrl.type.while", "Block.exclam.ctrl.blank3", "Block.exclam.lbracket", "Block.stat.expr.blank", "Block.stat.end", "Block.stat.assign", "Block.stat.blank1", "Block.stat.assignvar", "Block.stat.exclam.decl", "Block.stat.exclam.local", "Block.stat.exclam.local.colon1", "Block.stat.exclam.local.blank1", "Block.stat.exclam.local.deftype", "Block.stat.exclam.local.colon2", "Block.stat.exclam.local.blank2", "Block.stat.exclam.local.defname", "Block.stat.exclam.local.end"];
        var sts = this.parserstates;
        while (i < tar.length) {
            var state_copy = state;
            state = 0;
            switch (state_copy) {
                case 1:
                    if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 5;
                    else if ((tar[i].group == "comment"))
                        state = 6;
                    else if ((tar[i].group == "blank"))
                        state = 7;
                    else if ((tar[i].group == "LF"))
                        state = 8;
                    break;
                case 6:
                    if ((tar[i].group == "note"))
                        state = 9;
                    else
                        state = 1;
                    break;
                case 9:
                    state = 1;
                    break;
                case 7:
                    state = 1;
                    break;
                case 8:
                    state = 1;
                    break;
                case 5:
                    if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "include"))
                        state = 10;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "using"))
                        state = 11;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "replace"))
                        state = 12;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "global"))
                        state = 13;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "fn"))
                        state = 14;
                    break;
                case 10:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 15;
                    break;
                case 15:
                    if ((tar[i].group == "blank"))
                        state = 16;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 17;
                    break;
                case 16:
                    if ((tar[i].group == "blank"))
                        state = 16;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 17;
                    break;
                case 17:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 18;
                    break;
                case 18:
                    state = 1;
                    break;
                case 11:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 19;
                    break;
                case 19:
                    if ((tar[i].group == "blank"))
                        state = 20;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 21;
                    break;
                case 20:
                    if ((tar[i].group == "blank"))
                        state = 20;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 21;
                    break;
                case 21:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 22;
                    break;
                case 22:
                    state = 1;
                    break;
                case 12:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 23;
                    break;
                case 23:
                    if ((tar[i].group == "blank"))
                        state = 24;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 25;
                    break;
                case 24:
                    if ((tar[i].group == "blank"))
                        state = 24;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 25;
                    break;
                case 25:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 26;
                    break;
                case 26:
                    if ((tar[i].group == "blank"))
                        state = 27;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 28;
                    break;
                case 27:
                    if ((tar[i].group == "blank"))
                        state = 27;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 28;
                    break;
                case 28:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 29;
                    break;
                case 29:
                    state = 1;
                    break;
                case 13:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 30;
                    break;
                case 30:
                    if ((tar[i].group == "blank"))
                        state = 31;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 32;
                    break;
                case 31:
                    if ((tar[i].group == "blank"))
                        state = 31;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 32;
                    break;
                case 32:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 33;
                    break;
                case 33:
                    if ((tar[i].group == "blank"))
                        state = 34;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 35;
                    break;
                case 34:
                    if ((tar[i].group == "blank"))
                        state = 34;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 35;
                    break;
                case 35:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 36;
                    break;
                case 36:
                    state = 1;
                    break;
                case 14:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 37;
                    break;
                case 37:
                    if ((tar[i].group == "blank"))
                        state = 38;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 39;
                    break;
                case 38:
                    if ((tar[i].group == "blank"))
                        state = 38;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 39;
                    break;
                case 39:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 41;
                    break;
                case 40:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 41;
                    break;
                case 41:
                    if ((tar[i].group == "blank"))
                        state = 42;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 43;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 44;
                    break;
                case 42:
                    if ((tar[i].group == "blank"))
                        state = 42;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 43;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 44;
                    break;
                case 43:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 45;
                    break;
                case 45:
                    if ((tar[i].group == "blank"))
                        state = 46;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 47;
                    break;
                case 46:
                    if ((tar[i].group == "blank"))
                        state = 46;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 47;
                    break;
                case 47:
                    if ((tar[i].group == "blank"))
                        state = 48;
                    else if ((tar[i].group == "split") && (tar[i].val == ","))
                        state = 49;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 44;
                    break;
                case 48:
                    if ((tar[i].group == "blank"))
                        state = 48;
                    else if ((tar[i].group == "split") && (tar[i].val == ","))
                        state = 49;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 44;
                    break;
                case 49:
                    if ((tar[i].group == "blank"))
                        state = 42;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 43;
                    break;
                case 44:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 50;
                    break;
                case 50:
                    if ((tar[i].group == "blank"))
                        state = 51;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 52;
                    break;
                case 51:
                    if ((tar[i].group == "blank"))
                        state = 51;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 52;
                    break;
                case 52:
                    if ((tar[i].group == "blank"))
                        state = 53;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 54;
                    break;
                case 53:
                    if ((tar[i].group == "blank"))
                        state = 53;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 54;
                    break;
                case 54:
                    state = 3;
                    break;
                case 3:
                    state = 2;
                    break;
                case 2:
                    if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 55;
                    else if ((tar[i].group == "comment"))
                        state = 56;
                    else if ((tar[i].group == "blank"))
                        state = 57;
                    else if ((tar[i].group == "LF"))
                        state = 58;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 59;
                    else if ((tar[i].group == "special") && (tar[i].val == "}"))
                        state = 4;
                    break;
                case 4:
                    if ((depth == 0))
                        state = 1;
                    else if ((depth > 0))
                        state = 2;
                    break;
                case 56:
                    if ((tar[i].group == "note"))
                        state = 60;
                    else
                        state = 2;
                    break;
                case 60:
                    state = 2;
                    break;
                case 57:
                    state = 2;
                    break;
                case 58:
                    state = 2;
                    break;
                case 55:
                    if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "local"))
                        state = 61;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "ctrl"))
                        state = 62;
                    break;
                case 61:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 63;
                    break;
                case 63:
                    if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 64;
                    else if ((tar[i].group == "blank"))
                        state = 65;
                    break;
                case 65:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 65;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 64;
                    break;
                case 64:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 66;
                    break;
                case 66:
                    if ((tar[i].group == "blank"))
                        state = 67;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 68;
                    break;
                case 67:
                    if ((tar[i].group == "blank"))
                        state = 67;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 68;
                    break;
                case 68:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 69;
                    break;
                case 69:
                    state = 2;
                    break;
                case 62:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 70;
                    break;
                case 70:
                    if ((tar[i].group == "blank"))
                        state = 71;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 72;
                    break;
                case 71:
                    if ((tar[i].group == "blank"))
                        state = 71;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 72;
                    break;
                case 72:
                    if ((tar[i].group == "blank"))
                        state = 73;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 74;
                    break;
                case 73:
                    if ((tar[i].group == "blank"))
                        state = 73;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 74;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 75;
                    break;
                case 74:
                    if ((tar[i].group == "blank"))
                        state = 73;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 75;
                    break;
                case 75:
                    if ((tar[i].group == "blank"))
                        state = 76;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "if"))
                        state = 77;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "while"))
                        state = 78;
                    break;
                case 76:
                    if ((tar[i].group == "blank"))
                        state = 76;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "if"))
                        state = 77;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "while"))
                        state = 78;
                    break;
                case 77:
                    if ((tar[i].group == "blank"))
                        state = 79;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 80;
                    break;
                case 78:
                    if ((tar[i].group == "blank"))
                        state = 79;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 80;
                    break;
                case 79:
                    if ((tar[i].group == "blank"))
                        state = 79;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 80;
                    break;
                case 80:
                    state = 3;
                    break;
                case 59:
                    if ((tar[i].group == "blank"))
                        state = 81;
                    else if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 82;
                    break;
                case 81:
                    if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 59;
                    else if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 82;
                    else if ((tar[i].group == "assign"))
                        state = 83;
                    break;
                case 83:
                    if ((tar[i].group == "blank"))
                        state = 84;
                    break;
                case 84:
                    if ((tar[i].group == "blank"))
                        state = 84;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 85;
                    else if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 86;
                    break;
                case 85:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 82;
                    break;
                case 86:
                    if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "local"))
                        state = 87;
                    break;
                case 87:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 88;
                    break;
                case 88:
                    if ((tar[i].group == "blank"))
                        state = 89;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 90;
                    break;
                case 89:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 89;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 90;
                    break;
                case 90:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 91;
                    break;
                case 91:
                    if ((tar[i].group == "blank"))
                        state = 92;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 93;
                    break;
                case 92:
                    if ((tar[i].group == "blank"))
                        state = 92;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 93;
                    break;
                case 93:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 94;
                    break;
                case 94:
                    state = 2;
                    break;
                case 82:
                    state = 2;
            }
            if (state == 0) {
                throw JSON.stringify({ val: tar[i].val, state: state, state_before: state_copy, state_str: sts[state], group: tar[i].group, ttype_str: tar[i].ttype_str, i: tar[i].i });
            }
            if (!(state == 1 || state == 2 || state == 3)) {
                tar[i].ptype = state;
                tar[i].ptype_str = sts[state];
                i++;
            }
            if (state == 3) {
                depth++;
            }
            if (state == 4) {
                depth--;
            }
            while (tar[i - 1].group == "string" && tar[i].group == "string") {
                if (tar[i - 1].ttype == 8 && tar[i].ttype == 7) {
                    throw JSON.stringify({ val: tar[i].val, state: state, state_before: state_copy, state_str: sts[state], group: tar[i].group, ttype_str: tar[i].ttype_str, i: tar[i].i });
                }
                tar[i].ptype = state;
                tar[i].ptype_str = sts[state];
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
