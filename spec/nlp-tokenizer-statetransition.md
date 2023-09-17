# トークナイザの状態遷移

## 全体図
```mermaid
stateDiagram-v2

```
## 部分
```mermaid
stateDiagram-v2
start --> split: space
start --> split: colon
start --> split: dot
start --> split: comma
start --> split: semicolon
start --> split: LF
start --> special: exclam
start --> special: lparen
start --> special: rparen
start --> special: lbracket
start --> special: rbracket
start --> comment.start: sharp
start --> token: *

split --> split: space|colon|dot|comma|semicolon|LF
split --> special: exclam|lparen|rparen|lbracket|rbracket
```