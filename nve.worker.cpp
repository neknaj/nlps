#include <fstream>
#include <iostream>
#include <vector>

bool endRunning();
void next();
void runall();

uint32_t size = 0;
uint8_t* pdata;

uint32_t memr_length = 100;
uint32_t* memr;
uint32_t progcnt = 0;
uint32_t stackp = 0;
uint32_t framp = 0;

int main(int argc,char* argv[]) {
    char* fname = argv[1];
    std::cout << "File: " << fname << std::endl;
    std::ifstream ifs(fname, std::ios::in|std::ios::binary);
    if (ifs.fail()) {
        std::cerr << "Failed to open file." << std::endl;
        return 1;
    }
    uint8_t _data;
    int i=0;
    char* mn = (char*)"nveof\n";
    while (!ifs.eof()&&i<10) {
        ifs.read((char*)&_data,sizeof(uint8_t));
        if (i<6&&_data!=mn[i]) {
            std::cout << "This file is not NVE-OF" << std::endl;
            return 1;
        }
        else if (i>5) {
            size += _data*(1<<(i-6)*8);
        }
        i++;
    }
    std::cout << "size: " << size << std::endl;
    pdata = (uint8_t*)malloc(size*5);
    i=0;
    while (!ifs.eof()&&i<size*5) {
        ifs.read((char*)&_data,sizeof(uint8_t));
        pdata[i] = _data;
        i++;
    }
    // for (int a=0;a<size*5;a++) {
    //     std::cout << (int)pdata[a] << " ";
    // }
    memr = (uint32_t*)malloc(sizeof(uint32_t)*memr_length);
    runall();
    return 0;
}

int prog(uint32_t i) {
    return (int)pdata[i*5];
}
uint32_t imme(uint32_t i) {
    return (int)pdata[i*5+1]+(int)pdata[i*5+2]*0x100+(int)pdata[i*5+3]*0x10000+(int)pdata[i*5+4]*0x1000000;
}

void push(uint32_t i) {
    memr[stackp] = i;
    stackp++;
}
uint32_t pop() {
    memr[stackp] = 0;
    stackp--;
    return memr[stackp];
}

void runall() {
    int cnt = 0;
    while (cnt<100000&&!endRunning()) {
        cnt++;
        next();
    }
}
bool endRunning() {
    return progcnt>=size;
}

void next() {
    if (endRunning()) {
        std::cerr << "end runnning" << std::endl;
    }

    //std::cout << prog(progcnt) << " " << imme(progcnt) << " " << progcnt << std::endl;

    uint64_t cs;
    switch (prog(progcnt))
    {
        case 0: // push
            push(imme(progcnt));
        break;
        case 1: // pop n
            for (int i=0;i<imme(progcnt);i++) {
                pop();
            }
        break;
        case 2: // call
            push(framp);
            framp = stackp;
            push(progcnt);
            progcnt = imme(progcnt);
        break;
        case 3: // ret
            progcnt = pop();
            framp = pop();
        break;
        case 4: // fram m
            for (int i=0;i<imme(progcnt);i++) {
                push(0);
            }
        break;
        case 5: // setvar a
            memr[(framp+imme(progcnt))&(4294967295)] = pop();
        break;
        case 6: // getvar a
            push(memr[(framp+imme(progcnt))&(4294967295)]);
        break;
        case 7: // setgvar a
            memr[(imme(progcnt))&(4294967295)] = pop();
        break;
        case 8: // getgvar
            push(memr[(imme(progcnt))&(4294967295)]);
        break;
        case 9: // setdata a
            memr[memr_length-(imme(progcnt)&4294967295)] = pop();
        break;
        case 10: // getdata a
            push(memr[memr_length-(imme(progcnt)&4294967295)]);
        break;
        case 11: // jmp
            progcnt = imme(progcnt);
        break;
        case 12: // ifjmp
            if (pop!=0) {
                progcnt = imme(progcnt);
            }
        break;
        case 13: // add
            push(pop()+pop());
        break;
        case 14: // addc
            cs = pop()+pop()+pop();
            push(cs>>16>>16);
            push(cs&(4294967295));
        break;
        case 15: // and
            push(pop()&pop());
        break;
        case 16: // or
            push(pop()|pop());
        break;
        case 17: // xor
            push(pop()^pop());
        break;
        case 18: // equal
            push(pop()==pop());
        break;
        case 19: // less
            push(pop()<pop());
        break;
        case 20: // greater
            push(pop()>pop());
        break;
        case 21: // enot
            push(~pop());
        break;
        case 22: // notb
            push(!pop());
        break;
        case 23: // out
            std::cout << "[output] " << std::hex << pop() << std::endl;
        break;
        default:
        break;
    }
    progcnt++;
}