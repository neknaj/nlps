var require;
console.log(require)
var fRead;
if (require!=null) {
    const fs = require('fs');
    function fRead(filename) {
        return fs.readFileSync(filename,'utf8').replace(/\r\n/g,"\n");
    }
    console.log(fRead)
}
else {
    function fRead(filename) {
        let hr = new XMLHttpRequest()
        hr.open("GET",filename,false);
        hr.send(null);
        if (hr.status==200||hr.status==304) {
            return hr.responseText.replace(/\r\n/g,"\n");
        }
        else {
            throw "err "+filename
        }
    }
    console.log(fRead)
}

class NLPparse {
    constructor(filename) {
        var code = fRead(filename);
        this.code = code+"\0";
        console.log(this.code)
        this.delete_comments();
        console.log(this.code)
        this.names = [];
        this.functions = {};
        this.globalvars = {};
        this.toplevel_parse();
        console.log("thisnames")
        console.table(this.names)
        this.parsed = {};
        console.log(this.functions)
        console.log(this.globalvars)
        this.toplevel_names = this.names.concat();
        this.functionnames = Object.keys(this.functions);
        for (let name of this.functionnames) {
            this.info([name,"関数の内容を読み込みます"]);
            let varnames = [];
            let args = this.args_parse(this.functions[name].args,varnames);
            let block = this.block_parse(this.functions[name].block,varnames);
            console.log(block)
            this.parsed[name] = {block:block,args:args,return:this.functions[name].return};
            if (block==false) {
                return false;
            }
        }
       // this.check_identifier()
        for (let name of this.functionnames) {
            this.info([name,"関数の名前を解決します"]);
            let block = this.name_resolutions(this.parsed[name].block,this.toplevel_names.concat(this.parsed[name].args).concat([ {kind:"return",name:"return",type:this.functions[name].return} ]));
        }
       // console.log("names",this.names)
        console.log("toplevel names",this.toplevel_names)
        console.table(this.parsed)
        return this.parsed;
    }
    error(i,level,msg) {
        if (i>=0) {
            //console.error(`[error:${i}]`,...msg);
            throw `[error:${i}] ${msg.join(" ")}`
        }
        else {
            //console.error(`[error]`,...msg);
            throw `[error] ${msg.join(" ")}`
        }
    }
    info(msg) {
        console.log(`[info]`,...msg);
    }
    delete_comments() {
        let code = "";
        let i = 0;
        while (i<this.code.length) {
            if (this.code[i]=="\"") { // <string-symbol> // 文字列内の括弧を無視する
                // <string> ::= <string-symbol> <string-letters> <string-symbol>
                // <string-symbol> ::= '"'
                // <string-letters> ::= { <string-letter> }
                // ; <string-letter>内で<string-symbol>を使用する場合は、( '\' <string-symbol> )のようにバックスラッシュを付ける
                // ; <string-letter>内で '\' を使用する場合は、 '\\' のように2つ続ける
                // ; エスケープは '\' と1文字の合計2文字で構成される
                code += this.code[i];
                i++;
                //  <string-letters> <string-symbol>
                while (i<this.code.length) {
                    // ; <string-letter> 内で<string-symbol>を使用する場合は、( '\' <string-symbol> )のようにエスケープする
                    // ; <string-letter> 内で '\' を使用する場合は、 '\\' のようにエスケープする
                    // ; <string-letter> 内で、エスケープに使われない '\' は認められない
                    if (this.code[i]=="\\") {
                        code += this.code[i];
                        // ; エスケープは '\' と1文字の合計2文字で構成される
                        i++;
                    }
                    if (this.code[i]=="\"") { // <string-symbol>
                        code += this.code[i];
                        break;
                    }
                    code += this.code[i];
                    i++;
                }
            }
            else if (this.code.startsWith("//",i)) {
                while (i<this.code.length) {
                    if (this.code[i]=="\n") {
                        break;
                    }
                    i++;
                }
            }
            // else if (this.code.startsWith("/*",i)) {
            // }
            else {
                code += this.code[i];
            }
            i++;
        }
        this.code = code;
    }
    toplevel_parse() {
        // <code> ::= { <blank-lines> <func> <blank-lines> }
        let i = 0;
        while (i<this.code.length) {
            // blank-lines
            while (i<this.code.length&&(this.code[i]==" "||this.code[i]=="\n")) {i++;}
            if (this.code[i]=="#") {
                i++;
                // '#'
                if (this.code.startsWith('include',i)) {
                    i+=7;
                    if (this.code[i]!=" ") {
                        this.error(i,this.code,["Includeに問題があります","ファイル名との間にスペースがありません"]);
                    }
                    i++;
                    let filename = "";
                    while (i<this.code.length&&(this.code[i]!=" "&&this.code[i]!="\n")) {
                        filename += this.code[i];
                        i++;
                    }
                    var filetext = fRead(filename+".nlpo");
                    var filelines = filetext.toString().split('\n');
                    for (var line of filelines) {
                        if (line.startsWith(".func")) {
                            let sp = line.split(" ");
                            let arg = sp[1].split(":");
                            let func = {kind:"function",name:filename+"."+arg[0],return:arg[1],args:arg[2].split("(")[1].split(")")[0],identifier:this.names.length}
                            console.log(func)
                            this.names.push(func)
                        }
                    }
                }
                else if (this.code.startsWith('#using',i)) {
                }
            }
            else if (this.code[i]=='!') { // '!'
                i++;
                // space
                while (i<this.code.length&&(this.code[i]==" ")) {i++;}
                // 'fn:'
                if (this.code.startsWith('fn:',i)) {
                    //<func> ::= '!' [ <space> ] 'fn:' [ <space> ] <var-type> ':(' <func-arg-def> '):' [ <space> ] <func-name> { ( <space> | <eol> ) } '{' <block> '}'
                    let func = {
                        kind: "function",
                        name: "",
                        return: "",
                        args: "",
                        block: "",
                    };
                    i+=3
                    // [ <space> ]
                    while (i<this.code.length&&this.code[i]==" ") {i++;}
                    // <var-type> ':'
                    while (i<this.code.length&&this.code[i]!=":") {
                        func.return += this.code[i];
                        i++;
                    }
                    i++;
                    // '('
                    if (this.code[i]!='(') {
                        this.error(i,this.code,["関数の定義に問題があります1","引数の括弧がありません"]);
                        return false;
                    }
                    // <func-arg-def> ')'
                    i++;
                    while (i<this.code.length&&this.code[i]!=")") {
                        func.args += this.code[i];
                        i++;
                    }
                    i+=2;
                    // [ <space> ]
                    while (i<this.code.length&&this.code[i]==" ") {i++;}
                    // <func-name> { ( <space> | <eol> ) } 
                    while (i<this.code.length) {
                        if (this.code[i]=="\n"|(this.code[i]=="\r"&&this.code[i+1]=="\n"&&i++)) {
                            break;
                        }
                        if (this.code[i]==" ") {
                            break;
                        }
                        func.name += this.code[i];
                        i++;
                    }
                    while (i<this.code.length) {
                        if (!(this.code[i]==" "||(this.code[i]=="\n"|(this.code[i]=="\r"&&this.code[i+1]=="\n"&&i++)))) {
                            break;
                        }
                        i++;
                    }
                    // '{'
                    if (!this.code.startsWith('{',i)) {
                        this.error(i,this.code,["関数の定義に問題があります2"]);
                        return false;
                    }
                    i+=1;
                    // <block> '}'
                    let brccnt = 1;
                    while (i<this.code.length) {
                        // <block> ::= <stat> { <blank-lines> <stat> }
                        // ; <block> の中では、 <string> の中以外で組になっていない '{' '}' が出てくることはない
                        if (this.code[i]=="\"") { // <string-symbol> // 文字列内の括弧を無視する
                            // <string> ::= <string-symbol> <string-letters> <string-symbol>
                            // <string-symbol> ::= '"'
                            // <string-letters> ::= { <string-letter> }
                            // ; <string-letter>内で<string-symbol>を使用する場合は、( '\' <string-symbol> )のようにバックスラッシュを付ける
                            // ; <string-letter>内で '\' を使用する場合は、 '\\' のように2つ続ける
                            // ; エスケープは '\' と1文字の合計2文字で構成される
                            func.block += this.code[i];
                            i++;
                            //  <string-letters> <string-symbol>
                            while (i<this.code.length) {
                                // ; <string-letter> 内で<string-symbol>を使用する場合は、( '\' <string-symbol> )のようにエスケープする
                                // ; <string-letter> 内で '\' を使用する場合は、 '\\' のようにエスケープする
                                // ; <string-letter> 内で、エスケープに使われない '\' は認められない
                                if (this.code[i]=="\\") {
                                    func.block += this.code[i];
                                    // ; エスケープは '\' と1文字の合計2文字で構成される
                                    i++;
                                }
                                if (this.code[i]=="\"") { // <string-symbol>
                                    break;
                                }
                                func.block += this.code[i];
                                i++;
                            }
                        }
                        else if (this.code[i]=="{") {
                            brccnt++;
                        }
                        else if (this.code[i]=="}") {
                            brccnt--;
                        }
                        if (brccnt==0) {
                            break;
                        }
                        func.block += this.code[i];
                        i++;
                    }
                    if (this.functions[func.name]!=null) {
                        this.error(i,this.code,["関数の定義に問題があります1","同じ名前の関数は定義できません",func.name]);
                        return false;
                    }
                    this.functions[func.name] = func;
                    func.identifier = this.names.length;
                    this.names.push(func);
                    this.info([func.name,"関数を読み込みました"]);
                }
                else if (this.code.startsWith('global:',i)) {
                    // <global-var-declaration> ::= '!' [ <space> ] 'global:' [ <space> ] <var-type> ':' [ <space> ] <var-name> [ <space> ] ';'
                    i+=7;
                    let global = {
                        kind: "globalvariable",
                        name: "",
                        type: "",
                    }
                    // [ <space> ]
                    i++;
                    while (i<this.code.length&&this.code[i]==" ") {i++;}
                    i--;
                    // <var-type> ':'
                    while (i<this.code.length&&this.code[i]!=":") {
                        global.type += this.code[i];
                        i++;
                    }
                    // [ <space> ]
                    i++;
                    while (i<this.code.length&&this.code[i]==" ") {i++;}
                    // <var-name> [ <space> ] ';'
                        // <var-name> (' '|';')
                    while (i<this.code.length&&this.code[i]!=" "&&this.code[i]!=";") {
                        global.name += this.code[i];
                        i++;
                    }
                    if (this.code[i]==" ") {
                        while (i<this.code.length&&this.code[i]==" ") {i++;}
                    }
                    if (this.code[i]!=";") {
                        this.error(i,this.code,["グローバル変数の定義に問題があります"]);
                    }
                    if (this.globalvars[global.name]!=null) {
                        this.error(i,this.code,["グローバル変数の定義に問題があります1","同じ名前のグローバル変数は定義できません",global.name]);
                        return false;
                    }
                    this.globalvars[global.name] = global;
                    global.identifier = this.names.length;
                    this.names.push(global);
                    this.info([global.name,"グローバル変数を読み込みました"]);
                }
                else {
                    this.error(i,this.code,["不明なトップレベル構造です"]);
                    return false;
                }
            }
            else if (this.code[i]==" ") {
            }
            else if (this.code[i]=="\n"|(this.code[i]=="\r"&&this.code[i+1]=="\n"&&i++)|this.code[i]=="\0") {
            }
            else {
                this.error(i,this.code,["関数の定義に問題があります1","トップレベルに関数、改行、空白以外が存在します'",this.code[i],"'"]);
                return false;
            }
            i++;
        }
    }
    args_parse(argstxt,varnames) {
        let args = [];
        let sp_argstxt = argstxt.split(",");
        for (let argtxt of sp_argstxt) {
            if (argtxt!="") {
                let sp_argtxt = argtxt.split(":");
                let arg = {kind:"argument",name:sp_argtxt[1],type:sp_argtxt[0]};
                args.push(arg);
                if (varnames.indexOf(arg.name)!=-1) {
                    this.error(i,block_code,["変数の定義に問題があります","同じブロック内で、同じ名前の変数は定義できません",arg.name]);
                    return false;
                }
                arg.identifier = this.names.length;
                this.names.push(arg);
            }
        }
        return args;
    }
    block_parse(block_code,varnames) {
        // <block> ::= { <blank-lines> ( <stat> | <control>) } <blank-lines>
        let list = {var:[],stats:[]};
        let i = 0;
        while (i<block_code.length) {
            let stat = {
                type: "stat",
                assign: "",
                stat: "",
            }
            if ((block_code[i]==" "||(block_code[i]=="\n"|(block_code[i]=="\r"&&block_code[i+1]=="\n"&&i++)))) { // <blank-lines>
                i++;
            }
            else if (block_code[i]=="!") { // 宣言
                i++;
                while (i<block_code.length&&block_code[i]==" ") {i++;} // [ <space> ]
                if (block_code.startsWith('ctrl:',i)) { // <control>
                    // <control> ::= '!' [ <space> ] 'ctrl:(' <condition> '):' <struct-if> | <struct-while>
                    // <condition> ::= ( <stat-var-declaration> | <stat-var-assign> | <stat-run-expr> )
                    // <struct-if> ::= 'if' [ <space> ] '{' <block> '}'
                    // <struct-while> ::= 'while' [ <space> ] '{' <block> '}'
                    let ctrl = {
                        type: "",
                        condition: "",
                        block: "",
                    };
                    i+=5;
                    // '('
                    if (block_code[i]!='(') {
                        this.error(i,block_code,["制御構造の定義に問題があります1","条件の括弧がありません"]);
                        return false;
                    }
                    // <condition> ')'
                    i++;
                    while (i<block_code.length&&block_code[i]!=")") {
                        ctrl.condition += block_code[i];
                        i++;
                    }
                    ctrl.condition = this.stat_parse(ctrl.condition,i)
                    // ':'
                    i++;
                    if (block_code[i]!=':') {
                        this.error(i,block_code,["制御構造の定義に問題があります2"]);
                        return false;
                    }
                    i++;
                    if (block_code.startsWith('if',i)) { // <struct-if> ::= 'if' [ <space> ] '{' <block> '}'
                        ctrl.type = "if";
                        i+=2;
                        while (i<block_code.length&&block_code[i]==" ") {i++;}
                    }
                    else if (block_code.startsWith('while',i)) { // <struct-while> ::= 'while' [ <space> ] '{' <block> '}'
                        ctrl.type = "while";
                        i+=5;
                        while (i<block_code.length&&block_code[i]==" ") {i++;}
                    }
                    else {
                        this.error(i,block_code,["制御構造の定義に問題があります3","制御構造の型がありません"]);
                        return false;
                    }
                    // '{'
                    if (!block_code.startsWith('{',i)) {
                        this.error(i,block_code,["関数の定義に問題があります2"]);
                        return false;
                    }
                    i+=1;
                    // <block> '}' // toplevel()内と同一コード
                    let brccnt = 1;
                    while (i<block_code.length) {
                        if (block_code[i]=="\"") {
                            ctrl.block += block_code[i];
                            i++;
                            while (i<block_code.length) {
                                if (block_code[i]=="\\") {
                                    ctrl.block += block_code[i];
                                    i++;
                                }
                                if (block_code[i]=="\"") {
                                    break;
                                }
                                ctrl.block += block_code[i];
                                i++;
                            }
                        }
                        else if (block_code[i]=="{") {
                            brccnt++;
                        }
                        else if (block_code[i]=="}") {
                            brccnt--;
                        }
                        if (brccnt==0) {
                            break;
                        }
                        ctrl.block += block_code[i];
                        i++;
                    }
                    i++;
                    ctrl.block = this.block_parse(ctrl.block,[]);
                    if (ctrl.block==false) {
                        return false;
                    }
                    list.stats.push(ctrl);
                }
                else {
                    // <stat-var-declaration> ::= '!' [ <space> ] <var-type> ':' [ <space> ] <var-name> [ <space> ]
                    let decl = {kind: "variable",name: "",type: "",}
                    while (i<block_code.length&&block_code[i]!=":") {
                        decl.type += block_code[i];
                        i++;
                    }
                    i++;
                    while (i<block_code.length&&block_code[i]==" ") {i++;}
                    while (i<block_code.length) {
                        if (block_code[i]==" ") {
                            i++;
                            while (i<block_code.length&&block_code[i]!=";") {
                                if (block_code[i]!=" ") {
                                    this.error(i,block_code,["変数の定義に問題があります"]);
                                    return false;
                                }
                                i++;
                            }
                            break;
                        }
                        if (block_code[i]==";") {
                            i++;
                            break;
                        }
                        decl.name += block_code[i];
                        i++;
                    }
                    if (varnames.indexOf(decl.name)!=-1) {
                        this.error(i,block_code,["変数の定義に問題があります","同じブロック内で、同じ名前の変数は定義できません",decl.name]);
                        return false;
                    }
                    list.var.push(decl);
                    varnames.push(decl.name);
                    decl.identifier = this.names.length;
                    this.names.push(decl);
                }
            }
            else { // <stat>
                // <stat> ::= ( <stat-var-declaration-assign> | <stat-var-declaration> | <stat-var-assign> | <stat-return> | <expr> ) ';' // <stat-var-declaration> は、上位の場合分けで別処理になっている
                // <stat-var-declaration-assign> ::= <expr> [ <space> ] ':>' [ <space> ] '!' [ <space> ] <var-type> ':' [ <space> ] <var-name> [ <space> ]
                // <stat-var-assign> ::= <expr> [ <space> ]  ':>' [ <space> ]  <var-name> [ <space> ]
                // <stat-return> ::= <expr> [ <space> ]  ':>' [ <space> ]  "return"
                let assign = false;
                while (i<block_code.length) {
                    if (block_code[i]==";") {
                        i++;
                        break;
                    }
                    else if (block_code.startsWith(':>',i)) {
                        i+=2;
                        assign = true;
                        break;
                    }
                    stat.stat += block_code[i];
                    i++;
                }
                if (assign) { // <stat-var-assign> , <stat-var-declaration-assign>
                    while (i<block_code.length&&block_code[i]==" ") {i++;}
                    while (i<block_code.length) {
                        if (block_code[i]==";") {
                            i++;
                            break;
                        }
                        stat.assign += block_code[i];
                        i++;
                    }
                    let si = 0;
                    if (stat.assign[si]=="!") { // '!' // <stat-var-declaration-assign>
                        let decl = {
                            kind: "variable",
                            name: "",
                            type: "",
                        }
                        si++;
                        while (si<stat.assign.length&&stat.assign[si]==" ") {si++;}
                        while (si<stat.assign.length&&stat.assign[si]!=":") {
                            decl.type += stat.assign[si];
                            si++;
                        }
                        if (stat.assign[si]!=":") {
                            this.error(i,this.code,["変数の定義に問題があります","コロンがありません"]);
                        }
                        si++;
                        while (si<stat.assign.length&&stat.assign[si]==" ") {si++;}
                        while (si<stat.assign.length) {
                            decl.name += stat.assign[si];
                            si++;
                        }
                        if (decl.name=="return") {
                            this.error(i,block_code,["変数の定義に問題があります","returnという名前の変数は定義できません"]);
                            return false;
                        }
                        if (varnames.indexOf(decl.name)!=-1) {
                            this.error(i,block_code,["変数の定義に問題があります","同じブロック内で、同じ名前の変数は定義できません",decl.name]);
                            return false;
                        }
                        list.var.push(decl);
                        varnames.push(decl.name);
                        decl.identifier = this.names.length;
                        this.names.push(decl);
                        stat.assign = {name:decl.name};
                    }
                    else {
                        stat.assign = {name:stat.assign};
                    }
                }
                else {
                    stat.assign = false;
                }
                stat.stat = this.stat_parse(stat.stat,i);
                list.stats.push(stat);
            }
        }
        return list;
    }
    stat_parse(stat_code,ofs) {
        let list = [];
        let i = 0;
        let code = "";
        while (i<stat_code.length+1) {
            if (stat_code[i]==" ") {
                // console.log(code,0)
                if (code!="") {
                    list.push({name:code});
                }
                code = "";
                i++;
            }
            else if (i==stat_code.length) {
                // console.log(code,0)
                if (code!="") {
                    list.push({name:code});
                }
                code = "";
            }
            // 文字列
            if (stat_code[i]=="\"") { // <string-symbol> // 文字列内の括弧を無視する
                // <string> ::= <string-symbol> <string-letters> <string-symbol>
                // <string-symbol> ::= '"'
                // <string-letters> ::= { <string-letter> }
                // ; <string-letter>内で<string-symbol>を使用する場合は、( '\' <string-symbol> )のようにバックスラッシュを付ける
                // ; <string-letter>内で '\' を使用する場合は、 '\\' のように2つ続ける
                // ; エスケープは '\' と1文字の合計2文字で構成される
                code += stat_code[i];
                if (code[0]!="\"") {
                    console.log(" [error]")
                }
                i++;
                //  <string-letters> <string-symbol>
                while (i<stat_code.length) {
                    // ; <string-letter> 内で<string-symbol>を使用する場合は、( '\' <string-symbol> )のようにエスケープする
                    // ; <string-letter> 内で '\' を使用する場合は、 '\\' のようにエスケープする
                    // ; <string-letter> 内で、エスケープに使われない '\' は認められない
                    if (stat_code[i]=="\\") {
                        code += stat_code[i];
                        // ; エスケープは '\' と1文字の合計2文字で構成される
                        i++;
                    }
                    if (stat_code[i]=="\"") { // <string-symbol>
                        code += stat_code[i];
                        break;
                    }
                    code += stat_code[i];
                    i++;
                }
            }
            else {
                code += stat_code[i];
            }
            i++;
        }
        // if (true) {
        //     console.log(code,0)
        //     code = "";
        //     i++;
        // }
        return list;
    }
    // check_identifier() {
    //     let numbers = ["0","1","2","3","4","5","6","7","8","9"];
    //     let forbiddensigns = ["!","{","}","(",")","[","]","\\","\"","'","`",":",";",","];

