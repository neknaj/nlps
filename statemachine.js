const fs = require('fs');

function fRead(filename) {
    return fs.readFileSync(filename, 'utf8').replace(/\r\n/g, "\n");
};


function main(filename) {
    let fdata = fRead(filename)
    let fdata_ = fdata.split("## 部分")[1];
    console.log(fdata_)
    //console.log(fdata)
    let ret1 = []
    ret1.push("if (false) {}")
    let ret2 = []
    let transionarr = []
    let statenamearr = []
    for (let line of fdata_.split("\n")) {

        let transion = line.replace(/\s/g,"").match(/^.*?(?=-)|(?<=>).*?(?=:)|(?<=:).+/g)
        if (transion!=null&&transion.length==3) {
            transionarr.push(transion)
            if (statenamearr.indexOf(transion[0])==-1) {
                statenamearr.push(transion[0])
            }
            if (statenamearr.indexOf(transion[1])==-1) {
                statenamearr.push(transion[1])
            }
        }
        // ["gVarDef.Colon1","gVarDef.Blank1","space"]
    }
    console.log("this.tokenizerstates = [\""+statenamearr.join("\",\"")+"\"]")
    for (let transion of transionarr) { // jsコードの生成
        if (transion[0]==transion[1]) {
        }
        else if (!transion[1].endsWith("Error")) {
            ret1.push(`else if (state==${statenamearr.indexOf(transion[0])} ${procCond(transion[2])}) { state=${statenamearr.indexOf(transion[1])} }`)
        }
        else {
            ret1.push(`else if (state==${statenamearr.indexOf(transion[0])} ${procCond(transion[2])}) { throw terr(\`\${sts[${statenamearr.indexOf(transion[0])}]} => \${sts[${statenamearr.indexOf(transion[1])}]}; \${sts[${statenamearr.indexOf(transion[2])}]}\`,i) }`)
        }
    }
    for (let transion of transionarr) { // 全体図用mermaidコードの生成
        ret2.push(`${transion[0]} --> ${transion[1]}: ${transion[2]}`);
    }
    //console.table(ret)
    console.log("")
    console.log(ret2.join("\n"))
    console.log("")
    console.log(ret1.join("\n"))
    console.log("")
}
let condition = {
    "space": " ",
    "sharp": "#",
    "exclam": "!",
    "colon": ":",
    "semicolon": ";",
    "LF": "\\n",
    "comma": ",",
    "lparen": "(",
    "rparen": ")",
    "lcurlyb": "{",
    "rcurlyb": "}",
}
function procCond(cond) {
    let ret = ""
    for (let c of cond.split("&")) {
        let r = "";
        if (c[0]=="!") {
            r = "!"
            c = c.slice(1)
        }
        switch (c) {
            case "space":
            case "sharp":
            case "exclam":
            case "colon":
            case "semicolon":
            case "LF":
            case "comma":
            case "lparen":
            case "rparen":
            case "lcurlyb":
            case "rcurlyb":
                ret += `&&(${r}(tc[i]=="${condition[c]}"))`;
                break;
            case "decl=(\"include\"|\"using\")":
                ret += `&&(${r}(tar[tar.length-1].val=="include"||tar[tar.length-1].val=="using"))`;
                break;
            case "decl=(\"fn\"|\"global\")":
                ret += `&&(${r}(tar[tar.length-1].val=="fn"||tar[tar.length-1].val=="global"))`;
                break;
            case "decl=\"fn\"":
                ret += `&&(${r}(tar[tar.length-1].val=="fn"))`;
                break;
            case "decl=\"global\"":
                ret += `&&(${r}(tar[tar.length-1].val=="global"))`;
                break;
            default:
               // throw "errorrrrrrrr"
                break;
        }
    }
    return ret
}
main("./spec/nlp-tokenizer-statetransition.md")