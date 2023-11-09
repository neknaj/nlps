# トークナイザの状態遷移

## 全体図
```mermaid
stateDiagram-v2
```
## 部分
```mermaid
stateDiagram-v2
start --> lassign: colon&'gt
start --> rassign: lt&'colon
start --> split: space|colon|comma|semicolon
start --> special: exclam|lparen|rparen|lbracket|rbracket
start --> comment.start: sharp
start --> LF: LF
start --> string.start: quot
start --> token: *


comment.start --> comment.notestart: colon
comment.start --> comment.blockstart: asterisk
comment.start --> LF: LF
comment.start --> comment.linecomment: *

comment.notestart --> comment.notebeforeblank: space
comment.notestart --> comment.note: !LF
comment.notestart --> LF: LF
comment.notebeforeblank --> comment.note: !LF
comment.notebeforeblank --> LF: LF
comment.note --> comment.note: !LF
comment.note --> LF: LF

comment.linecomment --> comment.linecomment: !LF
comment.linecomment --> LF: LF

comment.blockstart --> comment.blockend: asterisk&'sharp
comment.blockstart --> comment.blockcomment: !sharp&!LF
comment.blockstart --> comment.LF: LF
comment.blockcomment --> comment.blockend: sharp
comment.blockcomment --> comment.blockcomment: !sharp&!LF
comment.blockcomment --> comment.LF: LF
comment.LF --> comment.blockend: sharp
comment.LF --> comment.blockcomment: !sharp&!LF
comment.LF --> comment.LF: LF


string.start --> string.escape1: backslash
string.start --> LF: LF
string.start --> string.end: quot
string.start --> string.space: space
string.start --> string.char: *

string.char --> LF: LF
string.char --> string.escape1: backslash
string.char --> string.end: quot
string.char --> string.space: space
string.char --> string.char: *

string.space --> LF: LF
string.space --> string.escape1: backslash
string.space --> string.end: quot
string.space --> string.space: space
string.space --> string.char: *

string.escape1 --> LF: LF
string.escape1 --> string.escape2: *
string.escape2 --> LF: LF
string.escape2 --> string.end: quot
string.escape2 --> string.escape1: backslash
string.escape2 --> string.space: space
string.escape2 --> string.char: *


lassign --> lassign_: *
rassign --> rassign_: *


split --> start: *
special --> start: *
token --> start: *
LF --> start: *
comment.blockend --> start: *
string.end --> start: *
lassign_ --> start: *
rassign_ --> start: *
```