    //     for (let ident of this.names) {
    //         let name = ident.name;
    //         if (numbers.indexOf(name[0])!=-1) {
    //             this.error(-1,"",["関数名・変数名の先頭に数字[0-9]は使えません",name])
    //         }
    //         for (let fbs of forbiddensigns) {
    //             if (name.indexOf(fbs)!=-1) {
    //                 this.error(-1,"",["関数名・変数名に記号[ ! { } ( ) [ ] \\ \" ' ` : , ]は使えません",name])
    //             }
    //         }
    //     }
    //     return true;
    // }
    literal(token) {
        console.log("literal",token);
        token.identifier = "literal";
        token.type = "4.int";
    }
    name_resolution(token,namelist) {
        console.log("nameresolution",token,namelist)
        for (let i=namelist.length-1;i>=0;i--) {
            if (token.name==namelist[i].name) {
                token.identifier = namelist[i].identifier;
                token.kind = namelist[i].kind;
                token.type = namelist[i].type;
                token.return = namelist[i].return;
                //console.log("Found",token)
                return;
            }
        }
        this.literal(token);
        //console.log("Not Found",token)
    }
    name_resolutions(block,namelist) {
        //console.log("resolution",block,namelist)
        let newnamelist = namelist.concat(block.var);
        for (let instats of block.stats) {
            if (instats.type=="stat") {
                //console.log("stat",instats);
                if (instats.assign!=false) {
                    this.name_resolution(instats.assign,newnamelist);
                }
                for (let i=0;i<instats.stat.length;i++) {
                    this.name_resolution(instats.stat[i],newnamelist);
                }
            }
            else if (instats.type=="while") {
                //console.log("while",instats)
                for (let i=0;i<instats.condition.length;i++) {
                    this.name_resolution(instats.condition[i],newnamelist);
                }
                this.name_resolutions(instats.block,newnamelist);
            }
            else if (instats.type=="if") {
                //console.log("if",instats)
                this.name_resolutions(instats.block,newnamelist);
            }
        }
        //console.log("--",block)
    }
}

