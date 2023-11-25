const fs = require('fs');

function fRead(filename) {
    return fs.readFileSync(filename, 'utf8').replace(/\r\n/g, "\n");
};
function fWrite(filename,content) {
    fs.writeFileSync(filename,content);
};


function main(tokenizertransionmd,nlpts) {
    let fdata = fRead(tokenizertransionmd)
    let fdata_ = fdata.split("## 部分")[1];
    // console.log(fdata_)
    //console.log(fdata)
    let ret1 = []
    let ret2 = []
    let transionarr = []
    let statenamearr = ["EOF","Error","TL.root","Block.root","Block.entry","Block.exit","Block.exit_ctrl"] // idを固定するstate
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
    let sts = NaN;
    const retpush = (trans, sw) => {
        if (!trans[1].endsWith("Error")) {
            ret1.push(`        ${sw} (${procCond(trans[2])}) state=${statenamearr.indexOf(trans[1])};`)
            return
        }
        ret1.push(`        ${sw} (${procCond(trans[2])}) throw this.tokenizeerror(\`\${sts[${statenamearr.indexOf(trans[0])}]} => \${sts[${statenamearr.indexOf(trans[1])}]}; ${trans[2]}\`,i);`)
    }
    ret1.push("switch(state_copy){")
    for (let transion of transionarr) { // jsコードの生成
        if (sts == statenamearr.indexOf(transion[0])) {
            procCond(transion[2]) ? retpush(transion, "else if") : ret1.push(`        else state=${statenamearr.indexOf(transion[1])};`)
        }
        else {
            sts = statenamearr.indexOf(transion[0]);
            ret1.push("        break;")
            ret1.push(`    case ${statenamearr.indexOf(transion[0])}:`)
            procCond(transion[2]) ? retpush(transion, "if") : ret1.push(`        state=${statenamearr.indexOf(transion[1])};`)
        }
    }
    ret1.splice(1, 1);
    ret1.push("}");
    // for (let transion of transionarr) { // 全体図用mermaidコードの生成
    //     ret2.push(`${transion[0]} --> ${transion[1]}: ${transion[2]}`);
    // }
    for (let transion of transionarr) { // 全体図用mermaidコードの生成
        ret2.push(`${statenamearr.indexOf(transion[0])} --> ${statenamearr.indexOf(transion[1])}: ${transion[2]}`);
    }
    let fdata_new = "";
    fdata_new += fdata.substring(0,fdata.indexOf("## 全体図")+"## 全体図".length)+"\n";
    fdata_new += "```mermaid\nstateDiagram-v2\n";
    fdata_new += ret2.join("\n")+"\n";
    fdata_new += "```"+"\n"
    fdata_new += fdata.substring(fdata.indexOf("## 部分"));
    //console.log(fdata_new)
    fWrite(tokenizertransionmd,fdata_new);
    
    let indent1 = Array(4*3).fill(" ").join("");
    let indent2 = Array(4*2).fill(" ").join("");
    let nlpts_before = fRead(nlpts);
    let nlpts_new = "";
    nlpts_new += nlpts_before.substring(0,nlpts_before.indexOf("/*ParserReplace_states_start*/")+"/*ParserReplace_states_start*/".length) +"\n";
    nlpts_new += indent2+"this.parserstates = [\"" + statenamearr.join("\",\"") + "\"]" +"\n";
    nlpts_new += indent2+nlpts_before.substring(nlpts_before.indexOf("/*ParserReplace_states_end*/"),nlpts_before.indexOf("/*ParserReplace_switch_start*/")+"/*ParserReplace_switch_start*/".length) +"\n";
    for (line of ret1) {
        nlpts_new += indent1+line +"\n";
    }
    nlpts_new += indent1+nlpts_before.substring(nlpts_before.indexOf("/*ParserReplace_switch_end*/"));
    fWrite(nlpts,nlpts_new);
}
let condition = {
    "space": " ",
    "sharp": "#",
    "exclam": "!",
    "colon": ":",
    "semicolon": ";",
    "LF": "\\n",
    "comma": ",",
    "dot": ".",
    "quot": "\\\"",
    "lparen": "(",
    "rparen": ")",
    "lbracket": "{",
    "rbracket": "}",
    "asterisk": "*",
    "backslash": "\\\\",
    "gt": ">",
    "lt": "<",
    "lassign": ":",
    "lassign_": ">",
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
   // console.log(split_char, split)
    for (let c of split) {
        if (c[0]=="'") {
            c = c.slice(1)
            let r = "=";
            let target = "val"
            if (c[0] == "!") {
                r = "!"
                c = c.slice(1)
            }
            switch (c) {
                case "semicolon":
                    ret.push(`(tar[i+1].${target}${r}="${condition[c]}")`);
                    break;
                default:
                    throw "errorrrrrrrr"
                    break;
            }
        }
        else {
            //console.log(c)
            let r = "=";
            let target = "val"
            if (c[0] == "!") {
                r = "!"
                c = c.slice(1)
            }
            if (c[0] == "$") {
                c = c.slice(1)
                target = "group"
                switch (c) {
                    case "include":
                    case "replace":
                    case "global":
                    case "fn":
                    case "special":
                    case "comment":
                    case "note":
                    case "blank":
                    case "split":
                    case "LF":
                    case "assign":
                    case "EOF":
                        ret.push(`(tar[i].${target}${r}="${c}")`);
                        break;
                    case "token":
                        ret.push(`(tar[i].${target}${r}="token"||tar[i].${target}${r}="string")`);
                        break;
                    default:
                        throw "error 1: \""+c+"\" has not caught";
                        break;
                }
            }
            else {
                switch (c) {
                    case "space":
                    case "sharp":
                    case "exclam":
                    case "colon":
                    case "dot":
                    case "semicolon":
                    case "comma":
                    case "quot":
                    case "lparen":
                    case "rparen":
                    case "lbracket":
                    case "rbracket":
                    case "asterisk":
                    case "LF":
                    case "backslash":
                    case "lt":
                    case "gt":
                    case "lassign":
                    case "lassign_":
                        ret.push(`(tar[i].${target}${r}="${condition[c]}")`);
                        break;
                    case "include":
                    case "using":
                    case "replace":
                    case "global":
                    case "fn":
                    case "local":
                    case "ctrl":
                    case "else":
                    case "elseif":
                        ret.push(`(tar[i].${target}${r}="${c}")`);
                        break;
                    case "depth=0":
                        ret.push(`(depth==0)`);
                        break;
                    case "depth>0":
                        ret.push(`(depth>0)`);
                    case "depth=1":
                        ret.push(`(depth==1)`);
                        break;
                    case "depth>1":
                        ret.push(`(depth>1)`);
                    case "*":
                        break;
                    default:
                        throw "error 2: \""+c+"\" has not caught";
                        break;
                }
            }
        }
    }
    if (ret.length == 0) {
        return ""
    }
    return `${ret.join(split_char + split_char)}`
}
main("./spec/nlp-parser-statetransition.md","./nlp.ts")