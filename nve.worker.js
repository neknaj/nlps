const fs = require("fs");
class NVE {
    #memr;#progcnt;#stackp;#framp; // 宣言
    constructor(file,args=[0]) { // 初期化
        this.file = file;
        this.check(file);
        let _size = new Uint8Array((this.file.slice(6,10)))
        this.size = _size[0]+_size[1]*0x100+_size[2]*0x10000+_size[3]*0x1000000;
        console.log("Size:",this.size.toString(10))
        this.#memr = new Uint32Array(2**32); // 実行用スタック
        this.#progcnt = 0;
        this.#stackp = 1;
        this.#framp = 0;
    }
    prog(i) {
        let a = new Uint8Array(this.file.slice(10+i*5,10+i*5+1))
        return a[0];
    }
    imme(i) {
        let a = new Uint8Array(this.file.slice(10+i*5+1,10+i*5+5))
        return a[0]+a[1]*0x100+a[2]*0x10000+a[3]*0x1000000;
    }
    push(x) {
        this.#memr[this.#stackp] = x;
        this.#stackp++;
    }
    pop() {
        this.#memr[this.#stackp] = 0;
        this.#stackp--;
        return this.#memr[this.#stackp];
    }
    next() { // 一つの命令を実行する
        if (this.endRunning()) {console.warn("end runnning")}
        //console.log(this.#progcnt,this.#prog[this.#progcnt],this.#imme[this.#progcnt])
        // let memshow = function(mem,sp,fp) {
        //     let ret = "";
        //     for (let i=0;i<mem.length;i++) {
        //         if (fp==i) {ret += ","}else {ret += " "}
        //         if (sp==i) {ret += "."}else {ret += " "}
        //         let memi = mem[i];
        //         let n = memi.toString(16);
        //         ret += "00000000".slice(n.length);
        //         ret += n;
        //     }
        //     return ret
        // }
        // let ins = ["push","pop","call","ret","fram","setvar","getvar","setgvar","getgvar","setdata","getdata","jmp","ifjmp","add","addc","and","or","xor","equal","less","greater","not","notb","out"];
        // console.log("[internal state]"," mem:",memshow(this.#memr.slice(0,17),this.#stackp,this.#framp)," pc:",this.#progcnt.toString(16)," sp:",this.#stackp.toString(16)," fp:",this.#framp.toString(16))
        // console.log("")
        // console.log("[next]"," opcode:",this.prog(this.#progcnt).toString(16)," mnemonic:",ins[this.prog(this.#progcnt)]," immediate:",this.imme(this.#progcnt).toString(16))
        // let adr = function(n) {return n&((2**32)-1);};
        switch (this.prog(this.#progcnt)) {
            case 0: // push n スタックに即値を入れる
                this.push(this.imme(this.#progcnt));
            break;
            case 1: // pop n スタックトップの値をn個消す
                for (let i=0;i<this.imme(this.#progcnt);i++) {
                    this.pop();
                }
            break;
            case 2: // call 関数を呼ばれたとき
                this.push(this.#framp);
                this.#framp = this.#stackp;
                this.push(this.#progcnt);
                this.#progcnt = this.imme(this.#progcnt);
            break;
            case 3: // ret 関数から返るとき
                this.#progcnt = this.pop();
                this.#framp = this.pop();
                for (let i=0;i<this.imme(this.#progcnt);i++) {
                    this.pop();
                }
            break;
            case 4: // fram m 局所変数の領域を確保する 0埋めする
                for (let i=0;i<this.imme(this.#progcnt);i++) {
                    this.push(0);
                }
            break;
            // データ移動命令
            case 5: // setvar a a個目の局所変数に値を入れる
                this.#memr[(this.#framp+this.imme(this.#progcnt))&(4294967295)] = this.pop();
            break;
            case 6: // getvar a a個目の局所変数から値を複製する
                this.push(this.#memr[(this.#framp+this.imme(this.#progcnt))&(4294967295)]);
            break;
            case 7: // setgvar a a個目のグローバル変数に値を入れる
                this.#memr[(this.imme(this.#progcnt))&(4294967295)] = this.pop();
            break;
            case 8: // getgvar a a個目のグローバル変数から値を複製する
                this.push(this.#memr[(this.imme(this.#progcnt))&(4294967295)]);
            break;
            case 9: // setdata a a個目のヒープ領域に値を入れる
                this.#memr[this.#memr.length-((this.imme(this.#progcnt))&(4294967295))] = this.pop();
            break;
            case 10: // getdata a a個目のヒープ領域から値を複製する
                this.push(this.#memr[this.#memr.length-((this.imme(this.#progcnt))&(4294967295))]);
            break;
            // ジャンプ命令
            case 11: // jmp
                this.#progcnt = this.imme(this.#progcnt);
            break;
            case 12: // ifjmp
                if (this.pop()!=0) {
                    this.#progcnt = this.imme(this.#progcnt);
                }
            break;

            // 2項算術演算
            case 13: // add
                this.push(this.pop()+this.pop());
            break;
            case 14: // addc
                let cs = this.pop()+this.pop()+this.pop();
                this.push(cs>>>32);
                this.push(cs&(4294967295));
            break;
            // 2項ビット演算
            case 15: // and
                this.push(this.pop()&this.pop());
            break;
            case 16: // or
                this.push(this.pop()|this.pop());
            break;
            case 17: // xor
                this.push(this.pop()^this.pop());
            break;
            // 2項比較演算
            case 18: // equal
                this.push(Number(this.pop()==this.pop()));
            break;
            case 19: // less
                this.push(Number(this.pop()>this.pop()));
            break;
            case 20: // greater
                this.push(Number(this.pop()<this.pop()));
            break;
            // 単項ビット演算
            case 21: // notb
                this.push(~this.pop());
            break;
            // 単項論理演算
            case 22: // not
                this.push(Number(!this.pop()));
            break;

            // 入出力命令
            case 23: // out スタックトップの値を出力
                console.log("[output],",this.pop().toString(16));
            break;
            default:
            break;
        }
        this.#progcnt++;
        return this;
    }
    runall() { // 最後まで命令を実行する(最大100000)
        let cnt = 0;
        while (cnt<100000&&!this.endRunning()) {cnt++;this.next();}
        return this;
    }
    check(file) {
        if (!(new TextDecoder("utf-8")).decode(new Uint8Array(file)).startsWith("nveof\n")) {
            throw "This file is not NVE-OF";
        }
    }
    endRunning() {return this.#progcnt>=this.size}
}

let path = process.argv[2];
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
            let a = new NVE(fs.readFileSync(path));
            a.runall();
            // console.log(a.getData())
        }
        else {
            console.log("Failed to open file.")
            return;
        }
    }
});