// class NLPcompile_NVE {
//     constructor(code) {
//         this.parsed = new NLPparse(code,[{kind:"function",name:"out",return:"void",args:"int",identifier:0},{kind:"function",name:">",return:"int",args:"int,int",identifier:1},{kind:"function",name:"<",return:"int",args:"int,int",identifier:2},{kind:"function",name:"+",return:"int",args:"int,int",identifier:3}]);
//         console.log(this.parsed)
//         if (this.parsed==false) {
//             console.log("Error");
//             return false;
//         }
//         console.log(this.parsed);
//         console.log(JSON.stringify(this.parsed))
//         //this.nameeval();
//     }
//     nameeval() {
//         let functionnames = Object.keys(this.parsed);
//         for (let name of functionnames) {
//             console.log("関数:",name);
//             let block = this.parsed[name];
//             console.log(block)
//             let vars = Object.keys(block.var);
//             console.log("変数:",vars);
//         }
//     }
//     makecode() {
//         this.code = [];
//         this.code.push(["jmp","#callmain"]);
//         this.code.push(["fram",0]);

//         // library files
//         //

//         let functionnames = Object.keys(this.parsed);
//         for (let name of functionnames) {
//             let block = this.parsed[name].block;
//             console.log(block)
//             this.code.push([name+":"]);
//             let vars = Object.keys(block.var);
//             console.log("変数:",vars);
//             this.code.push(["fram",vars.length]);
//             this.code.push(["pop",vars.length]);
//         }
//         this.code.push(["#callmain"+":"]);
//         this.code.push(["pop",0]);
//         console.log(this.code)
//     }
// }

{
var parsed = new NLPparse("./test.nlp");
console.log(parsed)
//new NLPcompile_NVE(testcode);
}