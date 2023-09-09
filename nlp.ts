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
    tokenizeerror(message:string): object {
        // @ts-ignore
        let error = new Error(message,this.filename);
        error.name = "NLP_TokenizeError";
        // @ts-ignore
        error.lineNumber = 5;
        // @ts-ignore
        error.columnNumber = 10;
        return error;
    }
    tokenize(): void {
        let tokenarr:Array<object> = [];
        let blocknest:number = 0;
        let state:"toplevel"|"import_dec"|"import_blank"|"import_file"|"import_semicolon"|"toplevel_dec"|"global_var_dectype"|"fn_dec_rettype" = "toplevel";
        let i:number = 0;
        let nowtoken:string = "";
        while (i<this.code.length) {
            switch(state) {
                case "toplevel":
                    if (this.code[i]=="#") {
                        state = "import_dec";
                        nowtoken += this.code[i];
                        tokenarr.push({type:"import_dec",val:nowtoken,index:i});
                        nowtoken = "";
                    }
                    if (this.code[i]=="!") {
                        state = "toplevel_dec";
                        nowtoken += this.code[i];
                        tokenarr.push({type:"toplevel_dec",val:nowtoken,index:i});
                        nowtoken = "";
                    }
                    break;
                case "import_dec":
                    if (this.code[i]==" ") {
                        state = "import_blank";
                        tokenarr.push({type:"import_type",val:nowtoken,index:i});
                        if (nowtoken!="include"&&nowtoken!="using") {
                            throw this.tokenizeerror(`インポートのタイプは"include"か"using"である必要があります`);
                        }
                        nowtoken = "";
                    }
                    else {
                        nowtoken += this.code[i];
                    }
                    break;
                case "import_blank":
                    if (this.code[i]!=" ") {
                        i--;
                        state = "import_file";
                    }
                    break;
                case "import_file":
                    if (this.code[i]==";") {
                        state = "import_semicolon";
                        tokenarr.push({type:"import_file",val:nowtoken,index:i});
                        nowtoken = "";
                    }
                    else if (this.code[i]=="\n") {
                        throw this.tokenizeerror(`文の中に改行を含めることはできません`);
                    }
                    else if (this.code[i]==" ") {
                        throw this.tokenizeerror(`ファイル名に空白を含めることはできません`);
                    }
                    else {
                        nowtoken += this.code[i];
                    }
                    break;
                case "import_semicolon":
                    if (this.code[i]=="\n") {
                        state = "toplevel";
                    }
                    else if (this.code[i]==" ") {
                    }
                    else {
                        throw this.tokenizeerror(`インポートのセミコロンの後ろは空白のみが許されます`);
                    }
                    break;
                case "toplevel_dec":
                    if (this.code[i]==" ") {
                        throw this.tokenizeerror(`宣言の直後は種類である必要があります`);
                    }
                    else if (this.code[i]==":") {
                        tokenarr.push({type:"toplevel_dectype",val:nowtoken,index:i});
                        if (nowtoken=="global") {
                            state = "global_var_dectype";
                        }
                        else if (nowtoken=="fn") {
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
    }
}

{
var parsed = new NLPtool("./test4.nlp");
console.log(parsed)
}