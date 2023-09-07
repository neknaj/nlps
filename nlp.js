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

class NLPtool {
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
        this.functionnames = [];
        for (let name of Object.keys(this.functions)) {
            if (this.functions[name].space=="this") {
                this.functionnames.push(name);
            }
        }
        console.log(this.functionnames)
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
                            this.check_identifier(arg[0])
                            let arg1 = [arg[1].split("(")[0],arg[1].split("(")[1].split(")")[0]]
                            let func_fn = {kind:"function",name:filename+"."+arg[0]+`(${arg1[1]})`,return:arg1[0],args:arg1[1],identifier:this.names.length,space:"include"}
                           // console.log(func)
                            if (this.functions[func_fn.name]!=null) {
                                this.error(i,this.code,["関数の定義に問題があります1","同じ名前の関数は定義できません",func_fn.name]);
                                return false;
                            }
                            this.names.push(func_fn);
                            let func = {kind:"function_sn",name:filename+"."+arg[0],return:[arg1[0]],args:[arg1[1]],identifier:this.names.length,space:["include"]}
                            this.functions[func_fn.name] = func_fn;
                            if (this.functions[func.name]!=null) {
                                this.info(i,this.code,["同じ略名の関数が読み込まれました",func_fn.name]);
                                this.functions[func.name].return.push(func.return)
                                this.functions[func.name].args.push(func.args)
                                this.functions[func.name].space.push(func.space)
                            }
                            else {
                                this.names.push(func);
                            }
                            this.info([func_fn.name,"関数を読み込みました"]);
                        }
                    }
                }
                else if (this.code.startsWith('using',i)) {
                    i+=5;
                    if (this.code[i]!=" ") {
                        this.error(i,this.code,["Usingに問題があります","ファイル名との間にスペースがありません"]);
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
                            this.check_identifier(arg[0])
                            let arg1 = [arg[1].split("(")[0],arg[1].split("(")[1].split(")")[0]]
                            let func_fn = {kind:"function",name:arg[0]+`(${arg1[1]})`,return:arg1[0],args:arg1[1],identifier:this.names.length,space:"using"}
                           // console.log(func)
                            if (this.functions[func_fn.name]!=null) {
                                this.error(i,this.code,["関数の定義に問題があります1","同じ名前の関数は定義できません",func_fn.name]);
                                return false;
                            }
                            this.names.push(func_fn);
                            let func = {kind:"function_sn",name:arg[0],return:[arg1[0]],args:[arg1[1]],identifier:this.names.length,space:["include"]}
                            this.functions[func_fn.name] = func_fn;
                            if (this.functions[func.name]!=null) {
                                this.info(i,this.code,["同じ略名の関数が読み込まれました",func_fn.name]);
                                this.functions[func.name].return.push(func.return)
                                this.functions[func.name].args.push(func.args)
                                this.functions[func.name].space.push(func.space)
                            }
                            else {
                                this.names.push(func);
                            }
                            this.info([func_fn.name,"関数を読み込みました"]);
                        }
                    }
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
                        kind: "function_sn",
                        name: "",
                        return: "",
                        args: "",
                        block: "",
                        space: "this",
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
                    this.check_identifier(func.name)
                    let func_fn = {
                        kind: "function",
                        name: `${func.name}(${func.args.split(",").map((x)=>{return x.split(":")[0]})})`,
                        return: func.return,
                        args: func.args,
                        block: func.block,
                        space: "this"
                    };
                    if (this.functions[func_fn.name]!=null) {
                        this.error(i,this.code,["関数の定義に問題があります1","同じ名前の関数は定義できません",func_fn.name]);
                        return false;
                    }
                    func_fn.identifier = this.names.length;
                    this.functions[func_fn.name] = func_fn;
                    this.names.push(func_fn);
                    if (this.functions[func.name]!=null) {
                        this.info(i,this.code,["同じ略名の関数が読み込まれました",func_fn.name]);
                        this.functions[func.name].return.push(func.return)
                        this.functions[func.name].args.push(func.args)
                        this.functions[func.name].space.push(func.space)
                    }
                    else {
                        func.identifier = this.names.length;
                        this.names.push({kind:"function_sn",name:func.name,return:[func.return],args:[func.args],space:func.space});
                    }
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
                    this.check_identifier(global.name)
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
                    this.check_identifier(decl.name)
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
                        this.check_identifier(decl.name)
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
    check_identifier(ident) {
        let reserved = ["True","False","true","false","return"];
        let numbers = ["0","1","2","3","4","5","6","7","8","9"];
        let forbiddensigns = ["!","{","}","(",")","[","]","\\","\"","'","`",":",";",",","."];

        if (reserved.indexOf(ident)!=-1) {
            this.error(-1,null,["この名前は予約されています",ident])
        }

        let name = ident;
        if (numbers.indexOf(name[0])!=-1) {
            this.error(-1,"",["関数名・変数名の先頭に数字[0-9]は使えません",name])
        }
        for (let fbs of forbiddensigns) {
            if (name.indexOf(fbs)!=-1) {
                this.error(-1,"",["関数名・変数名に記号[ ! { } ( ) [ ] \\ \" ' ` : , . ]は使えません",name])
            }
        }
        return true;
    }
    literal(token) {
        if ( new RegExp(/[+-]?[0-9]+/).test(token.name) ) {
            token.type = "4.int";
        }
        else if ( new RegExp(/"(.*)"/).test(token.name) ) {
            token.type = "12.str";
        }
        else if ( new RegExp(/True|False|true|false/).test(token.name) ) {
            token.type = "4.bool";
        }
        else {
            return false;
        }
        token.kind = "literal";
       // console.log("literal",token);
        return true;
    }
    name_resolution(token,namelist) {
        //console.log("nameresolution",token,namelist)
        for (let i=namelist.length-1;i>=0;i--) {
            if (token.name==namelist[i].name) {
                token.identifier = namelist[i].identifier;
                token.kind = namelist[i].kind;
                token.type = namelist[i].type;
                token.return = namelist[i].return;
                token.args = namelist[i].args;
                //console.log("Found",token)
                return;
            }
        }
        if (!this.literal(token)) {
            this.error(-1,null,["名前の解決に失敗しました。",token.name])
        }
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
                this.checkStat(instats.stat,newnamelist);
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

    checkStat(stat,namelist) {
        console.log("checkStat",stat)
        let init = [];
        let comm = [];
        for (let i in stat) {
            let elm = stat[i]
            if (elm.kind=="function") {
                init.push([elm.return,elm.args.split(",").map((x)=>{return x.split(":")[0]})])
                for (let i of elm.args.split(",").map((x)=>{return x.split(":")[0]})) {
                    comm.push(["pop",i])
                }
                comm.push(["push",elm.return])
            }
            else if (elm.kind=="function_sn") {
                init.push([elm.return,elm.args])
                comm.push(["pop2",elm.args,i])
                comm.push(["push2",elm.return,i])
            }
            else {
                init.push(elm.type)
                comm.push(["push",elm.type])
            }
        }
        //console.log(JSON.stringify(init))
        console.log(comm.map((x)=>{return x.join(" ")}))
        console.log(comm)
        let evalstack = [];
        for (let com of comm) {
            if (com[0]=="push") {
                evalstack.push(com[1])
            }
            else if (com[0]=="pop") {
                if (evalstack.length==0) {
                    this.error(-1,null,["引数が不足しています"])
                }
                let pop = evalstack.pop()
                if (pop!=com[1]) {
                    this.error(-1,null,["引数の型が一致していません"])
                }
            }
            else if (com[0]=="pop2") {
                if (evalstack.length==0) {
                    this.error(-1,null,["引数が不足しています"])
                }
                let pop = evalstack.pop()
                if (pop!=com[1]) {
                    this.error(-1,null,["引数の型が一致していません"])
                }
            }
            //console.log(evalstack)
        }
        if (evalstack.length!=1) {
            this.error(-1,null,["式の最後の値が1個になりません"])
        }
        //console.log(evalstack)
    }
}

{
var parsed = new NLPtool("./test4.nlp");
console.log(parsed)
//new NLPcompile_NVE(testcode);
}