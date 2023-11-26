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
                    tar.push({ ttype: state, ptype: null, ttype_str: sts[state], ptype_str: null, val: this.code[i], i: i, line: LineAndCol.line, col: LineAndCol.col, group: this.tokengroup[sts[state]], replaced: null });
                }
                else {
                    tar[tar.length - 1].val += this.code[i];
                }
                i++;
            }
        }
        tar.push({ ttype: -1, ptype: null, ttype_str: "EOF", ptype_str: null, val: "<EOF>", i: i, line: LineAndCol.line, col: LineAndCol.col, group: "EOF", replaced: null });
        return this;
    };
    NLPtool.prototype.parse = function () {
        var state = 2;
        var i = 0;
        var depth = 0;
        var tar = this.tokenarr;
        this.parserstates = ["EOF", "Error", "TL.root", "Block.root", "Block.entry", "Block.exit", "Block.exit.ctrl", "TLdef.exclam", "TL.comment", "TL.blank", "TL.LF", "TL.note", "TLdef.include", "TLdef.using", "TLdef.replace", "TLdef.global", "TLdef.func", "TLdef.include.colon1", "TLdef.include.blank1", "TLdef.include.filename", "TLdef.include.EOS", "TLdef.using.colon1", "TLdef.using.blank1", "TLdef.using.filename", "TLdef.using.EOS", "TLdef.replace.colon1", "TLdef.replace.blank1", "TLdef.replace.defname", "TLdef.replace.colon2", "TLdef.replace.blank2", "TLdef.replace.defval", "TLdef.replace.EOS", "TLdef.global.colon1", "TLdef.global.blank1", "TLdef.global.deftype", "TLdef.global.colon2", "TLdef.global.blank2", "TLdef.global.defname", "TLdef.global.EOS", "TLdef.func.colon1", "TLdef.func.blank1", "TLdef.func.rettype", "TLdef.func.blank2", "TLdef.func.lparen", "TLdef.func.args.blank1", "TLdef.func.args.argstype", "TLdef.func.rparen", "TLdef.func.args.colon", "TLdef.func.args.blank2", "TLdef.func.args.defname", "TLdef.func.args.blank3", "TLdef.func.args.comma", "TLdef.func.colon2", "TLdef.func.blank3", "TLdef.func.defname", "TLdef.func.blank4", "TLdef.func.lbracket", "Block.exclam.decl", "Block.comment", "Block.blank", "Block.LF", "Block.stat.expr.token", "Block.exit_", "Block.note", "Block.exclam.local", "Block.exclam.replace", "Block.exclam.ctrl", "Block.exclam.local.colon1", "Block.exclam.local.deftype", "Block.exclam.local.blank1", "Block.exclam.local.colon2", "Block.exclam.local.blank2", "Block.exclam.local.defname", "Block.exclam.local.end", "Block.exclam.replace.colon1", "Block.exclam.replace.blank1", "Block.exclam.replace.defname", "Block.exclam.replace.colon2", "Block.exclam.replace.blank2", "Block.exclam.replace.defval", "Block.exclam.replace.EOS", "Block.exclam.ctrl.colon1", "Block.exclam.ctrl.blank1", "Block.exclam.ctrl.lparen", "Block.exclam.ctrl.cond.blank", "Block.exclam.ctrl.cond.token", "Block.exclam.ctrl.rparen", "Block.exclam.ctrl.blank2", "Block.exclam.ctrl.type", "Block.exclam.ctrl.blank3", "Block.exclam.lbracket", "Block.exclam.continue.blank1", "Block.exclam.continue.else", "Block.exclam.continue.blank3", "Block.stat.expr.blank", "Block.stat.end", "Block.stat.assign", "Block.stat.blank1", "Block.stat.assignvar", "Block.stat.exclam.decl", "Block.stat.exclam.local", "Block.stat.exclam.local.colon1", "Block.stat.exclam.local.blank1", "Block.stat.exclam.local.deftype", "Block.stat.exclam.local.colon2", "Block.stat.exclam.local.blank2", "Block.stat.exclam.local.defname", "Block.stat.exclam.local.end"];
        var sts = this.parserstates;
        while (i < tar.length) {
            var state_copy = state;
            state = 1;
            switch (state_copy) {
                case 2:
                    if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 7;
                    else if ((tar[i].group == "comment"))
                        state = 8;
                    else if ((tar[i].group == "blank"))
                        state = 9;
                    else if ((tar[i].group == "LF"))
                        state = 10;
                    else if ((tar[i].group == "EOF"))
                        state = 0;
                    break;
                case 8:
                    if ((tar[i].group == "note"))
                        state = 11;
                    else
                        state = 2;
                    break;
                case 11:
                    state = 2;
                    break;
                case 9:
                    state = 2;
                    break;
                case 10:
                    state = 2;
                    break;
                case 7:
                    if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "include"))
                        state = 12;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "using"))
                        state = 13;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "replace"))
                        state = 14;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "global"))
                        state = 15;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "fn"))
                        state = 16;
                    break;
                case 12:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 17;
                    break;
                case 17:
                    if ((tar[i].group == "blank"))
                        state = 18;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 19;
                    break;
                case 18:
                    if ((tar[i].group == "blank"))
                        state = 18;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 19;
                    break;
                case 19:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 20;
                    break;
                case 20:
                    state = 2;
                    break;
                case 13:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 21;
                    break;
                case 21:
                    if ((tar[i].group == "blank"))
                        state = 22;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 23;
                    break;
                case 22:
                    if ((tar[i].group == "blank"))
                        state = 22;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 23;
                    break;
                case 23:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 24;
                    break;
                case 24:
                    state = 2;
                    break;
                case 14:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 25;
                    break;
                case 25:
                    if ((tar[i].group == "blank"))
                        state = 26;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 27;
                    break;
                case 26:
                    if ((tar[i].group == "blank"))
                        state = 26;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 27;
                    break;
                case 27:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 28;
                    break;
                case 28:
                    if ((tar[i].group == "blank"))
                        state = 29;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 30;
                    break;
                case 29:
                    if ((tar[i].group == "blank"))
                        state = 29;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 30;
                    break;
                case 30:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 31;
                    break;
                case 31:
                    state = 2;
                    break;
                case 15:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 32;
                    break;
                case 32:
                    if ((tar[i].group == "blank"))
                        state = 33;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 34;
                    break;
                case 33:
                    if ((tar[i].group == "blank"))
                        state = 33;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 34;
                    break;
                case 34:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 35;
                    break;
                case 35:
                    if ((tar[i].group == "blank"))
                        state = 36;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 37;
                    break;
                case 36:
                    if ((tar[i].group == "blank"))
                        state = 36;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 37;
                    break;
                case 37:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 38;
                    break;
                case 38:
                    state = 2;
                    break;
                case 16:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 39;
                    break;
                case 39:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 41;
                    break;
                case 40:
                    if ((tar[i].group == "blank"))
                        state = 40;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 41;
                    break;
                case 41:
                    if ((tar[i].group == "blank"))
                        state = 42;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 43;
                    break;
                case 42:
                    if ((tar[i].group == "blank"))
                        state = 42;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 43;
                    break;
                case 43:
                    if ((tar[i].group == "blank"))
                        state = 44;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 45;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 46;
                    break;
                case 44:
                    if ((tar[i].group == "blank"))
                        state = 44;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 45;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 46;
                    break;
                case 45:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 47;
                    break;
                case 47:
                    if ((tar[i].group == "blank"))
                        state = 48;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 49;
                    break;
                case 48:
                    if ((tar[i].group == "blank"))
                        state = 48;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 49;
                    break;
                case 49:
                    if ((tar[i].group == "blank"))
                        state = 50;
                    else if ((tar[i].group == "split") && (tar[i].val == ","))
                        state = 51;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 46;
                    break;
                case 50:
                    if ((tar[i].group == "blank"))
                        state = 50;
                    else if ((tar[i].group == "split") && (tar[i].val == ","))
                        state = 51;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 46;
                    break;
                case 51:
                    if ((tar[i].group == "blank"))
                        state = 44;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 45;
                    break;
                case 46:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 52;
                    break;
                case 52:
                    if ((tar[i].group == "blank"))
                        state = 53;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 54;
                    break;
                case 53:
                    if ((tar[i].group == "blank"))
                        state = 53;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 54;
                    break;
                case 54:
                    if ((tar[i].group == "blank"))
                        state = 55;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 56;
                    break;
                case 55:
                    if ((tar[i].group == "blank"))
                        state = 55;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 56;
                    break;
                case 56:
                    state = 4;
                    break;
                case 4:
                    state = 3;
                    break;
                case 3:
                    if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 57;
                    else if ((tar[i].group == "comment"))
                        state = 58;
                    else if ((tar[i].group == "blank"))
                        state = 59;
                    else if ((tar[i].group == "LF"))
                        state = 60;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 61;
                    else if ((depth == 1) && (tar[i].group == "special") && (tar[i].val == "}"))
                        state = 5;
                    else if ((depth > 1) && (tar[i].group == "special") && (tar[i].val == "}") && (tar[i + 1].val == ";"))
                        state = 62;
                    else if ((depth > 1) && (tar[i].group == "special") && (tar[i].val == "}"))
                        state = 6;
                    break;
                case 62:
                    state = 5;
                    break;
                case 5:
                    if ((depth == 0))
                        state = 2;
                    else if ((depth > 0) && (depth == 1))
                        state = 3;
                    break;
                case 58:
                    if ((tar[i].group == "note"))
                        state = 63;
                    else
                        state = 3;
                    break;
                case 63:
                    state = 3;
                    break;
                case 59:
                    state = 3;
                    break;
                case 60:
                    state = 3;
                    break;
                case 57:
                    if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "local"))
                        state = 64;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "replace"))
                        state = 65;
                    else if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "ctrl"))
                        state = 66;
                    break;
                case 64:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 67;
                    break;
                case 67:
                    if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 68;
                    else if ((tar[i].group == "blank"))
                        state = 69;
                    break;
                case 69:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 69;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 68;
                    break;
                case 68:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 70;
                    break;
                case 70:
                    if ((tar[i].group == "blank"))
                        state = 71;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 72;
                    break;
                case 71:
                    if ((tar[i].group == "blank"))
                        state = 71;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 72;
                    break;
                case 72:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 73;
                    break;
                case 73:
                    state = 3;
                    break;
                case 65:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 74;
                    break;
                case 74:
                    if ((tar[i].group == "blank"))
                        state = 75;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 76;
                    break;
                case 75:
                    if ((tar[i].group == "blank"))
                        state = 75;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 76;
                    break;
                case 76:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 77;
                    break;
                case 77:
                    if ((tar[i].group == "blank"))
                        state = 78;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 79;
                    break;
                case 78:
                    if ((tar[i].group == "blank"))
                        state = 78;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 79;
                    break;
                case 79:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 80;
                    break;
                case 80:
                    state = 3;
                    break;
                case 66:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 81;
                    break;
                case 81:
                    if ((tar[i].group == "blank"))
                        state = 82;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 83;
                    break;
                case 82:
                    if ((tar[i].group == "blank"))
                        state = 82;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 83;
                    break;
                case 83:
                    if ((tar[i].group == "blank"))
                        state = 84;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 85;
                    break;
                case 84:
                    if ((tar[i].group == "blank"))
                        state = 84;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 85;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 86;
                    break;
                case 85:
                    if ((tar[i].group == "blank"))
                        state = 84;
                    else if ((tar[i].group == "special") && (tar[i].val == ")"))
                        state = 86;
                    break;
                case 86:
                    if ((tar[i].group == "blank"))
                        state = 87;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 88;
                    break;
                case 87:
                    if ((tar[i].group == "blank"))
                        state = 87;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 88;
                    break;
                case 88:
                    if ((tar[i].group == "blank"))
                        state = 89;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 90;
                    break;
                case 89:
                    if ((tar[i].group == "blank"))
                        state = 89;
                    else if ((tar[i].group == "special") && (tar[i].val == "{"))
                        state = 90;
                    break;
                case 90:
                    state = 4;
                    break;
                case 6:
                    if ((tar[i].group == "blank"))
                        state = 91;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 88;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 83;
                    break;
                case 91:
                    if ((tar[i].group == "blank"))
                        state = 91;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 88;
                    else if ((tar[i].group == "special") && (tar[i].val == "("))
                        state = 83;
                    break;
                case 92:
                    if ((tar[i].group == "blank"))
                        state = 93;
                    break;
                case 61:
                    if ((tar[i].group == "blank"))
                        state = 94;
                    else if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 95;
                    break;
                case 94:
                    if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 61;
                    else if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 95;
                    else if ((tar[i].group == "assign"))
                        state = 96;
                    break;
                case 96:
                    if ((tar[i].group == "blank"))
                        state = 97;
                    break;
                case 97:
                    if ((tar[i].group == "blank"))
                        state = 97;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 98;
                    else if ((tar[i].group == "special") && (tar[i].val == "!"))
                        state = 99;
                    break;
                case 98:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 95;
                    break;
                case 99:
                    if ((tar[i].group == "token" || tar[i].group == "string") && (tar[i].val == "local"))
                        state = 100;
                    break;
                case 100:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 101;
                    break;
                case 101:
                    if ((tar[i].group == "blank"))
                        state = 102;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 103;
                    break;
                case 102:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 102;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 103;
                    break;
                case 103:
                    if ((tar[i].group == "split") && (tar[i].val == ":"))
                        state = 104;
                    break;
                case 104:
                    if ((tar[i].group == "blank"))
                        state = 105;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 106;
                    break;
                case 105:
                    if ((tar[i].group == "blank"))
                        state = 105;
                    else if ((tar[i].group == "token" || tar[i].group == "string"))
                        state = 106;
                    break;
                case 106:
                    if ((tar[i].group == "split") && (tar[i].val == ";"))
                        state = 107;
                    break;
                case 107:
                    state = 3;
                    break;
                case 95:
                    state = 3;
            }
            if (state == 1) {
                throw JSON.stringify({ val: tar[i].val, state: state, state_before: state_copy, state_str: sts[state], group: tar[i].group, ttype_str: tar[i].ttype_str, i: tar[i].i, depth: depth });
            }
            if (!(state == 2 || state == 3 || state == 4)) {
                tar[i].ptype = state;
                tar[i].ptype_str = sts[state];
                i++;
            }
            if (state == 4) {
                depth++;
            }
            if (state == 5 || state == 6) {
                depth--;
            }
            while (tar[i - 1].group == "string" && tar[i].group == "string") {
                if (tar[i - 1].ttype == 9 && tar[i].ttype == 8) {
                    throw JSON.stringify({ val: tar[i].val, state: state, state_before: state_copy, state_str: sts[state], group: tar[i].group, ttype_str: tar[i].ttype_str, i: tar[i].i, depth: depth });
                }
                tar[i].ptype = state;
                tar[i].ptype_str = sts[state];
                i++;
            }
        }
        return this;
    };
    NLPtool.prototype.buildAST1 = function () {
        var tar = this.tokenarr;
        this.ast1i = 0;
        this.ast1 = [];
        this.replacetoken = {};
        while (this.ast1i < tar.length) {
            var bfi = this.ast1i;
            while (this.tokenarr[this.ast1i].ptype_str != "TLdef.exclam" && this.tokenarr[this.ast1i].ptype_str != "EOF") {
                this.ast1i++;
            }
            this.buildAST1_include();
            this.buildAST1_using();
            this.buildAST1_replace();
            this.buildAST1_global();
            this.buildAST1_fn();
            if (tar[this.ast1i].ptype_str == "EOF") {
                break;
            }
            if (bfi == this.ast1i) {
                throw "AST1 error1: ".concat(this.ast1i, " ").concat(tar[this.ast1i].ptype_str);
            }
        }
        console.log(this.ast1);
        return this;
    };
    NLPtool.prototype.buildAST1_getToken = function (replacetoken) {
        if (this.tokenarr[this.ast1i].group == "token") {
            var val = this.tokenarr[this.ast1i].val;
            if (val in replacetoken) {
                val = replacetoken[val].val;
            }
            return { type: "token", val: val, txt: this.tokenarr[this.ast1i].val, range: [this.tokenarr[this.ast1i].i + 1, this.tokenarr[this.ast1i].i + this.tokenarr[this.ast1i].val.length] };
        }
        else if (this.tokenarr[this.ast1i].group == "string") {
            var bfi = this.ast1i;
            var txt = "";
            while (this.tokenarr[this.ast1i].group == "string") {
                txt += this.tokenarr[this.ast1i].val;
                this.ast1i++;
            }
            var val = txt;
            if (val in replacetoken) {
                val = replacetoken[val].val;
            }
            return { type: "token", val: val, txt: txt, range: [this.tokenarr[bfi].i + 1, this.tokenarr[bfi].i + txt.length] };
        }
    };
    NLPtool.prototype.buildAST1_getToken4replaceOnly = function () {
        if (this.tokenarr[this.ast1i].group == "token") {
            return { type: "token", val: this.tokenarr[this.ast1i].val, txt: this.tokenarr[this.ast1i].val, range: [this.tokenarr[this.ast1i].i + 1, this.tokenarr[this.ast1i].i + this.tokenarr[this.ast1i].val.length] };
        }
        else if (this.tokenarr[this.ast1i].group == "string") {
            var bfi = this.ast1i;
            var txt = "";
            while (this.tokenarr[this.ast1i].group == "string") {
                txt += this.tokenarr[this.ast1i].val;
                this.ast1i++;
            }
            return { type: "token", val: txt, txt: txt, range: [this.tokenarr[bfi].i + 1, this.tokenarr[bfi].i + txt.length] };
        }
    };
    NLPtool.prototype.buildAST1_skipTokenTo = function (ptype_str) {
        while (this.tokenarr[this.ast1i].ptype_str != ptype_str) {
            this.ast1i++;
        }
    };
    NLPtool.prototype.buildAST1_include = function () {
        if (this.tokenarr[this.ast1i].ptype_str == "TLdef.exclam" && this.tokenarr[this.ast1i + 1].ptype_str == "TLdef.include") {
            this.ast1i++;
            var obj = { type: "include", filename: {} };
            this.buildAST1_skipTokenTo("TLdef.include.filename");
            obj.filename = this.buildAST1_getToken(this.replacetoken);
            this.ast1.push(obj);
            this.buildAST1_skipTokenTo("TLdef.include.EOS");
        }
    };
    NLPtool.prototype.buildAST1_using = function () {
        if (this.tokenarr[this.ast1i].ptype_str == "TLdef.exclam" && this.tokenarr[this.ast1i + 1].ptype_str == "TLdef.using") {
            this.ast1i++;
            var obj = { type: "using", filename: {} };
            this.buildAST1_skipTokenTo("TLdef.using.filename");
            obj.filename = this.buildAST1_getToken(this.replacetoken);
            this.ast1.push(obj);
            this.buildAST1_skipTokenTo("TLdef.using.EOS");
        }
    };
    NLPtool.prototype.buildAST1_replace = function () {
        if (this.tokenarr[this.ast1i].ptype_str == "TLdef.exclam" && this.tokenarr[this.ast1i + 1].ptype_str == "TLdef.replace") {
            this.ast1i++;
            var obj = { type: "replace", name: {}, val: {} };
            this.buildAST1_skipTokenTo("TLdef.replace.defname");
            obj.name = this.buildAST1_getToken4replaceOnly();
            this.buildAST1_skipTokenTo("TLdef.replace.defval");
            obj.val = this.buildAST1_getToken4replaceOnly();
            this.ast1.push(obj);
            this.buildAST1_skipTokenTo("TLdef.replace.EOS");
            this.replacetoken[obj.name.val] = { val: obj.val.val, range: obj.val.range };
        }
    };
    NLPtool.prototype.buildAST1_global = function () {
        if (this.tokenarr[this.ast1i].ptype_str == "TLdef.exclam" && this.tokenarr[this.ast1i + 1].ptype_str == "TLdef.global") {
            this.ast1i++;
            var obj = { type: "global", vartype: {}, varname: {} };
            this.buildAST1_skipTokenTo("TLdef.global.deftype");
            obj.vartype = this.buildAST1_getToken(this.replacetoken);
            this.buildAST1_skipTokenTo("TLdef.global.defname");
            obj.varname = this.buildAST1_getToken(this.replacetoken);
            this.ast1.push(obj);
            this.buildAST1_skipTokenTo("TLdef.global.EOS");
        }
    };
    NLPtool.prototype.buildAST1_fn = function () {
        if (this.tokenarr[this.ast1i].ptype_str == "TLdef.exclam" && this.tokenarr[this.ast1i + 1].ptype_str == "TLdef.func") {
            this.ast1i++;
            var obj = { type: "fn", rettype: {}, args: [], fnname: {}, block: [] };
            this.buildAST1_skipTokenTo("TLdef.func.rettype");
            obj.rettype = this.buildAST1_getToken(this.replacetoken);
            while (this.tokenarr[this.ast1i].ptype_str != "TLdef.func.rparen") {
                if (this.tokenarr[this.ast1i].ptype_str == "TLdef.func.args.argstype") {
                    var argobj = { argtype: this.buildAST1_getToken(this.replacetoken), argname: {} };
                    this.buildAST1_skipTokenTo("TLdef.func.args.defname");
                    argobj.argname = this.buildAST1_getToken(this.replacetoken);
                    obj.args.push(argobj);
                }
                this.ast1i++;
            }
            this.buildAST1_skipTokenTo("TLdef.func.defname");
            obj.fnname = this.buildAST1_getToken(this.replacetoken);
            obj.block = this.buildAST1_block(structuredClone(this.replacetoken));
            this.ast1.push(obj);
        }
    };
    NLPtool.prototype.buildAST1_block = function (lreplacetoken) {
        var blockroot = [];
        var depth = 0;
        while (this.ast1i < this.tokenarr.length) {
            var bfi = this.ast1i;
            while (this.tokenarr[this.ast1i].ptype_str != "Block.stat.expr.token" && this.tokenarr[this.ast1i].ptype_str != "Block.exclam.decl"
                && this.tokenarr[this.ast1i].ptype_str != "TLdef.func.lbracket" && this.tokenarr[this.ast1i].ptype_str != "Block.exclam.lbracket" && this.tokenarr[this.ast1i].ptype_str != "Block.exit.ctrl" && this.tokenarr[this.ast1i].ptype_str != "Block.exit_" && this.tokenarr[this.ast1i].ptype_str != "Block.exit") {
                this.ast1i++;
            }
            this.buildAST1_block_expr(blockroot, lreplacetoken);
            this.buildAST1_block_decl(blockroot, lreplacetoken);
            if (this.tokenarr[this.ast1i].ptype_str == "TLdef.func.lbracket" || this.tokenarr[this.ast1i].ptype_str == "Block.exclam.lbracket") {
                depth++;
                this.ast1i++;
            }
            if (this.tokenarr[this.ast1i].ptype_str == "Block.exit.ctrl" || this.tokenarr[this.ast1i].ptype_str == "Block.exit_" || this.tokenarr[this.ast1i].ptype_str == "Block.exit") {
                depth--;
                this.ast1i++;
                if (depth == 0) {
                    return blockroot;
                }
            }
            if (bfi == this.ast1i) {
                throw "AST1 error2: ".concat(this.ast1i, " ").concat(this.tokenarr[this.ast1i].ptype_str);
            }
        }
        return blockroot;
    };
    NLPtool.prototype.buildAST1_block_expr = function (block, lreplacetoken) {
        if (this.tokenarr[this.ast1i].ptype_str == "Block.stat.expr.token") {
            var obj = { type: "stat", expr: [], assign: { assign: false, define: false, vartype: "", varname: "" } };
            while (this.tokenarr[this.ast1i].ptype_str != "Block.stat.assign" && this.tokenarr[this.ast1i].ptype_str != "Block.stat.end") {
                if (this.tokenarr[this.ast1i].ptype_str == "Block.stat.expr.token") {
                    obj.expr.push(this.buildAST1_getToken(lreplacetoken));
                }
                this.ast1i++;
            }
            if (this.tokenarr[this.ast1i].ptype_str == "Block.stat.assign") {
                obj.assign.assign = true;
                while (this.tokenarr[this.ast1i].ptype_str != "Block.stat.exclam.local" && this.tokenarr[this.ast1i].ptype_str != "Block.stat.assignvar") {
                    this.ast1i++;
                }
                if (this.tokenarr[this.ast1i].ptype_str == "Block.stat.exclam.local") {
                    obj.assign.define = true;
                    this.buildAST1_skipTokenTo("Block.stat.exclam.local.deftype");
                    obj.assign.vartype = this.buildAST1_getToken(lreplacetoken);
                    this.buildAST1_skipTokenTo("Block.stat.exclam.local.defname");
                    obj.assign.varname = this.buildAST1_getToken(lreplacetoken);
                }
                else {
                    obj.assign.varname = this.buildAST1_getToken(lreplacetoken);
                }
            }
            block.push(obj);
        }
    };
    NLPtool.prototype.buildAST1_block_decl = function (block, lreplacetoken) {
        if (this.tokenarr[this.ast1i].ptype_str == "Block.exclam.decl" && this.tokenarr[this.ast1i + 1].ptype_str == "Block.exclam.ctrl") {
            this.ast1i++;
            var obj = { type: "ctrl", blocks: [] };
            while (this.ast1i < this.tokenarr.length) {
                var bfi = this.ast1i;
                while (this.tokenarr[this.ast1i].ptype_str != "Block.exclam.ctrl.lparen" && this.tokenarr[this.ast1i].ptype_str != "Block.exclam.ctrl.type" && this.tokenarr[this.ast1i].ptype_str != "Block.exit") {
                    this.ast1i++;
                }
                if (this.tokenarr[this.ast1i].ptype_str == "Block.exclam.ctrl.lparen") {
                    var block_1 = { condition: [], type: {}, block: [] };
                    while (this.tokenarr[this.ast1i].ptype_str != "Block.exclam.ctrl.rparen") {
                        if (this.tokenarr[this.ast1i].ptype_str == "Block.exclam.ctrl.cond.token") {
                            block_1.condition.push(this.buildAST1_getToken(lreplacetoken));
                        }
                        this.ast1i++;
                    }
                    while (this.tokenarr[this.ast1i].ptype_str != "Block.exclam.ctrl.type") {
                        this.ast1i++;
                    }
                    block_1.type = this.buildAST1_getToken(lreplacetoken);
                    block_1.block = this.buildAST1_block(structuredClone(lreplacetoken));
                    obj.blocks.push(block_1);
                }
                else if (this.tokenarr[this.ast1i].ptype_str == "Block.exclam.ctrl.type") {
                    var block_2 = { condition: [], type: {}, block: [] };
                    while (this.tokenarr[this.ast1i].ptype_str != "Block.exclam.ctrl.type") {
                        this.ast1i++;
                    }
                    block_2.type = this.buildAST1_getToken(lreplacetoken);
                    block_2.block = this.buildAST1_block(structuredClone(lreplacetoken));
                    obj.blocks.push(block_2);
                }
                else {
                    this.ast1i++;
                    block.push(obj);
                    return;
                }
                if (bfi == this.ast1i) {
                    throw "AST1 error3: ".concat(this.ast1i, " ").concat(this.tokenarr[this.ast1i].ptype_str);
                }
            }
        }
        else if (this.tokenarr[this.ast1i].ptype_str == "Block.exclam.decl" && this.tokenarr[this.ast1i + 1].ptype_str == "Block.exclam.local") {
            this.ast1i++;
            var obj = { type: "local", vartype: "", varname: "" };
            this.buildAST1_skipTokenTo("Block.exclam.local.deftype");
            obj.vartype = this.buildAST1_getToken(lreplacetoken);
            this.buildAST1_skipTokenTo("Block.exclam.local.defname");
            obj.varname = this.buildAST1_getToken(lreplacetoken);
            block.push(obj);
        }
        else if (this.tokenarr[this.ast1i].ptype_str == "Block.exclam.decl" && this.tokenarr[this.ast1i + 1].ptype_str == "Block.exclam.replace") {
            this.ast1i++;
            var obj = { type: "replace", name: {}, val: {} };
            this.buildAST1_skipTokenTo("Block.exclam.replace.defname");
            obj.name = this.buildAST1_getToken4replaceOnly();
            this.buildAST1_skipTokenTo("Block.exclam.replace.defval");
            obj.val = this.buildAST1_getToken4replaceOnly();
            block.push(obj);
            lreplacetoken[obj.name.val] = { val: obj.val.val, range: obj.val.range };
        }
    };
    return NLPtool;
}());
if ((typeof require != "undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
    code_res.parse();
}
