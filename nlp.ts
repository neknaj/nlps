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
        var tar: Array<Record<string,string|number>> = [];
        this.tokenarr = tar;
        var state:number = 0;
        let i:number = 0;
        let tc = this.code;
        let terr = this.tokenizeerror;
        console.log(tar)
        this.tokenizerstates = ["TopLevel","ImportStat.Sharp","TopLevelDef.Exclam","TopLevel.Blank","TopLevel.EOL","Error","gVarDef.EOL","ImportStat.EOL","ImportStat.Error","ImportStat.Declaration","ImportStat.Blank","ImportStat.Filename","ImportStat.EOStat","ImportStat.AfterBlank","TopLevelDef.Error","TopLevelDef.Declaration","gVarDef.Colon1","FunctionDef.Colon1","FunctionDef.Blank1","FunctionDef.Error","FunctionDef.RetType","FunctionDef.Blank2","FunctionDef.Colon2","gVarDef.Blank1","gVarDef.Error","gVarDef.gVarType","gVarDef.Blank2","gVarDef.Colon2","gVarDef.Blank3","gVarDef.Name","gVarDef.EOStat","gVarDef.AfterBlank"]
        var sts = this.tokenizerstates;
        while (i<this.code.length) {
            {

                if (false) {}
                else if (state==0 &&((tc[i]=="#"))) { state=1 }
                else if (state==0 &&((tc[i]=="!"))) { state=2 }
                else if (state==0 &&((tc[i]==" "))) { state=3 }
                else if (state==0 &&((tc[i]=="\n"))) { state=4 }
                else if (state==0 &&(!(tc[i]=="#"))&&(!(tc[i]=="!"))&&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[0]} => ${sts[5]}; ${sts[-1]}`,i) }
                else if (state==3 &&((tc[i]=="\n"))) { state=4 }
                else if (state==3 &&((tc[i]=="#"))) { state=1 }
                else if (state==3 &&((tc[i]=="!"))) { state=2 }
                else if (state==3 &&(!(tc[i]=="#"))&&(!(tc[i]=="!"))&&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[3]} => ${sts[5]}; ${sts[-1]}`,i) }
                else if (state==4 &&((tc[i]==" "))) { state=3 }
                else if (state==4 &&((tc[i]=="#"))) { state=1 }
                else if (state==4 &&((tc[i]=="!"))) { state=2 }
                else if (state==4 &&(!(tc[i]=="#"))&&(!(tc[i]=="!"))&&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[4]} => ${sts[5]}; ${sts[-1]}`,i) }
                else if (state==6 ) { state=0 }
                else if (state==7 ) { state=0 }
                else if (state==1 &&((tc[i]==" "))) { throw terr(`${sts[1]} => ${sts[8]}; ${sts[-1]}`,i) }
                else if (state==1 &&(!(tc[i]==" "))) { state=9 }
                else if (state==9 &&((tc[i]==" "))&&((tar[tar.length-1].val=="include"||tar[tar.length-1].val=="using"))) { state=10 }
                else if (state==9 &&((tc[i]==" "))&&(!(tar[tar.length-1].val=="include"||tar[tar.length-1].val=="using"))) { throw terr(`${sts[9]} => ${sts[8]}; ${sts[-1]}`,i) }
                else if (state==10 &&((tc[i]==";"))) { throw terr(`${sts[10]} => ${sts[8]}; ${sts[-1]}`,i) }
                else if (state==10 &&(!(tc[i]==" "))&&(!(tc[i]==";"))) { state=11 }
                else if (state==11 &&(!(tc[i]==" "))&&((tc[i]==";"))) { state=12 }
                else if (state==11 &&((tc[i]==" "))) { throw terr(`${sts[11]} => ${sts[8]}; ${sts[-1]}`,i) }
                else if (state==12 &&((tc[i]==" "))) { state=13 }
                else if (state==12 &&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[12]} => ${sts[8]}; ${sts[-1]}`,i) }
                else if (state==13 &&((tc[i]=="\n"))) { state=7 }
                else if (state==12 &&((tc[i]=="\n"))) { state=7 }
                else if (state==13 &&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[13]} => ${sts[8]}; ${sts[-1]}`,i) }
                else if (state==2 &&((tc[i]==" "))) { throw terr(`${sts[2]} => ${sts[14]}; ${sts[-1]}`,i) }
                else if (state==2 &&(!(tc[i]==" "))) { state=15 }
                else if (state==15 &&((tc[i]==" "))) { throw terr(`${sts[15]} => ${sts[14]}; ${sts[-1]}`,i) }
                else if (state==15 &&((tc[i]==":"))&&(!(tar[tar.length-1].val=="fn"||tar[tar.length-1].val=="global"))) { throw terr(`${sts[15]} => ${sts[14]}; ${sts[-1]}`,i) }
                else if (state==15 &&((tc[i]==";"))) { throw terr(`${sts[15]} => ${sts[14]}; ${sts[-1]}`,i) }
                else if (state==15 &&((tc[i]==":"))&&((tar[tar.length-1].val=="global"))) { state=16 }
                else if (state==15 &&((tc[i]==":"))&&((tar[tar.length-1].val=="fn"))) { state=17 }
                else if (state==17 &&((tc[i]==" "))) { state=18 }
                else if (state==17 &&((tc[i]==";"))) { throw terr(`${sts[17]} => ${sts[19]}; ${sts[-1]}`,i) }
                else if (state==17 &&(!(tc[i]==" "))&&(!(tc[i]==";"))) { state=20 }
                else if (state==18 &&(!(tc[i]==" "))) { state=20 }
                else if (state==20 &&((tc[i]==" "))) { state=21 }
                else if (state==21 &&(!(tc[i]==" "))&&(!(tc[i]==":"))) { throw terr(`${sts[21]} => ${sts[19]}; ${sts[-1]}`,i) }
                else if (state==21 &&((tc[i]==":"))) { state=22 }
                else if (state==16 &&((tc[i]==" "))) { state=23 }
                else if (state==16 &&((tc[i]==";"))) { throw terr(`${sts[16]} => ${sts[24]}; ${sts[-1]}`,i) }
                else if (state==16 &&(!(tc[i]==" "))&&(!(tc[i]==";"))) { state=25 }
                else if (state==23 &&(!(tc[i]==" "))) { state=25 }
                else if (state==25 &&((tc[i]==" "))) { state=26 }
                else if (state==26 &&((tc[i]==":"))) { state=27 }
                else if (state==25 &&((tc[i]==";"))) { throw terr(`${sts[25]} => ${sts[24]}; ${sts[-1]}`,i) }
                else if (state==25 &&((tc[i]==":"))) { state=27 }
                else if (state==26 &&(!(tc[i]==" "))&&(!(tc[i]==":"))) { throw terr(`${sts[26]} => ${sts[24]}; ${sts[-1]}`,i) }
                else if (state==27 &&((tc[i]==" "))) { state=28 }
                else if (state==28 &&((tc[i]==";"))) { throw terr(`${sts[28]} => ${sts[24]}; ${sts[-1]}`,i) }
                else if (state==28 &&(!(tc[i]==" "))&&(!(tc[i]==";"))) { state=29 }
                else if (state==29 &&((tc[i]==";"))) { state=30 }
                else if (state==30 &&((tc[i]==" "))) { state=31 }
                else if (state==30 &&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[30]} => ${sts[24]}; ${sts[-1]}`,i) }
                else if (state==31 &&((tc[i]=="\n"))) { state=6 }
                else if (state==30 &&((tc[i]=="\n"))) { state=6 }
                else if (state==31 &&(!(tc[i]==" "))&&(!(tc[i]=="\n"))) { throw terr(`${sts[31]} => ${sts[24]}; ${sts[-1]}`,i) }
                
            }
            if (state!=0) {
                console.log(i,this.code[i].replace(/\n/g,"\\n"),sts[state],state)
                if (tar.length==0||state!=tar[tar.length-1].type) {
                    tar.push({type:state,val:this.code[i],i:i});
                }
                else {
                    tar[tar.length-1].val += this.code[i];
                }
                //console.table(tar)
            i++;
            }
        }
        console.table(tar)
    }
}


if (!(typeof require!="undefined")) {
    var code_res = new NLPtool("./test4.nlp");
}