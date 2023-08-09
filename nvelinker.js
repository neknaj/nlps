const fs = require("fs");
const path = require("path");

let argv = process.argv[2];

LoadFiles(argv)
function LoadFiles(main) {
    let tfname = path.basename(main)
    if (tfname.split(".").length!=2) { throw `File name not allowed [${tfname}]` }
    let tns = tfname.split(".")[0];
    if (tns=="this") { throw `File name not allowed [${tns}]` }
    let tfextension = tfname.split(".")[tfname.split(".").length-1];
    if (tfextension!="nva") { throw `File extension is different [${tfextension}]` }

    let ret = dependFile(tns,{},{});
    let filesdata = ret[0];
    let funcdata = ret[1];
    //console.log(filesdata)
    let allprog = [];
    let namespaces = Object.keys(filesdata);
    for (let ns of namespaces) {
        allprog = allprog.concat(filesdata[ns]);
    }

    for (let i=0;i<allprog.length;i++) {
        if (allprog[i][0]!="call") {continue;}
        allprog[i][1] = funcdata[allprog[i][1]]
    }
    
    // console.log(allprog)
    // console.log(funcdata)

    let lcnct = [];
    for (let line of allprog) {
        lcnct.push(line.join(" "));
    }
    let data = `jmp #callmain\n\n`+lcnct.join("\n")+`\n\n#callmain:\ncall ${tns}.main`
    fs.writeFile(tns+".nvel", data, (err) => {
        if (err) throw err;
        console.log('Completed');
    });
}

function dependFile(tns,filedata,funcdata) {
    let parse = NVAparse(readFile(tns),tns);
    filedata[tns] = parse.filedata;
    for (let func of Object.keys(parse.func)) {
        funcdata[func] = parse.func[func]
    }
    for (let ns of parse.ns) {
        if (filedata[ns]==null) {
            dependFile(ns,filedata,funcdata)
        }
    }
    return [filedata,funcdata]
}

function readFile(tns) {
    fpath = tns+".nva";
    if (fpath==null) { throw `Failed to open file [${fpath}]` }
    let stat = fs.statSync(fpath);
    if (stat.isFile()) {
        let file = fs.readFileSync(fpath);
        return (new TextDecoder("utf-8")).decode(new Uint8Array(file))
    }
    else { throw `Failed to open file [${fpath}]` }
}

function NVAparse(program,tns) {
    let ins = ["push","pop","call","ret","fram","setvar","getvar","setgvar","getgvar","setdata","getdata","jmp","ifjmp","add","addc","and","or","xor","equal","less","greater","not","notb","out"];
    // m memory; i immeddiate; p memory-pointer; x result; a,b args;
    let lines = program.replace(/\r/g,"").split("\n");
    //console.log("lines",lines)
    let tlss = [];
    let importfunc = [];
    let calledns = [];
    let definedfunc = [];
    let funcdef = {};
    for (let l=0;l<lines.length;l++) {
        let s;
        for (s=0;s<lines[l].length;s++) {
            if (lines[l][s]!=" ") {break;}
        }
        let c;
        for (c=0;c<lines[l].length;c++) {
            if (lines[l][c]==";") {break;}
        }
        let tl = lines[l].slice(s,c);
        let tls = tl.split(" ");
        if (tl[0]==".") {
            switch (tls[0].slice(1)) {
                case "func":
                    if (funcdef[tns+"."+tls[1]]!=null) {
                        throw `A function with this name has already been defined [${tns+"."+tls[1]}]`
                    }
                    definedfunc.push(tns+"."+tls[1])
                    funcdef[tns+"."+tls[1]] = tns+"."+tls[2];
                    break;
            }
            continue;
        }
        if (tl.length==0) {continue;}
        while (tls[tls.length-1]=="") {tls.pop()}
        tlss.push(tls);
        if (tls[0][tls[0].length-1]==":") {
            tlss[tlss.length-1][0] = tns+"."+tlss[tlss.length-1][0];
        }
        if (tls[0]=="call") {
            if (tls[1].startsWith("this.")) {tls[1] = tls[1].replace("this",tns)}
            let timportfunc = tls[1].split(":");
            let timportfname = timportfunc[0].split(".");
            if (calledns.indexOf(timportfname[0])==-1) { calledns.push(timportfname[0]) }
            if (importfunc.indexOf(tls[1])==-1) {importfunc.push(tls[1])}
        }
        if (tls[0]=="jmp"||tls[0]=="ifjmp") {
            tls[1] = tns+"."+tls[1];
        }
    }
    // console.log(tlss)
    // console.log("ns",calledns)
    // console.log("call",importfunc)
    // console.log("def",definedfunc)
    // console.log("func",funcdef)
    return {filedata:tlss,ns:calledns,func:funcdef};
}