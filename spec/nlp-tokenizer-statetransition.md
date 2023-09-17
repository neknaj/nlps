# トークナイザの状態遷移

## 全体図
```mermaid
stateDiagram-v2

```
## 部分
```mermaid
stateDiagram-v2
start --> split: space|colon|dot|comma|semicolon|LF
start --> special: exclam|lparen|rparen|lbracket|rbracket
start --> comment.start: sharp
start --> string.start: quot
start --> token: *

split --> split: space|colon|dot|comma|semicolon|LF
split --> special: exclam|lparen|rparen|lbracket|rbracket
split --> comment.start: sharp
split --> string.start: quot
split --> token: *

special --> split: space|colon|dot|comma|semicolon|LF
special --> special: exclam|lparen|rparen|lbracket|rbracket
special --> comment.start: sharp
special --> string.start: quot
special --> token: *

comment.start --> comment.blockstart: asterisk
comment.start --> comment.linecomment: !asterisk

comment.linecomment --> comment.linecomment: !LF
comment.linecomment --> comment.lineend: LF

comment.blockstart --> comment.blockend: sharp
comment.blockstart --> comment.blockcomment: !sharp&!LF
comment.blockstart --> comment.LF: LF
comment.blockcomment --> comment.blockend: sharp
comment.blockcomment --> comment.blockcomment: !sharp&!LF
comment.blockcomment --> comment.LF: LF
comment.LF --> comment.blockend: sharp
comment.LF --> comment.blockcomment: !sharp&!LF
comment.LF --> comment.LF: LF

comment.lineend --> split: space|colon|dot|comma|semicolon|LF
comment.lineend --> special: exclam|lparen|rparen|lbracket|rbracket
comment.lineend --> comment.start: sharp
comment.lineend --> string.start: quot
comment.lineend --> token: *
comment.blockend --> split: space|colon|dot|comma|semicolon|LF
comment.blockend --> special: exclam|lparen|rparen|lbracket|rbracket
comment.blockend --> comment.start: sharp
comment.blockend --> string.start: quot
comment.blockend --> token: *


```