# トークナイザの状態遷移

## 全体図
```mermaid
stateDiagram-v2

```
## 部分
```mermaid
stateDiagram-v2
start --> split: space|colon|dot|comma|semicolon
start --> special: exclam|lparen|rparen|lbracket|rbracket
start --> comment.start: sharp
start --> LF: LF
start --> string.start: quot
start --> token: *

split --> split: space|colon|dot|comma|semicolon
split --> special: exclam|lparen|rparen|lbracket|rbracket
split --> comment.start: sharp
split --> string.start: quot
split --> LF: LF
split --> token: *

special --> split: space|colon|dot|comma|semicolon
special --> special: exclam|lparen|rparen|lbracket|rbracket
special --> comment.start: sharp
special --> string.start: quot
special --> LF: LF
special --> token: *

token --> split: space|colon|dot|comma|semicolon
token --> special: exclam|lparen|rparen|lbracket|rbracket
token --> comment.start: sharp
token --> string.start: quot
token --> LF: LF
token --> token: *

LF --> split: space|colon|dot|comma|semicolon
LF --> special: exclam|lparen|rparen|lbracket|rbracket
LF --> comment.start: sharp
LF --> string.start: quot
LF --> LF: LF
LF --> token: *

comment.start --> comment.blockstart: asterisk
comment.start --> comment.linecomment: !asterisk

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

comment.blockend --> split: space|colon|dot|comma|semicolon
comment.blockend --> special: exclam|lparen|rparen|lbracket|rbracket
comment.blockend --> comment.start: sharp
comment.blockend --> string.start: quot
comment.blockend --> LF: LF
comment.blockend --> token: *


```