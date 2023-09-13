const fs = require('fs');

function fRead(filename) {
    return fs.readFileSync(filename, 'utf8').replace(/\r\n/g, "\n");
};


function main(filename) {
    let fdata = fRead(filename)
    //console.log(fdata)
    let ret = []
    ret.push("if (false) {}")
    let transionarr = []
    let statenamearr = []
    for (let line of fdata.split("\n")) {

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
    for (let transion of transionarr) {
        if (transion[0]==transion[1]) {
        }
        else if (!transion[1].endsWith("Error")) {
            ret.push(`else if (state==${statenamearr.indexOf(transion[0])} ${procCond(transion[2])}) { state=${statenamearr.indexOf(transion[1])} }`)
        }
        else {
            ret.push(`else if (state==${statenamearr.indexOf(transion[0])} ${procCond(transion[2])}) { throw terr(\`\${sts[${statenamearr.indexOf(transion[0])}]} => \${sts[${statenamearr.indexOf(transion[1])}]}; \${sts[${statenamearr.indexOf(transion[2])}]}\`,i) }`)
        }
    }
    //console.table(ret)
    console.log("")
    console.log(ret.join("\n"))
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