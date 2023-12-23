class NLPtool {
    private code:string;
    private filename:string;
    private fRead:Function;
    private ast1i:number;
    tokenizerstates:Array<string>;
    parserstates:Array<string>;
    tokenarr:Array<Record<string,string|number>>;
    ast1:Array<Object>;
    replacetoken:Object;
    tokengroup:object;
    constructor(filename: string) {
        this.filename = filename;
        { // Define the fRead function
            // @ts-ignore
            if (typeof require!="undefined") {
                // @ts-ignore
                const fs:any = require('fs');
                this.fRead = function (filename): string {
                    return fs.readFileSync(filename,'utf8').replace(/\r\n/g,"\n");
                }
            }
            else {
                this.fRead = function (filename): string {
                    let hr:any = new XMLHttpRequest()
                    hr.open("GET",filename,false);
                    hr.send(null);
                    if (hr.status==200||hr.status==304) {
                        return hr.responseText.replace(/\r\n/g,"\n");
                    }
                    else {
                        throw "err "+filename;
                    }
                }
            }
        }
        this.code = this.fRead(filename);
        //console.log(this.code)
    }
    getLineAndCol(i:number): object {
        let j:number = 0;
        let line:number = 1;
        let col:number = 1;
        while (j<i) {
            if (this.code[j]=="\n") {
                line++;
                col = 0;
            }
            else {
                col++;
            }
            j++;
        }
        return {line:line,col:col};
    }
    tokenize(): Object {
        var tar: Array<Record<string,string|number>> = [];
        this.tokenarr = tar;
        var state:number = 0;
        let i:number = 0;
        let tc = this.code;
        //console.log(tar)
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
        }
        /*TokenizerReplace_states_start*/
        this.tokenizerstates = ["start","LF","comment.LF","blank","split","special","lassign_","string.start","string.end","lassign","comment.start","token","comment.notestart","comment.blockstart","comment.linecomment","comment.notebeforeblank","comment.note","comment.blockend1","comment.blockcomment","comment.blockend","string.escape1","string.space","string.char","string.escape2"]
        /*TokenizerReplace_states_end*/
        var sts = this.tokenizerstates;
        while (i<this.code.length) {
            /*TokenizerReplace_switch_start*/
            switch(state){
                case 0:
                    if ((tc[i]==":")&&(tc[i+1]==">")) state=9;
                    else if ((tc[i]==" ")) state=3;
                    else if ((tc[i]==":")||(tc[i]==",")||(tc[i]==";")) state=4;
                    else if ((tc[i]=="!")||(tc[i]=="(")||(tc[i]==")")||(tc[i]=="{")||(tc[i]=="}")) state=5;
                    else if ((tc[i]=="#")) state=10;
                    else if ((tc[i]=="\n")) state=1;
                    else if ((tc[i]=="\"")) state=7;
                    else state=11;
                    break;
                case 10:
                    if ((tc[i]==":")) state=12;
                    else if ((tc[i]=="*")) state=13;
                    else if ((tc[i]=="\n")) state=1;
                    else state=14;
                    break;
                case 12:
                    if ((tc[i]==" ")) state=15;
                    else if ((tc[i]!="\n")) state=16;
                    else if ((tc[i]=="\n")) state=1;
                    break;
                case 15:
                    if ((tc[i]!="\n")) state=16;
                    else if ((tc[i]=="\n")) state=1;
                    break;
                case 16:
                    if ((tc[i]!="\n")) state=16;
                    else if ((tc[i]=="\n")) state=1;
                    break;
                case 14:
                    if ((tc[i]!="\n")) state=14;
                    else if ((tc[i]=="\n")) state=1;
                    break;
                case 13:
                    if ((tc[i]=="*")&&(tc[i+1]=="#")) state=17;
                    else if ((tc[i]!="#")&&(tc[i]!="\n")) state=18;
                    else if ((tc[i]=="\n")) state=2;
                    break;
                case 18:
                    if ((tc[i]=="*")&&(tc[i+1]=="#")) state=17;
                    else if ((tc[i]!="#")&&(tc[i]!="\n")) state=18;
                    else if ((tc[i]=="\n")) state=2;
                    break;
                case 2:
                    if ((tc[i]=="*")&&(tc[i+1]=="#")) state=17;
                    else if ((tc[i]!="#")&&(tc[i]!="\n")) state=18;
                    else if ((tc[i]=="\n")) state=2;
                    break;
                case 17:
                    state=19;
                    break;
                case 7:
                    if ((tc[i]=="\\")) state=20;
                    else if ((tc[i]=="\n")) state=1;
                    else if ((tc[i]=="\"")) state=8;
                    else if ((tc[i]==" ")) state=21;
                    else state=22;
                    break;
                case 22:
                    if ((tc[i]=="\n")) state=1;
                    else if ((tc[i]=="\\")) state=20;
                    else if ((tc[i]=="\"")) state=8;
                    else if ((tc[i]==" ")) state=21;
                    else state=22;
                    break;
                case 21:
                    if ((tc[i]=="\n")) state=1;
                    else if ((tc[i]=="\\")) state=20;
                    else if ((tc[i]=="\"")) state=8;
                    else if ((tc[i]==" ")) state=21;
                    else state=22;
                    break;
                case 20:
                    if ((tc[i]=="\n")) state=1;
                    else state=23;
                    break;
                case 23:
                    if ((tc[i]=="\n")) state=1;
                    else if ((tc[i]=="\"")) state=8;
                    else if ((tc[i]=="\\")) state=20;
                    else if ((tc[i]==" ")) state=21;
                    else state=22;
                    break;
                case 9:
                    state=6;
                    break;
                case 3:
                    state=0;
                    break;
                case 4:
                    state=0;
                    break;
                case 5:
                    state=0;
                    break;
                case 11:
                    state=0;
                    break;
                case 1:
                    state=0;
                    break;
                case 19:
                    state=0;
                    break;
                case 8:
                    state=0;
                    break;
                case 6:
                    state=0;
            }
            /*TokenizerReplace_switch_end*/

            if (state!=0) {
                let LineAndCol:object = this.getLineAndCol(i);

                //console.log(i,this.code[i].replace(/\n/g,"\\n"),sts[state],state)
                if ((tar.length==0||state!=tar[tar.length-1].ttype||state==1||state==2||state==3||state==4||state==5)&&state!=6) {
                    // @ts-ignore
                    tar.push({ttype:state,ptype:null,ttype_str:sts[state],ptype_str:null,val:this.code[i],replaced:null,i:i,line:LineAndCol.line,col:LineAndCol.col,plevel:null,group:this.tokengroup[sts[state]]});
                }
                else {
                    tar[tar.length-1].val += this.code[i];
                }
                //console.table(tar)
                i++;
            }
        }
        // @ts-ignore
        tar.push({ttype:-1,ptype:null,ttype_str:"EOF",ptype_str:null,val:"<EOF>",replaced:null,i:i,line:LineAndCol.line,col:LineAndCol.col,plevel:null,group:"EOF"});
        console.table(tar)
        return this;
    }

    parse(): Object {
        var state:number = 2;
        let i:number = 0;
        let depth:number = 0;
        let tar = this.tokenarr;
        /*ParserReplace_states_start*/
        this.parserstates = ["EOF","Error","TL.root","Block.root","Block.entry","TLdef.func.lbracket","Block.exclam.lbracket","Block.exit","Block.exit_","TLdef.exclam","TL.comment","TL.blank","TL.LF","TL.note","TLdef.include","TLdef.using","TLdef.replace","TLdef.global","TLdef.func","TLdef.include.colon1","TLdef.include.blank1","TLdef.include.filename","TLdef.include.EOS","TLdef.using.colon1","TLdef.using.blank1","TLdef.using.filename","TLdef.using.EOS","TLdef.replace.colon1","TLdef.replace.blank1","TLdef.replace.defname","TLdef.replace.colon2","TLdef.replace.blank2","TLdef.replace.defval","TLdef.replace.EOS","TLdef.global.colon1","TLdef.global.blank1","TLdef.global.deftype","TLdef.global.colon2","TLdef.global.blank2","TLdef.global.defname","TLdef.global.EOS","TLdef.func.colon1","TLdef.func.blank1","TLdef.func.rettype","TLdef.func.blank2","TLdef.func.lparen","TLdef.func.args.blank1","TLdef.func.args.argstype","TLdef.func.rparen","TLdef.func.args.colon","TLdef.func.args.blank2","TLdef.func.args.defname","TLdef.func.args.blank3","TLdef.func.args.comma","TLdef.func.colon2","TLdef.func.blank3","TLdef.func.defname","TLdef.func.blank4","Block.exclam.decl","Block.comment","Block.blank","Block.LF","Block.stat.expr.token","Block.exit.ctrl","Block.note","Block.exclam.local","Block.exclam.replace","Block.exclam.ctrl","Block.exclam.local.colon1","Block.exclam.local.deftype","Block.exclam.local.blank1","Block.exclam.local.colon2","Block.exclam.local.blank2","Block.exclam.local.defname","Block.exclam.local.end","Block.exclam.replace.colon1","Block.exclam.replace.blank1","Block.exclam.replace.defname","Block.exclam.replace.colon2","Block.exclam.replace.blank2","Block.exclam.replace.defval","Block.exclam.replace.EOS","Block.exclam.ctrl.colon1","Block.exclam.ctrl.blank1","Block.exclam.ctrl.lparen","Block.exclam.ctrl.cond.blank","Block.exclam.ctrl.cond.token","Block.exclam.ctrl.rparen","Block.exclam.ctrl.blank2","Block.exclam.ctrl.type","Block.exclam.ctrl.blank3","Block.exclam.continue.blank1","Block.exclam.continue.else","Block.exclam.continue.blank3","Block.stat.expr.blank","Block.stat.end","Block.stat.assign","Block.stat.blank1","Block.stat.assignvar","Block.stat.exclam.decl","Block.stat.exclam.local","Block.stat.exclam.local.colon1","Block.stat.exclam.local.blank1","Block.stat.exclam.local.deftype","Block.stat.exclam.local.colon2","Block.stat.exclam.local.blank2","Block.stat.exclam.local.defname","Block.stat.exclam.local.end"]
        /*ParserReplace_states_end*/
        var sts = this.parserstates;
        while (i<tar.length) {
            let state_copy = state;
            state = 1;
            /*ParserReplace_switch_start*/
            switch(state_copy){
                case 2:
                    if ((tar[i].group=="special")&&(tar[i].val=="!")) state=9;
                    else if ((tar[i].group=="comment")) state=10;
                    else if ((tar[i].group=="blank")) state=11;
                    else if ((tar[i].group=="LF")) state=12;
                    else if ((tar[i].group=="EOF")) state=0;
                    break;
                case 10:
                    if ((tar[i].group=="note")) state=13;
                    else state=2;
                    break;
                case 13:
                    state=2;
                    break;
                case 11:
                    state=2;
                    break;
                case 12:
                    state=2;
                    break;
                case 9:
                    if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="include")) state=14;
                    else if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="using")) state=15;
                    else if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="replace")) state=16;
                    else if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="global")) state=17;
                    else if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="fn")) state=18;
                    break;
                case 14:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=19;
                    break;
                case 19:
                    if ((tar[i].group=="blank")) state=20;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=21;
                    break;
                case 20:
                    if ((tar[i].group=="blank")) state=20;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=21;
                    break;
                case 21:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=22;
                    break;
                case 22:
                    state=2;
                    break;
                case 15:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=23;
                    break;
                case 23:
                    if ((tar[i].group=="blank")) state=24;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=25;
                    break;
                case 24:
                    if ((tar[i].group=="blank")) state=24;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=25;
                    break;
                case 25:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=26;
                    break;
                case 26:
                    state=2;
                    break;
                case 16:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=27;
                    break;
                case 27:
                    if ((tar[i].group=="blank")) state=28;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=29;
                    break;
                case 28:
                    if ((tar[i].group=="blank")) state=28;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=29;
                    break;
                case 29:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=30;
                    break;
                case 30:
                    if ((tar[i].group=="blank")) state=31;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=32;
                    break;
                case 31:
                    if ((tar[i].group=="blank")) state=31;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=32;
                    break;
                case 32:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=33;
                    break;
                case 33:
                    state=2;
                    break;
                case 17:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=34;
                    break;
                case 34:
                    if ((tar[i].group=="blank")) state=35;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=36;
                    break;
                case 35:
                    if ((tar[i].group=="blank")) state=35;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=36;
                    break;
                case 36:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=37;
                    break;
                case 37:
                    if ((tar[i].group=="blank")) state=38;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=39;
                    break;
                case 38:
                    if ((tar[i].group=="blank")) state=38;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=39;
                    break;
                case 39:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=40;
                    break;
                case 40:
                    state=2;
                    break;
                case 18:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=41;
                    break;
                case 41:
                    if ((tar[i].group=="blank")) state=42;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=43;
                    break;
                case 42:
                    if ((tar[i].group=="blank")) state=42;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=43;
                    break;
                case 43:
                    if ((tar[i].group=="blank")) state=44;
                    else if ((tar[i].group=="special")&&(tar[i].val=="(")) state=45;
                    break;
                case 44:
                    if ((tar[i].group=="blank")) state=44;
                    else if ((tar[i].group=="special")&&(tar[i].val=="(")) state=45;
                    break;
                case 45:
                    if ((tar[i].group=="blank")) state=46;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=47;
                    else if ((tar[i].group=="special")&&(tar[i].val==")")) state=48;
                    break;
                case 46:
                    if ((tar[i].group=="blank")) state=46;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=47;
                    else if ((tar[i].group=="special")&&(tar[i].val==")")) state=48;
                    break;
                case 47:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=49;
                    break;
                case 49:
                    if ((tar[i].group=="blank")) state=50;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=51;
                    break;
                case 50:
                    if ((tar[i].group=="blank")) state=50;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=51;
                    break;
                case 51:
                    if ((tar[i].group=="blank")) state=52;
                    else if ((tar[i].group=="split")&&(tar[i].val==",")) state=53;
                    else if ((tar[i].group=="special")&&(tar[i].val==")")) state=48;
                    break;
                case 52:
                    if ((tar[i].group=="blank")) state=52;
                    else if ((tar[i].group=="split")&&(tar[i].val==",")) state=53;
                    else if ((tar[i].group=="special")&&(tar[i].val==")")) state=48;
                    break;
                case 53:
                    if ((tar[i].group=="blank")) state=46;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=47;
                    break;
                case 48:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=54;
                    break;
                case 54:
                    if ((tar[i].group=="blank")) state=55;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=56;
                    break;
                case 55:
                    if ((tar[i].group=="blank")) state=55;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=56;
                    break;
                case 56:
                    if ((tar[i].group=="blank")) state=57;
                    else if ((tar[i].group=="special")&&(tar[i].val=="{")) state=5;
                    break;
                case 57:
                    if ((tar[i].group=="blank")) state=57;
                    else if ((tar[i].group=="special")&&(tar[i].val=="{")) state=5;
                    break;
                case 5:
                    state=4;
                    break;
                case 4:
                    state=3;
                    break;
                case 3:
                    if ((tar[i].group=="special")&&(tar[i].val=="!")) state=58;
                    else if ((tar[i].group=="comment")) state=59;
                    else if ((tar[i].group=="blank")) state=60;
                    else if ((tar[i].group=="LF")) state=61;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=62;
                    else if ((depth==1)&&(tar[i].group=="special")&&(tar[i].val=="}")) state=7;
                    else if ((depth>1)&&(tar[i].group=="special")&&(tar[i].val=="}")&&(tar[i+1].val==";")) state=8;
                    else if ((depth>1)&&(tar[i].group=="special")&&(tar[i].val=="}")) state=63;
                    break;
                case 8:
                    state=7;
                    break;
                case 7:
                    if ((depth==0)) state=2;
                    else if ((depth>0)&&(depth==1)) state=3;
                    break;
                case 59:
                    if ((tar[i].group=="note")) state=64;
                    else state=3;
                    break;
                case 64:
                    state=3;
                    break;
                case 60:
                    state=3;
                    break;
                case 61:
                    state=3;
                    break;
                case 58:
                    if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="local")) state=65;
                    else if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="replace")) state=66;
                    else if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="ctrl")) state=67;
                    break;
                case 65:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=68;
                    break;
                case 68:
                    if ((tar[i].group=="token"||tar[i].group=="string")) state=69;
                    else if ((tar[i].group=="blank")) state=70;
                    break;
                case 70:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=70;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=69;
                    break;
                case 69:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=71;
                    break;
                case 71:
                    if ((tar[i].group=="blank")) state=72;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=73;
                    break;
                case 72:
                    if ((tar[i].group=="blank")) state=72;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=73;
                    break;
                case 73:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=74;
                    break;
                case 74:
                    state=3;
                    break;
                case 66:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=75;
                    break;
                case 75:
                    if ((tar[i].group=="blank")) state=76;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=77;
                    break;
                case 76:
                    if ((tar[i].group=="blank")) state=76;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=77;
                    break;
                case 77:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=78;
                    break;
                case 78:
                    if ((tar[i].group=="blank")) state=79;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=80;
                    break;
                case 79:
                    if ((tar[i].group=="blank")) state=79;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=80;
                    break;
                case 80:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=81;
                    break;
                case 81:
                    state=3;
                    break;
                case 67:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=82;
                    break;
                case 82:
                    if ((tar[i].group=="blank")) state=83;
                    else if ((tar[i].group=="special")&&(tar[i].val=="(")) state=84;
                    break;
                case 83:
                    if ((tar[i].group=="blank")) state=83;
                    else if ((tar[i].group=="special")&&(tar[i].val=="(")) state=84;
                    break;
                case 84:
                    if ((tar[i].group=="blank")) state=85;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=86;
                    break;
                case 85:
                    if ((tar[i].group=="blank")) state=85;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=86;
                    else if ((tar[i].group=="special")&&(tar[i].val==")")) state=87;
                    break;
                case 86:
                    if ((tar[i].group=="blank")) state=85;
                    else if ((tar[i].group=="special")&&(tar[i].val==")")) state=87;
                    break;
                case 87:
                    if ((tar[i].group=="blank")) state=88;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=89;
                    break;
                case 88:
                    if ((tar[i].group=="blank")) state=88;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=89;
                    break;
                case 89:
                    if ((tar[i].group=="blank")) state=90;
                    else if ((tar[i].group=="special")&&(tar[i].val=="{")) state=6;
                    break;
                case 90:
                    if ((tar[i].group=="blank")) state=90;
                    else if ((tar[i].group=="special")&&(tar[i].val=="{")) state=6;
                    break;
                case 6:
                    state=4;
                    break;
                case 63:
                    if ((tar[i].group=="blank")) state=91;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=89;
                    else if ((tar[i].group=="special")&&(tar[i].val=="(")) state=84;
                    break;
                case 91:
                    if ((tar[i].group=="blank")) state=91;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=89;
                    else if ((tar[i].group=="special")&&(tar[i].val=="(")) state=84;
                    break;
                case 92:
                    if ((tar[i].group=="blank")) state=93;
                    break;
                case 62:
                    if ((tar[i].group=="blank")) state=94;
                    else if ((tar[i].group=="split")&&(tar[i].val==";")) state=95;
                    break;
                case 94:
                    if ((tar[i].group=="token"||tar[i].group=="string")) state=62;
                    else if ((tar[i].group=="split")&&(tar[i].val==";")) state=95;
                    else if ((tar[i].group=="assign")) state=96;
                    break;
                case 96:
                    if ((tar[i].group=="blank")) state=97;
                    break;
                case 97:
                    if ((tar[i].group=="blank")) state=97;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=98;
                    else if ((tar[i].group=="special")&&(tar[i].val=="!")) state=99;
                    break;
                case 98:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=95;
                    break;
                case 99:
                    if ((tar[i].group=="token"||tar[i].group=="string")&&(tar[i].val=="local")) state=100;
                    break;
                case 100:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=101;
                    break;
                case 101:
                    if ((tar[i].group=="blank")) state=102;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=103;
                    break;
                case 102:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=102;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=103;
                    break;
                case 103:
                    if ((tar[i].group=="split")&&(tar[i].val==":")) state=104;
                    break;
                case 104:
                    if ((tar[i].group=="blank")) state=105;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=106;
                    break;
                case 105:
                    if ((tar[i].group=="blank")) state=105;
                    else if ((tar[i].group=="token"||tar[i].group=="string")) state=106;
                    break;
                case 106:
                    if ((tar[i].group=="split")&&(tar[i].val==";")) state=107;
                    break;
                case 107:
                    state=3;
                    break;
                case 95:
                    state=3;
            }
            /*ParserReplace_switch_end*/

            if (state==1) {
                throw JSON.stringify({val:tar[i].val,state:state,state_before:state_copy,state_str:sts[state],group:tar[i].group,ttype_str:tar[i].ttype_str,i:tar[i].i,depth:depth})
            }
            if (!(state==2||state==3||state==4)) {
                tar[i].ptype = state; tar[i].ptype_str = sts[state];
                i++;
            }
            if (state==5||state==6) {
                depth++;
            }
            if (state==7||state==8) {
                depth--;
            }
            tar[i-1].plevel = depth;

            while (tar[i-1].group=="string"&&tar[i].group=="string") {
                if (tar[i-1].ttype==9&&tar[i].ttype==8) {
                    throw JSON.stringify({val:tar[i].val,state:state,state_before:state_copy,state_str:sts[state],group:tar[i].group,ttype_str:tar[i].ttype_str,i:tar[i].i,depth:depth})
                }
                tar[i].ptype = state; tar[i].ptype_str = sts[state];
                i++;
            }
        }
        return this;
    }

    buildAST1(): Object {
        let tar = this.tokenarr;
        this.ast1i = 0;
        this.ast1 = [];
        this.replacetoken = {};
        while (this.ast1i<tar.length) {
            let bfi = this.ast1i;
            while (this.tokenarr[this.ast1i].ptype_str!="TLdef.exclam"&&this.tokenarr[this.ast1i].ptype_str!="EOF") {this.ast1i++;}
            this.buildAST1_include();
            this.buildAST1_using();
            this.buildAST1_replace();
            this.buildAST1_global();
            this.buildAST1_fn();
            // console.log(this.tokenarr[i])
            if (tar[this.ast1i].ptype_str=="EOF") {
                break;
            }
            if (bfi==this.ast1i) {
                throw `AST1 error1: ${this.ast1i} ${tar[this.ast1i].ptype_str}`
            }
        }
        console.log(this.ast1)
        return this;
    }
    // @ts-ignore
    buildAST1_getToken(replacetoken): Object {
        if (this.tokenarr[this.ast1i].group=="token") {
            let val = this.tokenarr[this.ast1i].val
            if (val in replacetoken) {
                val = replacetoken[val].val;
            }
            this.tokenarr[this.ast1i].replaced = val;
            // @ts-ignore
            return {type:"token",val:val,txt:this.tokenarr[this.ast1i].val,range:[this.tokenarr[this.ast1i].i+1,this.tokenarr[this.ast1i].i+this.tokenarr[this.ast1i].val.length]};
        }
        else if (this.tokenarr[this.ast1i].group=="string") {
            let bfi = this.ast1i;
            let txt = "";
            while (this.tokenarr[this.ast1i].group=="string") {
                txt += this.tokenarr[this.ast1i].val;
                this.ast1i++;
            }
            let val = txt
            if (val in replacetoken) {
                val = replacetoken[val].val;
            }
            this.tokenarr[this.ast1i-1].replaced = val;
            // @ts-ignore
            return {type:"token",val:val,txt:txt,range:[this.tokenarr[bfi].i+1,this.tokenarr[bfi].i+txt.length]};
        }
    }
    // @ts-ignore
    buildAST1_getToken4replaceOnly(): Object {
        if (this.tokenarr[this.ast1i].group=="token") {
            this.tokenarr[this.ast1i].replaced = this.tokenarr[this.ast1i].val;
            // @ts-ignore
            return {type:"token",val:this.tokenarr[this.ast1i].val,txt:this.tokenarr[this.ast1i].val,range:[this.tokenarr[this.ast1i].i+1,this.tokenarr[this.ast1i].i+this.tokenarr[this.ast1i].val.length]};
        }
        else if (this.tokenarr[this.ast1i].group=="string") {
            let bfi = this.ast1i;
            let txt = "";
            while (this.tokenarr[this.ast1i].group=="string") {
                txt += this.tokenarr[this.ast1i].val;
                this.ast1i++;
            }
            this.tokenarr[this.ast1i-1].replaced = txt;
            // @ts-ignore
            return {type:"token",val:txt,txt:txt,range:[this.tokenarr[bfi].i+1,this.tokenarr[bfi].i+txt.length]};
        }
    }
    buildAST1_skipTokenTo(ptype_str:string): void {
        while (this.tokenarr[this.ast1i].ptype_str!=ptype_str) {this.ast1i++;}
    }
    buildAST1_include(): void {
        if (this.tokenarr[this.ast1i].ptype_str=="TLdef.exclam"&&this.tokenarr[this.ast1i+1].ptype_str=="TLdef.include") {
            this.ast1i++;
            let obj = {type: "include",filename:{}}
            this.buildAST1_skipTokenTo("TLdef.include.filename");
            obj.filename = this.buildAST1_getToken(this.replacetoken);
            this.ast1.push(obj)
            this.buildAST1_skipTokenTo("TLdef.include.EOS");
        }
    }
    buildAST1_using(): void {
        if (this.tokenarr[this.ast1i].ptype_str=="TLdef.exclam"&&this.tokenarr[this.ast1i+1].ptype_str=="TLdef.using") {
            this.ast1i++;
            let obj = {type: "using",filename:{}}
            this.buildAST1_skipTokenTo("TLdef.using.filename");
            obj.filename = this.buildAST1_getToken(this.replacetoken);
            this.ast1.push(obj)
            this.buildAST1_skipTokenTo("TLdef.using.EOS");
        }
    }
    buildAST1_replace(): void {
        if (this.tokenarr[this.ast1i].ptype_str=="TLdef.exclam"&&this.tokenarr[this.ast1i+1].ptype_str=="TLdef.replace") {
            this.ast1i++;
            let obj = {type: "replace",name:{},val:{}}
            this.buildAST1_skipTokenTo("TLdef.replace.defname");
            obj.name = this.buildAST1_getToken4replaceOnly();
            this.buildAST1_skipTokenTo("TLdef.replace.defval");
            obj.val = this.buildAST1_getToken4replaceOnly();
            this.ast1.push(obj)
            this.buildAST1_skipTokenTo("TLdef.replace.EOS");
            // @ts-ignore
            this.replacetoken[obj.name.val] = {val: obj.val.val, range: obj.val.range};
        }
    }
    buildAST1_global(): void {
        if (this.tokenarr[this.ast1i].ptype_str=="TLdef.exclam"&&this.tokenarr[this.ast1i+1].ptype_str=="TLdef.global") {
            this.ast1i++;
            let obj = {type: "global",vartype:{},varname:{}}
            this.buildAST1_skipTokenTo("TLdef.global.deftype");
            obj.vartype = this.buildAST1_getToken(this.replacetoken);
            this.buildAST1_skipTokenTo("TLdef.global.defname");
            obj.varname = this.buildAST1_getToken(this.replacetoken);
            this.ast1.push(obj)
            this.buildAST1_skipTokenTo("TLdef.global.EOS");
        }
    }
    buildAST1_fn(): void {
        if (this.tokenarr[this.ast1i].ptype_str=="TLdef.exclam"&&this.tokenarr[this.ast1i+1].ptype_str=="TLdef.func") {
            this.ast1i++;
            let obj = {type: "fn",rettype:{},args:[],fnname:{},block:[]}
            this.buildAST1_skipTokenTo("TLdef.func.rettype");
            obj.rettype = this.buildAST1_getToken(this.replacetoken);
            while (this.tokenarr[this.ast1i].ptype_str!="TLdef.func.rparen") {
                if (this.tokenarr[this.ast1i].ptype_str=="TLdef.func.args.argstype") {
                    let argobj = {argtype: this.buildAST1_getToken(this.replacetoken),argname:{}}
                    this.buildAST1_skipTokenTo("TLdef.func.args.defname");
                    argobj.argname = this.buildAST1_getToken(this.replacetoken);
                    // @ts-ignore
                    obj.args.push(argobj);
                }
                this.ast1i++;
            }
            this.buildAST1_skipTokenTo("TLdef.func.defname");
            obj.fnname = this.buildAST1_getToken(this.replacetoken);

            // @ts-ignore
            obj.block = this.buildAST1_block(structuredClone(this.replacetoken));
            this.ast1.push(obj)
        }
    }
    buildAST1_block(lreplacetoken): Array<Object> {
        let blockroot:Array<Object> = [];
        let depth:number = 0;
        while (this.ast1i<this.tokenarr.length) {
            let bfi = this.ast1i;
            while (this.tokenarr[this.ast1i].ptype_str!="Block.stat.expr.token"&&this.tokenarr[this.ast1i].ptype_str!="Block.exclam.decl"
                    &&this.tokenarr[this.ast1i].ptype_str!="TLdef.func.lbracket"&&this.tokenarr[this.ast1i].ptype_str!="Block.exclam.lbracket"&&this.tokenarr[this.ast1i].ptype_str!="Block.exit.ctrl"&&this.tokenarr[this.ast1i].ptype_str!="Block.exit_"&&this.tokenarr[this.ast1i].ptype_str!="Block.exit") {this.ast1i++;}
            this.buildAST1_block_expr(blockroot,lreplacetoken);
            this.buildAST1_block_decl(blockroot,lreplacetoken);
            if (this.tokenarr[this.ast1i].ptype_str=="TLdef.func.lbracket"||this.tokenarr[this.ast1i].ptype_str=="Block.exclam.lbracket") { depth++; this.ast1i++; }
            if (this.tokenarr[this.ast1i].ptype_str=="Block.exit.ctrl"||this.tokenarr[this.ast1i].ptype_str=="Block.exit_"||this.tokenarr[this.ast1i].ptype_str=="Block.exit") {
                depth--;
                this.ast1i++;
                if (depth==0) {
                    return blockroot;
                }
            }
            //console.log("depth",this.ast1i,depth)
            if (bfi==this.ast1i) {
                //return blockroot; // tmp
                throw `AST1 error2: ${this.ast1i} ${this.tokenarr[this.ast1i].ptype_str}`
            }
        }
        return blockroot;
    }
    buildAST1_block_expr(block,lreplacetoken): void {
        if (this.tokenarr[this.ast1i].ptype_str=="Block.stat.expr.token") {
            let obj = {type:"stat",expr:[],assign:{assign:false,define:false,vartype:"",varname:""}}
            while (this.tokenarr[this.ast1i].ptype_str!="Block.stat.assign"&&this.tokenarr[this.ast1i].ptype_str!="Block.stat.end") {
                if (this.tokenarr[this.ast1i].ptype_str=="Block.stat.expr.token") {
                    // @ts-ignore
                    obj.expr.push(this.buildAST1_getToken(lreplacetoken));
                }
                this.ast1i++;
            }
            if (this.tokenarr[this.ast1i].ptype_str=="Block.stat.assign") {
                obj.assign.assign = true;
                while (this.tokenarr[this.ast1i].ptype_str!="Block.stat.exclam.local"&&this.tokenarr[this.ast1i].ptype_str!="Block.stat.assignvar") {this.ast1i++;}
                if (this.tokenarr[this.ast1i].ptype_str=="Block.stat.exclam.local") {
                    obj.assign.define = true;
                    this.buildAST1_skipTokenTo("Block.stat.exclam.local.deftype");
                    // @ts-ignore
                    obj.assign.vartype = this.buildAST1_getToken(lreplacetoken);
                    this.buildAST1_skipTokenTo("Block.stat.exclam.local.defname");
                    // @ts-ignore
                    obj.assign.varname = this.buildAST1_getToken(lreplacetoken);
                }
                else {
                    // @ts-ignore
                    obj.assign.varname = this.buildAST1_getToken(lreplacetoken);
                }
            }
           // console.log(obj)
            block.push(obj)
        }
    }
    buildAST1_block_decl(block,lreplacetoken): void {
        if (this.tokenarr[this.ast1i].ptype_str=="Block.exclam.decl"&&this.tokenarr[this.ast1i+1].ptype_str=="Block.exclam.ctrl") {
            this.ast1i++;
            let obj = {type: "ctrl",blocks:[]}
            while (this.ast1i<this.tokenarr.length) {
                let bfi = this.ast1i;
                while (this.tokenarr[this.ast1i].ptype_str!="Block.exclam.ctrl.lparen"&&this.tokenarr[this.ast1i].ptype_str!="Block.exclam.ctrl.type"&&this.tokenarr[this.ast1i].ptype_str!="Block.exit") {this.ast1i++;}
                if (this.tokenarr[this.ast1i].ptype_str=="Block.exclam.ctrl.lparen") {
                    //console.log("cond")
                    let block = {condition:[],type:{},block:[]}
                    while (this.tokenarr[this.ast1i].ptype_str!="Block.exclam.ctrl.rparen") {
                        if (this.tokenarr[this.ast1i].ptype_str=="Block.exclam.ctrl.cond.token") {
                            // @ts-ignore
                            block.condition.push(this.buildAST1_getToken(lreplacetoken));
                        }
                        this.ast1i++;
                    }
                    while (this.tokenarr[this.ast1i].ptype_str!="Block.exclam.ctrl.type") {this.ast1i++;}
                    block.type = this.buildAST1_getToken(lreplacetoken);
                    // @ts-ignore
                    block.block = this.buildAST1_block(structuredClone(lreplacetoken));
                    //console.log("bfbl",this.ast1i)
                    //console.log("block",block)
                    // @ts-ignore
                    obj.blocks.push(block);
                    //console.log("endblock",this.ast1i)
                }
                else if (this.tokenarr[this.ast1i].ptype_str=="Block.exclam.ctrl.type") {
                   // console.log("block")
                    let block = {condition:[],type:{},block:[]}
                    while (this.tokenarr[this.ast1i].ptype_str!="Block.exclam.ctrl.type") {this.ast1i++;}
                    block.type = this.buildAST1_getToken(lreplacetoken);
                    // @ts-ignore
                    block.block = this.buildAST1_block(structuredClone(lreplacetoken));
                    // @ts-ignore
                    obj.blocks.push(block);
                    //console.log(this.ast1i)
                }
                else {
                    //console.log("exit")
                    this.ast1i++;
                    block.push(obj)
                    return
                }
                if (bfi==this.ast1i) {
                    throw `AST1 error3: ${this.ast1i} ${this.tokenarr[this.ast1i].ptype_str}`
                }
            }
        }
        else if (this.tokenarr[this.ast1i].ptype_str=="Block.exclam.decl"&&this.tokenarr[this.ast1i+1].ptype_str=="Block.exclam.local") {
            this.ast1i++;
            let obj = {type:"local",vartype:"",varname:""};
            this.buildAST1_skipTokenTo("Block.exclam.local.deftype");
            // @ts-ignore
            obj.vartype = this.buildAST1_getToken(lreplacetoken);
            this.buildAST1_skipTokenTo("Block.exclam.local.defname");
            // @ts-ignore
            obj.varname = this.buildAST1_getToken(lreplacetoken);
            block.push(obj)
        }
        else if (this.tokenarr[this.ast1i].ptype_str=="Block.exclam.decl"&&this.tokenarr[this.ast1i+1].ptype_str=="Block.exclam.replace") {
            this.ast1i++;
            let obj = {type: "replace",name:{},val:{}}
            this.buildAST1_skipTokenTo("Block.exclam.replace.defname");
            obj.name = this.buildAST1_getToken4replaceOnly();
            this.buildAST1_skipTokenTo("Block.exclam.replace.defval");
            obj.val = this.buildAST1_getToken4replaceOnly();
            block.push(obj)
            // @ts-ignore
            lreplacetoken[obj.name.val] = {val: obj.val.val, range: obj.val.range};
        }
    }
}

// @ts-ignore
if ((typeof require!="undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
    // @ts-ignore
    code_res.parse()
}