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
        this.tokenizerstates = ["start","LF","comment.LF","split","special","comment.start","string.start","token","comment.blockstart","comment.linecomment","comment.blockend","comment.blockcomment"]
        var sts = this.tokenizerstates;
        while (i<this.code.length) {
            {

                if (false) {}
                else if (state==0 &&(((tc[i]==" "))||((tc[i]==":"))||((tc[i]==","))||((tc[i]==","))||((tc[i]==";")))) state=3;
                else if (state==0 &&(((tc[i]=="!"))||((tc[i]=="("))||((tc[i]==")"))||((tc[i]=="{"))||((tc[i]=="}")))) state=4;
                else if (state==0 &&(((tc[i]=="#")))) state=5;
                else if (state==0 &&(((tc[i]=="\n")))) state=1;
                else if (state==0 &&(((tc[i]=="\"")))) state=6;
                else if (state==0 ) state=7;
                else if (state==3 &&(((tc[i]==" "))||((tc[i]==":"))||((tc[i]==","))||((tc[i]==","))||((tc[i]==";")))) state=3;
                else if (state==3 &&(((tc[i]=="!"))||((tc[i]=="("))||((tc[i]==")"))||((tc[i]=="{"))||((tc[i]=="}")))) state=4;
                else if (state==3 &&(((tc[i]=="#")))) state=5;
                else if (state==3 &&(((tc[i]=="\"")))) state=6;
                else if (state==3 &&(((tc[i]=="\n")))) state=1;
                else if (state==3 ) state=7;
                else if (state==4 &&(((tc[i]==" "))||((tc[i]==":"))||((tc[i]==","))||((tc[i]==","))||((tc[i]==";")))) state=3;
                else if (state==4 &&(((tc[i]=="!"))||((tc[i]=="("))||((tc[i]==")"))||((tc[i]=="{"))||((tc[i]=="}")))) state=4;
                else if (state==4 &&(((tc[i]=="#")))) state=5;
                else if (state==4 &&(((tc[i]=="\"")))) state=6;
                else if (state==4 &&(((tc[i]=="\n")))) state=1;
                else if (state==4 ) state=7;
                else if (state==7 &&(((tc[i]==" "))||((tc[i]==":"))||((tc[i]==","))||((tc[i]==","))||((tc[i]==";")))) state=3;
                else if (state==7 &&(((tc[i]=="!"))||((tc[i]=="("))||((tc[i]==")"))||((tc[i]=="{"))||((tc[i]=="}")))) state=4;
                else if (state==7 &&(((tc[i]=="#")))) state=5;
                else if (state==7 &&(((tc[i]=="\"")))) state=6;
                else if (state==7 &&(((tc[i]=="\n")))) state=1;
                else if (state==7 ) state=7;
                else if (state==1 &&(((tc[i]==" "))||((tc[i]==":"))||((tc[i]==","))||((tc[i]==","))||((tc[i]==";")))) state=3;
                else if (state==1 &&(((tc[i]=="!"))||((tc[i]=="("))||((tc[i]==")"))||((tc[i]=="{"))||((tc[i]=="}")))) state=4;
                else if (state==1 &&(((tc[i]=="#")))) state=5;
                else if (state==1 &&(((tc[i]=="\"")))) state=6;
                else if (state==1 &&(((tc[i]=="\n")))) state=1;
                else if (state==1 ) state=7;
                else if (state==5 &&(((tc[i]=="*")))) state=8;
                else if (state==5 &&((!(tc[i]=="*")))) state=9;
                else if (state==9 &&((!(tc[i]=="\n")))) state=9;
                else if (state==9 &&(((tc[i]=="\n")))) state=1;
                else if (state==8 &&(((tc[i]=="#")))) state=10;
                else if (state==8 &&((!(tc[i]=="#"))&&(!(tc[i]=="\n")))) state=11;
                else if (state==8 &&(((tc[i]=="\n")))) state=2;
                else if (state==11 &&(((tc[i]=="#")))) state=10;
                else if (state==11 &&((!(tc[i]=="#"))&&(!(tc[i]=="\n")))) state=11;
                else if (state==11 &&(((tc[i]=="\n")))) state=2;
                else if (state==2 &&(((tc[i]=="#")))) state=10;
                else if (state==2 &&((!(tc[i]=="#"))&&(!(tc[i]=="\n")))) state=11;
                else if (state==2 &&(((tc[i]=="\n")))) state=2;
                else if (state==10 &&(((tc[i]==" "))||((tc[i]==":"))||((tc[i]==","))||((tc[i]==","))||((tc[i]==";")))) state=3;
                else if (state==10 &&(((tc[i]=="!"))||((tc[i]=="("))||((tc[i]==")"))||((tc[i]=="{"))||((tc[i]=="}")))) state=4;
                else if (state==10 &&(((tc[i]=="#")))) state=5;
                else if (state==10 &&(((tc[i]=="\"")))) state=6;
                else if (state==10 &&(((tc[i]=="\n")))) state=1;
                else if (state==10 ) state=7;

            }

            {
                console.log(i,this.code[i].replace(/\n/g,"\\n"),sts[state],state)
                if (tar.length==0||state!=tar[tar.length-1].type) {
                    tar.push({type:state,type_str:sts[state],val:this.code[i],i:i});
                }
                else if (state==1||state==2||state==3)
                    tar.push({type:state,type_str:sts[state],val:this.code[i],i:i});
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


if (!(typeof require!="undefined")) {
    var code_res = new NLPtool("./test4.nlp").tokenize();
}