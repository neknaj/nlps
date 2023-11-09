class NLPtool {
    private code:string;
    private filename:string;
    private fRead:Function;
    tokenizerstates:Array<string>;
    parserstates:Array<string>;
    tokenarr:Array<Record<string,string|number>>;
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
    tokenizeerror(message:string,i:number): object {
        // @ts-ignore
        let error = new Error(message,this.filename);
        error.name = "NLP_TokenizeError";
        let LineAndCol:object = this.getLineAndCol(i);
        // @ts-ignore
        error.lineNumber = LineAndCol.line; error.columnNumber = LineAndCol.col;
        //error.stack = ""
        return error;
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
            "comment.note": "comment",
            "comment.blockend": "comment",
            "comment.blockcomment": "comment",
            "string.escape1": "string",
            "string.end": "string",
            "string.char": "string",
            "string.escape2": "string",
            "lassign_": "assign",
            "rassign_": "assign",
        }
        this.parserstates = ["Error","TopLevel","TLDefinition.exclam","TL.comment","TL.blank","TL.LF","TLDefinition.include","TLDefinition.using","TLDefinition.replace","TLDefinition.global","TLDefinition.func","TLDefinition.include.colon1","TLDefinition.include.blank1","TLDefinition.include.filename","TLDefinition.include.EOS","TLDefinition.using.colon1","TLDefinition.using.blank1","TLDefinition.using.filename","TLDefinition.using.EOS","TLDefinition.replace.colon1","TLDefinition.replace.blank1","TLDefinition.replace.defname","TLDefinition.replace.colon2","TLDefinition.replace.blank2","TLDefinition.replace.defval","TLDefinition.replace.EOS","TLDefinition.global.colon1","TLDefinition.global.blank1","TLDefinition.global.deftype","TLDefinition.global.colon2","TLDefinition.global.blank2","TLDefinition.global.defname","TLDefinition.global.EOS"]
        var sts = this.tokenizerstates;
        while (i<this.code.length) {
            {

                switch(state){
                    case 1:
                        if ((tar[i].group=="special")&&(tar[i].val=="!")) state=2;
                        else if ((tar[i].group=="comment")) state=3;
                        else if ((tar[i].group=="split")&&(tar[i].val==" ")) state=4;
                        else if ((tar[i].group=="LF")) state=5;
                        else state=0;
                        break;
                    case 3:
                        state=1;
                        break;
                    case 4:
                        state=1;
                        break;
                    case 5:
                        state=1;
                        break;
                    case 2:
                        if ((tar[i].group=="token")&&(tar[i].val=="include")) state=6;
                        else if ((tar[i].group=="token")&&(tar[i].val=="using")) state=7;
                        else if ((tar[i].group=="token")&&(tar[i].val=="replace")) state=8;
                        else if ((tar[i].group=="token")&&(tar[i].val=="global")) state=9;
                        else if ((tar[i].group=="token")&&(tar[i].val=="fn")) state=10;
                        else state=0;
                        break;
                    case 6:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=11;
                        else state=0;
                        break;
                    case 11:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=12;
                        else if ((tar[i].group=="token")) state=13;
                        break;
                    case 12:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=12;
                        else if ((tar[i].group=="token")) state=13;
                        else state=0;
                        break;
                    case 13:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=14;
                        else state=0;
                        break;
                    case 14:
                        state=1;
                        break;
                    case 7:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=15;
                        else state=0;
                        break;
                    case 15:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=16;
                        else if ((tar[i].group=="token")) state=17;
                        else state=0;
                        break;
                    case 16:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=16;
                        else if ((tar[i].group=="token")) state=17;
                        else state=0;
                        break;
                    case 17:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=18;
                        else state=0;
                        break;
                    case 18:
                        state=1;
                        break;
                    case 8:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=19;
                        else state=0;
                        break;
                    case 19:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=20;
                        else if ((tar[i].group=="token")) state=21;
                        else state=0;
                        break;
                    case 20:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=20;
                        else if ((tar[i].group=="token")) state=21;
                        else state=0;
                        break;
                    case 21:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=22;
                        else state=0;
                        break;
                    case 22:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=23;
                        else if ((tar[i].group=="token")) state=24;
                        else state=0;
                        break;
                    case 23:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=23;
                        else if ((tar[i].group=="token")) state=24;
                        break;
                    case 24:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=25;
                        else state=0;
                        break;
                    case 25:
                        state=1;
                        break;
                    case 9:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=26;
                        else state=0;
                        break;
                    case 26:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=27;
                        else if ((tar[i].group=="token")) state=28;
                        else state=0;
                        break;
                    case 27:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=27;
                        else if ((tar[i].group=="token")) state=28;
                        else state=0;
                        break;
                    case 28:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=29;
                        else state=0;
                        break;
                    case 29:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=30;
                        else if ((tar[i].group=="token")) state=31;
                        else state=0;
                        break;
                    case 30:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=30;
                        else if ((tar[i].group=="token")) state=31;
                        else state=0;
                        break;
                    case 31:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=32;
                        else state=0;
                        break;
                    case 32:
                        state=1;
                }

            }

            if (state!=0) {
                let LineAndCol:object = this.getLineAndCol(i);

                //console.log(i,this.code[i].replace(/\n/g,"\\n"),sts[state],state)
                if (tar.length==0||state!=tar[tar.length-1].type||state==1||state==2||state==3) {
                    // @ts-ignore
                    tar.push({type:state,type_str:sts[state],val:this.code[i],i:i,line:LineAndCol.line,col:LineAndCol.col,group:this.tokengroup[sts[state]]});
                }
                else {
                    tar[tar.length-1].val += this.code[i];
                }
                //console.table(tar)
                i++;
            }
        }
        console.table(tar)
        return this;
    }

    parse(): Object {
        var state:number = 1;
        let i:number = 0;
        let tar = this.tokenarr;
        this.parserstates = ["Error","TopLevel","TLDefinition.exclam","TL.comment","TL.blank","TL.LF","TLDefinition.include","TLDefinition.using","TLDefinition.replace","TLDefinition.global","TLDefinition.func","TLDefinition.include.colon1","TLDefinition.include.blank1","TLDefinition.include.filename","TLDefinition.include.EOS","TLDefinition.using.colon1","TLDefinition.using.blank1","TLDefinition.using.filename","TLDefinition.using.EOS","TLDefinition.replace.colon1","TLDefinition.replace.blank1","TLDefinition.replace.defname","TLDefinition.replace.colon2","TLDefinition.replace.blank2","TLDefinition.replace.defval","TLDefinition.replace.EOS","TLDefinition.global.colon1","TLDefinition.global.blank1","TLDefinition.global.deftype","TLDefinition.global.colon2","TLDefinition.global.blank2","TLDefinition.global.defname","TLDefinition.global.EOS"]
        var sts = this.parserstates;
        while (i<tar.length) {
            {
                switch(state){
                    case 1:
                        if ((tar[i].group=="special")&&(tar[i].val=="!")) state=2;
                        else if ((tar[i].group=="comment")) state=3;
                        else if ((tar[i].group=="split")&&(tar[i].val==" ")) state=4;
                        else if ((tar[i].group=="LF")) state=5;
                        else state=0;
                        break;
                    case 3:
                        state=1;
                        break;
                    case 4:
                        state=1;
                        break;
                    case 5:
                        state=1;
                        break;
                    case 2:
                        if ((tar[i].group=="token")&&(tar[i].val=="include")) state=6;
                        else if ((tar[i].group=="token")&&(tar[i].val=="using")) state=7;
                        else if ((tar[i].group=="token")&&(tar[i].val=="replace")) state=8;
                        else if ((tar[i].group=="token")&&(tar[i].val=="global")) state=9;
                        else if ((tar[i].group=="token")&&(tar[i].val=="fn")) state=10;
                        else state=0;
                        break;
                    case 6:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=11;
                        else state=0;
                        break;
                    case 11:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=12;
                        else if ((tar[i].group=="token")) state=13;
                        break;
                    case 12:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=12;
                        else if ((tar[i].group=="token")) state=13;
                        else state=0;
                        break;
                    case 13:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=14;
                        else state=0;
                        break;
                    case 14:
                        state=1;
                        break;
                    case 7:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=15;
                        else state=0;
                        break;
                    case 15:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=16;
                        else if ((tar[i].group=="token")) state=17;
                        else state=0;
                        break;
                    case 16:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=16;
                        else if ((tar[i].group=="token")) state=17;
                        else state=0;
                        break;
                    case 17:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=18;
                        else state=0;
                        break;
                    case 18:
                        state=1;
                        break;
                    case 8:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=19;
                        else state=0;
                        break;
                    case 19:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=20;
                        else if ((tar[i].group=="token")) state=21;
                        else state=0;
                        break;
                    case 20:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=20;
                        else if ((tar[i].group=="token")) state=21;
                        else state=0;
                        break;
                    case 21:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=22;
                        else state=0;
                        break;
                    case 22:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=23;
                        else if ((tar[i].group=="token")) state=24;
                        else state=0;
                        break;
                    case 23:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=23;
                        else if ((tar[i].group=="token")) state=24;
                        break;
                    case 24:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=25;
                        else state=0;
                        break;
                    case 25:
                        state=1;
                        break;
                    case 9:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=26;
                        else state=0;
                        break;
                    case 26:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=27;
                        else if ((tar[i].group=="token")) state=28;
                        else state=0;
                        break;
                    case 27:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=27;
                        else if ((tar[i].group=="token")) state=28;
                        else state=0;
                        break;
                    case 28:
                        if ((tar[i].group=="split")&&(tar[i].val==":")) state=29;
                        else state=0;
                        break;
                    case 29:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=30;
                        else if ((tar[i].group=="token")) state=31;
                        else state=0;
                        break;
                    case 30:
                        if ((tar[i].group=="split")&&(tar[i].val==" ")) state=30;
                        else if ((tar[i].group=="token")) state=31;
                        else state=0;
                        break;
                    case 31:
                        if ((tar[i].group=="split")&&(tar[i].val==";")) state=32;
                        else state=0;
                        break;
                    case 32:
                        state=1;
                }
                
                
                
            }

            if (state==0) {
                throw JSON.stringify({val:tar[i].val,state:state,state_str:sts[state],group:tar[i].group,type_str:tar[i].type_str,i:tar[i].i})
            }
            if (state!=1) {
                console.log({val:tar[i].val,state:state,state_str:sts[state],group:tar[i].group,type_str:tar[i].type_str,i:tar[i].i})
                i++;
            }
        }
        return this;
    }
}

// @ts-ignore
if ((typeof require!="undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
    // @ts-ignore
    code_res.parse()
}