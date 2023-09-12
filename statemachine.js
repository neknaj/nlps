const fs = require('fs');

function fRead(filename) {
    return fs.readFileSync(filename, 'utf8').replace(/\r\n/g, "\n");
};


function main(filename) {
    let fdata = fRead(filename)
    console.log(fdata)
    let ret = []
    for (let line of fdata.split("\n")) {

        let transion = line.replace(/\s/g,"").match(/^.*?(?=-)|(?<=>).*?(?=:)|(?<=:).+/g)
        if (transion!=null&&transion.length==3) {
            console.log(transion.join(" "))
            ret.push(`if (state=="${transion[0]}"&&${procCond(transion[2])}) {}`)
        }
        // ["gVarDef.Colon1","gVarDef.Blank1","space"]
    }
    console.table(ret)
    console.log(ret.join("\n"))
}
function procCond(cond) {
    let ret = []
    for (let c of cond.split("&")) {
        let r = "";
        if (c[0]=="!") {
            r += "!"
            r = r.slice(1)
        }
        switch (c) {
            case "space":
            case "sharp":
            case "exclam":
            case "semicolon":
            case "LF":
                r += `this.code[i]==${c}`
                ret.push(r)
                break;
            default:
                break;
        }
    }
    return ret.join("&&")
}
main("./spec/nlp-tokenizer-statetransition.md")
