const fs = require("fs");

function NVEASM(program) { // テキストを数値の配列に変換する
    let ins = ["push","pop","call","ret","fram","setvar","getvar","setgvar","getgvar","setdata","getdata","jmp","ifjmp","add","addc","and","or","xor","equal","less","greater","notb","not","out"];
    let icnt = 0;
    // m memory; i immeddiate; p memory-pointer; x result; a,b args;
    let lines = program.replace(/\r/g,"").split("\n");
    //console.log("lines",lines)
    let tlss = [];
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
        if (tl[0]==".") {
            let tls = tl.split(" ");
            let ns = ""; // name space (file name)
            console.log(tls);
            switch (tls) {
            }
            continue;
        }
        else {
            if (tl.length==0) {continue;}
            let tls = tl.split(" ");
            tlss.push(tls);
            if (ins.indexOf(tls[0])==-1) {continue;}
            icnt++;
            if (tls[tls.length-1]==":") {icnt--;}
        }
    }
    let progbuffer = new ArrayBuffer(icnt);
    let immebuffer = new ArrayBuffer(icnt*4);
    let _progbuffer = new Uint8Array(progbuffer);
    let _immebuffer = new Uint32Array(immebuffer);
    let ic = 0;
    let labeladr = {};
    for (let i=0;i<tlss.length;i++) {
        ic++;
        if (tlss[i][0][tlss[i][0].length-1]==":") {
            ic--;
            labeladr[tlss[i][0].slice(0,tlss[i][0].length-1)] = ic;
        }
    }
    ic = 0;
    let comp = function(n){if(n<0){return (~-n)+1;}else{return n;}}
    for (let i=0;i<tlss.length;i++) {
        if (tlss[i][0][tlss[i][0].length-1]==":") {continue;}
        if (ins.indexOf(tlss[i][0])==-1) {continue;}
        _progbuffer[ic] = ins.indexOf(tlss[i][0]);
        if (["call"].indexOf(tlss[i][0])!=-1) {
            _immebuffer[ic] = comp(labeladr[tlss[i][1]]-1);
        }
        else if (["jmp","ifjmp"].indexOf(tlss[i][0])!=-1) {
            _immebuffer[ic] = comp(labeladr[tlss[i][1]]-1);
        }
        else if (tlss[i].length>0) {
            _immebuffer[ic] = comp(parseInt(tlss[i][1]));
        }
        ic++;
    }
    return [progbuffer,immebuffer,icnt];
}

function main(path) {
    let file = fs.readFileSync(path,"utf-8");
    //console.log(file);
    let val = NVEASM(file);
    let progbuffer = new Uint8Array(val[0]);
    let immebuffer = new Uint8Array(val[1]);
    let retbuffer = new ArrayBuffer(val[2]*5);
    let _retbuffer = new Uint8Array(retbuffer);
    for (let i=0;i<val[2];i++) {
        _retbuffer[i*5+0] = progbuffer[i];
        _retbuffer[i*5+1] = immebuffer[i*4+0];
        _retbuffer[i*5+2] = immebuffer[i*4+1];
        _retbuffer[i*5+3] = immebuffer[i*4+2];
        _retbuffer[i*5+4] = immebuffer[i*4+3];
    }
    let head = "nveof\n";
    let headbuf =  txt2arr(head);
    let size_buf = new ArrayBuffer(4);
    let size_ = new Uint32Array(size_buf);
    size_[0] = val[2];
    let data = Buffer.concat([Buffer.from(headbuf),Buffer.from(size_buf),Buffer.from(retbuffer)])
    fs.writeFile(fname+".nveof", data, (err) => {
        if (err) throw err;
        console.log('Completed');
    });
}

function txt2arr(txt) {
    return (new TextEncoder("utf-8")).encode(txt);
}



let path = process.argv[2];
let fname = path.split(".")[0];
if (path==null) {
    console.log("Failed to open file.");
    return;
}
fs.stat( path , ( er , stat ) => {
    if( er ){
        console.log("Failed to open file.");
        return;
    }else{
        if (stat.isFile()) {
            console.log("File:",path);
            main(path);
        }
        else {
            console.log("Failed to open file.")
            return;
        }
    }
});