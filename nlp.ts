class NLPtool {
    private code:string;
    private filename:string;
    private fRead:Function;
    tokenizerstates:Array<string>;
    tokenarr:Array<Record<string,string|number>>;
    constructor(filename: string) {
        this.filename = filename;
        { // Define the fRead function
            if (typeof require!="undefined") {
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
        console.log(this.code)
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
        console.log(tar)
        this.tokenizerstates = ["start","LF","comment.LF","split","string.space","lassign","rassign","special","comment.start","string.start","token","comment.notestart","comment.blockstart","comment.linecomment","comment.notebeforeblank","comment.note","comment.blockend","comment.blockcomment","string.escape1","string.end","string.char","string.escape2","lassign_","rassign_"]
        var sts = this.tokenizerstates;
        while (i<this.code.length) {
            {

                switch(state){
                    case 0:
                        if ((tc[i]==":")&&(tc[i+1]==">")) state=5;
                        else if ((tc[i]=="<")&&(tc[i+1]==":")) state=6;
                        else if ((tc[i]==" ")||(tc[i]==":")||(tc[i]==".")||(tc[i]==",")||(tc[i]==";")) state=3;
                        else if ((tc[i]=="!")||(tc[i]=="(")||(tc[i]==")")||(tc[i]=="{")||(tc[i]=="}")) state=7;
                        else if ((tc[i]=="#")) state=8;
                        else if ((tc[i]=="\n")) state=1;
                        else if ((tc[i]=="\"")) state=9;
                        else state=10;
                        break;
                    case 8:
                        if ((tc[i]==":")) state=11;
                        else if ((tc[i]=="*")) state=12;
                        else if ((tc[i]=="\n")) state=1;
                        else state=13;
                        break;
                    case 11:
                        if ((tc[i]==" ")) state=14;
                        else if ((tc[i]!="\n")) state=15;
                        else if ((tc[i]=="\n")) state=1;
                        break;
                    case 14:
                        if ((tc[i]!="\n")) state=15;
                        else if ((tc[i]=="\n")) state=1;
                        break;
                    case 15:
                        if ((tc[i]!="\n")) state=15;
                        else if ((tc[i]=="\n")) state=1;
                        break;
                    case 13:
                        if ((tc[i]!="\n")) state=13;
                        else if ((tc[i]=="\n")) state=1;
                        break;
                    case 12:
                        if ((tc[i]=="#")) state=16;
                        else if ((tc[i]!="#")&&(tc[i]!="\n")) state=17;
                        else if ((tc[i]=="\n")) state=2;
                        break;
                    case 17:
                        if ((tc[i]=="#")) state=16;
                        else if ((tc[i]!="#")&&(tc[i]!="\n")) state=17;
                        else if ((tc[i]=="\n")) state=2;
                        break;
                    case 2:
                        if ((tc[i]=="#")) state=16;
                        else if ((tc[i]!="#")&&(tc[i]!="\n")) state=17;
                        else if ((tc[i]=="\n")) state=2;
                        break;
                    case 9:
                        if ((tc[i]=="\\")) state=18;
                        else if ((tc[i]=="\n")) state=1;
                        else if ((tc[i]=="\"")) state=19;
                        else if ((tc[i]==" ")) state=4;
                        else state=20;
                        break;
                    case 20:
                        if ((tc[i]=="\n")) state=1;
                        else if ((tc[i]=="\\")) state=18;
                        else if ((tc[i]=="\"")) state=19;
                        else if ((tc[i]==" ")) state=4;
                        else state=20;
                        break;
                    case 4:
                        if ((tc[i]=="\n")) state=1;
                        else if ((tc[i]=="\\")) state=18;
                        else if ((tc[i]=="\"")) state=19;
                        else if ((tc[i]==" ")) state=4;
                        else state=20;
                        break;
                    case 18:
                        if ((tc[i]=="\n")) state=1;
                        else state=21;
                        break;
                    case 21:
                        if ((tc[i]=="\n")) state=1;
                        else if ((tc[i]=="\"")) state=19;
                        else if ((tc[i]=="\\")) state=18;
                        else if ((tc[i]==" ")) state=4;
                        else state=20;
                        break;
                    case 5:
                        state=22;
                        break;
                    case 6:
                        state=23;
                        break;
                    case 3:
                        state=0;
                        break;
                    case 7:
                        state=0;
                        break;
                    case 10:
                        state=0;
                        break;
                    case 1:
                        state=0;
                        break;
                    case 16:
                        state=0;
                        break;
                    case 19:
                        state=0;
                        break;
                    case 22:
                        state=0;
                        break;
                    case 23:
                        state=0;
                }

            }

            if (state!=0) {
                let LineAndCol:object = this.getLineAndCol(i);

                //console.log(i,this.code[i].replace(/\n/g,"\\n"),sts[state],state)
                if (tar.length==0||state!=tar[tar.length-1].type||state==1||state==2||state==3) {
                    // @ts-ignore
                    tar.push({type:state,type_str:sts[state],val:this.code[i],i:i,line:LineAndCol.line,col:LineAndCol.col});
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
}


if ((typeof require!="undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
}