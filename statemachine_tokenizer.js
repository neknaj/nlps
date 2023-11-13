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
    let statenamearr = ["start","LF","comment.LF","blank","split","special"] // idを固定するstate
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
    ret1.push("switch(state){")
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
    let indent1 = Array(4*3).fill(" ").join("");
    let indent2 = Array(4*2).fill(" ").join("");
    let nlpts_before = fRead(nlpts);
    let nlpts_new = "";
    nlpts_new += nlpts_before.substring(0,nlpts_before.indexOf("/*TokenizerReplace_states_start*/")+"/*TokenizerReplace_states_start*/".length) +"\n";
    nlpts_new += indent2+"this.tokenizerstates = [\"" + statenamearr.join("\",\"") + "\"]" +"\n";
    nlpts_new += indent2+nlpts_before.substring(nlpts_before.indexOf("/*TokenizerReplace_states_end*/"),nlpts_before.indexOf("/*TokenizerReplace_switch_start*/")+"/*TokenizerReplace_switch_start*/".length) +"\n";
    for (line of ret1) {
        nlpts_new += indent1+line +"\n";
    }
    nlpts_new += indent1+nlpts_before.substring(nlpts_before.indexOf("/*TokenizerReplace_switch_end*/"));
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
            switch (c) {
                case "colon":
                case "gt":
                case "sharp":
                    ret.push(`(tc[i+1]=="${condition[c]}")`);
                    break;
                default:
                    throw "error 1: \""+c+"\" has not caught";
                    break;
            }
        }
        else {
            let r = "=";
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
                case "lt":
                case "gt":
                    ret.push(`(tc[i]${r}="${condition[c]}")`);
                    break;
                case "*":
                    break;
                default:
                    throw "error 2: \""+c+"\" has not caught";
                    break;
            }
        }
    }
    if (ret.length == 0) {
        return ""
    }
    return `${ret.join(split_char + split_char)}`
}
main("./spec/nlp-tokenizer-statetransition.md","./nlp.ts")