class NLPtool {
    private code:string;
    private filename:string;
    private fRead:Function;
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
        this.tokenize();
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
    tokenize(): void {
        var tokenarr: Array<object> = [{type:"SOF",val:""}];
        var state = "TopLevel";
        let i:number = 0;
        console.log(tokenarr)
        const space = " ";
        const sharp = "#";
        const exclam = "!";
        const semicolon = ";";
        const LF = "\n";
        while (i<this.code.length) {
            switch(state) {
                case "TopLevel":
                    if (this.code[i]=="#") {
                        state = "ImportStat";
                    }
                    if (this.code[i]=="!") {
                        state = "toplevel_dec";
                    }
                    break;
                case "ImportStat":
                    if (this.code[i]==" ") {
                        throw this.tokenizeerror(`インポート宣言の"!"の直後に空白を置くことはできません`,i);
                    }
                    else {
                        state = "ImportStat.Declaration";
                    }
                    break;
                case "ImportStat.Declaration":
                    if (this.code[i]==" ") {
                        state = "ImportStat.Blank";
                    }
                    // @ts-ignore
                    else if (tokenarr[tokenarr.length-1].val=="include"||tokenarr[tokenarr.length-1].val=="using") {
                        throw this.tokenizeerror(`インポートのタイプは"include"か"using"のみです`,i);
                    }
                    break;
                case "ImportStat.Blank":
                    if (this.code[i]!=";") {
                        throw this.tokenizeerror(`インポートするファイルの名前がありません`,i);
                    }
                    else if (this.code[i]!=" ") {
                        state = "ImportStat.Filename";
                    }
                    break;
                case "ImportStat.Filename":
                    if (this.code[i]==" ") {
                        throw this.tokenizeerror(`インポートするファイルの名前に空白は使えません`,i);
                    }
                    else if (this.code[i]==";") {
                        state = "ImportStat.EOStat";
                    }
                    break;
                case "ImportStat.EOStat":
                    if (this.code[i]==" ") {
                        state = "ImportStat.AfterBlank";
                    }
                    else if (this.code[i]=="\n") {
                        state = "ImportStat.EOL";
                    }
                    else {
                        throw this.tokenizeerror(`インポート文の後ろには空白以外は許されません`,i);
                    }
                    break;
                case "ImportStat.AfterBlank":
                    if (this.code[i]==" ") {
                    }
                    else if (this.code[i]=="\n") {
                        state = "ImportStat.EOL";
                    }
                    else {
                        throw this.tokenizeerror(`インポート文の後ろには空白以外は許されません`,i);
                    }
                    break;
                case "ImportStat.EOL":
                    state = "TopLevel";
                    i--;
                    break;
            }
            if (state!="TopLevel") {
                console.log(i,this.code[i].replace(/\n/g,"\\n"),state)
                // @ts-ignore
                if (state!=tokenarr[tokenarr.length-1].type) {
                    tokenarr.push({type:state,val:this.code[i],i:i});
                }
                else {
                    // @ts-ignore
                    tokenarr[tokenarr.length-1].val += this.code[i];
                }
                //console.table(tokenarr)
            }
            i++;
        }
        console.table(tokenarr)
    }
}

{
var parsed = new NLPtool("http://127.0.0.1:5500/test4.nlp");
console.log(parsed)
}