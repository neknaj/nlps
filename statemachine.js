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
    let ret2 = []
    let transionarr = []
    let statenamearr = ["start","LF","comment.LF","split","string.space"] // idを固定するstate
    for (let line of fdata_.split("\n")) {

        let transion = line.replace(/\s/g, "").match(/^.*?(?=-)|(?<=>).*?(?=:)|(?<=:).+/g)
        if (transion != null && transion.length == 3) {
            transionarr.push(transion)
            if (statenamearr.indexOf(transion[0]) == -1) {
                statenamearr.push(transion[0])
            }
            if (statenamearr.indexOf(transion[1]) == -1) {
                statenamearr.push(transion[1])
            }
        }
        // ["gVarDef.Colon1","gVarDef.Blank1","space"]
    }
    console.log("this.tokenizerstates = [\"" + statenamearr.join("\",\"") + "\"]")
    let sts = NaN;
    const retpush = (trans, sw) => {
        if (!trans[1].endsWith("Error")) {
            ret1.push(`    ${sw} (${procCond(trans[2])}) state=${statenamearr.indexOf(trans[1])};`)
            return
        }
        ret1.push(`    ${sw} (${procCond(trans[2])}) throw this.tokenizeerror(\`\${sts[${statenamearr.indexOf(trans[0])}]} => \${sts[${statenamearr.indexOf(trans[1])}]}; ${trans[2]}\`,i);`)
    }
    ret1.push("switch(state){")
    for (let transion of transionarr) { // jsコードの生成
        if (sts == statenamearr.indexOf(transion[0])) {
            procCond(transion[2]) ? retpush(transion, "else if") : ret1.push(`    else state=${statenamearr.indexOf(transion[1])};`)
        }
        else {
            sts = statenamearr.indexOf(transion[0]);
            ret1.push("    break;")
            ret1.push(`  case ${statenamearr.indexOf(transion[0])}:`)
            procCond(transion[2]) ? retpush(transion, "if") : ret1.push(`    state=${statenamearr.indexOf(transion[1])};`)

        }
    }
    ret1.splice(1, 1);
    ret1.push("}");
    for (let transion of transionarr) { // 全体図用mermaidコードの生成
        ret2.push(`${transion[0]} --> ${transion[1]}: ${transion[2]}`);
    }
    //console.table(ret)
    // console.log("--------------")
    // console.log(ret2.join("\n"))
    // console.log("")
    console.log(ret1.join("\n"))
    // console.log("--------------")
}
let condition = {
    "space": " ",
    "sharp": "#",
    "exclam": "!",
    "colon": ":",
    "semicolon": ";",
    "LF": "\\n",
    "comma": ",",
    "dot": ",",
    "quot": "\\\"",
    "lparen": "(",
    "rparen": ")",
    "lbracket": "{",
    "rbracket": "}",
    "asterisk": "*",
    "backslash": "\\\\",
}
function procCond(cond) {
    let ret = []
    let split = cond.split(/&|\|/);
    if (cond.includes("&") && cond.includes("|")) {
        throw `AND and OR are there in same condition statement`
    }
    else if (cond.includes("&")) {
        split_char = "&"
    }
    else if (cond.includes("|")) {
        split_char = "|"
    }
    else {
        split_char = "&"
    }
    console.log(split_char, split)
    for (let c of split) {
        let r = "";
        if (c[0] == "!") {
            r = "!"
            c = c.slice(1)
        }
        switch (c) {
            case "space":
            case "sharp":
            case "exclam":
            case "colon":
            case "dot":
            case "semicolon":
            case "LF":
            case "comma":
            case "quot":
            case "lparen":
            case "rparen":
            case "lbracket":
            case "rbracket":
            case "asterisk":
            case "backslash":
                ret.push(`(${r}(tc[i]=="${condition[c]}"))`);
                break;
            case "*":
                break;
            default:
                throw "errorrrrrrrr"
                break;
        }
    }
    if (ret.length == 0) {
        return ""
    }
    return `${ret.join(split_char + split_char)}`
}
main("./spec/nlp-tokenizer-statetransition.md")