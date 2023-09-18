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
start --> split: space|colon|dot|comma|semicolon
start --> special: exclam|lparen|rparen|lbracket|rbracket
start --> comment.start: sharp
start --> LF: LF
start --> string.start: quot
start --> token: *

split --> lassign: colon&'gt
split --> rassign: lt&'colon
split --> split: space|colon|dot|comma|semicolon
split --> special: exclam|lparen|rparen|lbracket|rbracket
split --> comment.start: sharp
split --> string.start: quot
split --> LF: LF
split --> token: *

special --> lassign: colon&'gt
special --> rassign: lt&'colon
special --> split: space|colon|dot|comma|semicolon
special --> special: exclam|lparen|rparen|lbracket|rbracket
special --> comment.start: sharp
special --> string.start: quot
special --> LF: LF
special --> token: *

token --> lassign: colon&'gt
token --> rassign: lt&'colon
token --> split: space|colon|dot|comma|semicolon
token --> special: exclam|lparen|rparen|lbracket|rbracket
token --> comment.start: sharp
token --> string.start: quot
token --> LF: LF
token --> token: *

LF --> lassign: colon&'gt
LF --> rassign: lt&'colon
LF --> split: space|colon|dot|comma|semicolon
LF --> special: exclam|lparen|rparen|lbracket|rbracket
LF --> comment.start: sharp
LF --> string.start: quot
LF --> LF: LF
LF --> token: *

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

comment.blockstart --> comment.blockend: sharp
comment.blockstart --> comment.blockcomment: !sharp&!LF
comment.blockstart --> comment.LF: LF
comment.blockcomment --> comment.blockend: sharp
comment.blockcomment --> comment.blockcomment: !sharp&!LF
comment.blockcomment --> comment.LF: LF
comment.LF --> comment.blockend: sharp
comment.LF --> comment.blockcomment: !sharp&!LF
comment.LF --> comment.LF: LF

comment.blockend --> lassign: colon&'gt
comment.blockend --> rassign: lt&'colon
comment.blockend --> split: space|colon|dot|comma|semicolon
comment.blockend --> special: exclam|lparen|rparen|lbracket|rbracket
comment.blockend --> comment.start: sharp
comment.blockend --> string.start: quot
comment.blockend --> LF: LF
comment.blockend --> token: *

string.start --> string.escape1: backslash
string.start --> LF: LF
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

string.end --> lassign: colon&'gt
string.end --> rassign: lt&'colon
string.end --> split: space|colon|dot|comma|semicolon
string.end --> special: exclam|lparen|rparen|lbracket|rbracket
string.end --> comment.start: sharp
string.end --> LF: LF
string.end --> string.start: quot
string.end --> token: *

lassign --> lassign_: *
rassign --> lassign_: *

lassign_ --> lassign: colon&'gt
lassign_ --> rassign: lt&'colon
lassign_ --> split: space|colon|dot|comma|semicolon
lassign_ --> special: exclam|lparen|rparen|lbracket|rbracket
lassign_ --> comment.start: sharp
lassign_ --> LF: LF
lassign_ --> string.start: quot
lassign_ --> token: *

rassign_ --> lassign: colon&'gt
rassign_ --> rassign: lt&'colon
rassign_ --> split: space|colon|dot|comma|semicolon
rassign_ --> special: exclam|lparen|rparen|lbracket|rbracket
rassign_ --> comment.start: sharp
rassign_ --> LF: LF
rassign_ --> string.start: quot
rassign_ --> token: *

```