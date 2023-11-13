# トークナイザの状態遷移

## 全体図
```mermaid
stateDiagram-v2
```
## 部分
```mermaid
stateDiagram-v2
TopLevel --> TLDefinition.exclam: $special&exclam
TopLevel --> TL.comment: $comment
TopLevel --> TL.blank: $split&space
TopLevel --> TL.LF: $LF

TL.comment --> TL.note: $note
TL.comment --> TopLevel: *
TL.note --> TopLevel: *
TL.blank --> TopLevel: *
TL.LF --> TopLevel: *

TLDefinition.exclam --> TLDefinition.include: $token&include
TLDefinition.exclam --> TLDefinition.using: $token&using
TLDefinition.exclam --> TLDefinition.replace: $token&replace
TLDefinition.exclam --> TLDefinition.global: $token&global
TLDefinition.exclam --> TLDefinition.func: $token&fn

TLDefinition.include --> TLDefinition.include.colon1: $split&colon
TLDefinition.include.colon1 --> TLDefinition.include.blank1: $split&space
TLDefinition.include.colon1 --> TLDefinition.include.filename: $token
TLDefinition.include.blank1 --> TLDefinition.include.blank1: $split&space
TLDefinition.include.blank1 --> TLDefinition.include.filename: $token
TLDefinition.include.filename --> TLDefinition.include.EOS: $split&semicolon
TLDefinition.include.EOS --> TopLevel: *

TLDefinition.using --> TLDefinition.using.colon1: $split&colon
TLDefinition.using.colon1 --> TLDefinition.using.blank1: $split&space
TLDefinition.using.colon1 --> TLDefinition.using.filename: $token
TLDefinition.using.blank1 --> TLDefinition.using.blank1: $split&space
TLDefinition.using.blank1 --> TLDefinition.using.filename: $token
TLDefinition.using.filename --> TLDefinition.using.EOS: $split&semicolon
TLDefinition.using.EOS --> TopLevel: *

TLDefinition.replace --> TLDefinition.replace.colon1: $split&colon
TLDefinition.replace.colon1 --> TLDefinition.replace.blank1: $split&space
TLDefinition.replace.colon1 --> TLDefinition.replace.defname: $token
TLDefinition.replace.blank1 --> TLDefinition.replace.blank1: $split&space
TLDefinition.replace.blank1 --> TLDefinition.replace.defname: $token
TLDefinition.replace.defname --> TLDefinition.replace.colon2: $split&colon
TLDefinition.replace.colon2 --> TLDefinition.replace.blank2: $split&space
TLDefinition.replace.colon2 --> TLDefinition.replace.defval: $token
TLDefinition.replace.blank2 --> TLDefinition.replace.blank2: $split&space
TLDefinition.replace.blank2 --> TLDefinition.replace.defval: $token
TLDefinition.replace.defval --> TLDefinition.replace.EOS: $split&semicolon
TLDefinition.replace.EOS --> TopLevel: *

TLDefinition.global --> TLDefinition.global.colon1: $split&colon
TLDefinition.global.colon1 --> TLDefinition.global.blank1: $split&space
TLDefinition.global.colon1 --> TLDefinition.global.deftype: $token
TLDefinition.global.blank1 --> TLDefinition.global.blank1: $split&space
TLDefinition.global.blank1 --> TLDefinition.global.deftype: $token
TLDefinition.global.deftype --> TLDefinition.global.colon2: $split&colon
TLDefinition.global.colon2 --> TLDefinition.global.blank2: $split&space
TLDefinition.global.colon2 --> TLDefinition.global.defname: $token
TLDefinition.global.blank2 --> TLDefinition.global.blank2: $split&space
TLDefinition.global.blank2 --> TLDefinition.global.defname: $token
TLDefinition.global.defname --> TLDefinition.global.EOS: $split&semicolon
TLDefinition.global.EOS --> TopLevel: *
```
```mermaid
stateDiagram-v2
TLDefinition.func --> TLDefinition.func.colon1: $split&colon
TLDefinition.func.colon1 --> TLDefinition.func.blank1: $split&space
TLDefinition.func.colon1 --> TLDefinition.func.rettype: $token
TLDefinition.func.blank1 --> TLDefinition.func.blank1: $split&space
TLDefinition.func.blank1 --> TLDefinition.func.rettype: $token
TLDefinition.func.rettype --> TLDefinition.func.blank2: $split&space
TLDefinition.func.rettype --> TLDefinition.func.lparen: $special&lparen
TLDefinition.func.blank2 --> TLDefinition.func.blank2: $split&space
TLDefinition.func.blank2 --> TLDefinition.func.lparen: $special&lparen
TLDefinition.func.lparen --> TLDefinition.func.args.blank1: $split&space
TLDefinition.func.lparen --> TLDefinition.func.args.argstype: $token
TLDefinition.func.lparen --> TLDefinition.func.rparen: $special&rparen
    TLDefinition.func.args.blank1 --> TLDefinition.func.args.blank1: $split&space
    TLDefinition.func.args.blank1 --> TLDefinition.func.args.argstype: $token
    TLDefinition.func.args.blank1 --> TLDefinition.func.rparen: $special&rparen
    TLDefinition.func.args.argstype --> TLDefinition.func.args.colon: $split&colon
    TLDefinition.func.args.colon --> TLDefinition.func.args.blank2: $split&space
    TLDefinition.func.args.colon --> TLDefinition.func.args.defname: $token
    TLDefinition.func.args.blank2 --> TLDefinition.func.args.blank2: $split&space
    TLDefinition.func.args.blank2 --> TLDefinition.func.args.defname: $token
    TLDefinition.func.args.defname --> TLDefinition.func.args.blank3: $split&space
    TLDefinition.func.args.defname --> TLDefinition.func.args.comma: $split&comma
    TLDefinition.func.args.defname --> TLDefinition.func.rparen: $special&rparen
    TLDefinition.func.args.blank3 --> TLDefinition.func.args.blank3: $split&space
    TLDefinition.func.args.blank3 --> TLDefinition.func.args.comma: $split&comma
    TLDefinition.func.args.blank3 --> TLDefinition.func.rparen: $special&rparen
    TLDefinition.func.args.comma --> TLDefinition.func.args.blank1: $split&space
    TLDefinition.func.args.comma --> TLDefinition.func.args.argstype: $token
TLDefinition.func.rparen --> TLDefinition.func.colon2: $split&colon
TLDefinition.func.colon2 --> TLDefinition.func.blank3: $split&space
TLDefinition.func.colon2 --> TLDefinition.func.defname: $token
TLDefinition.func.blank3 --> TLDefinition.func.blank3: $split&space
TLDefinition.func.blank3 --> TLDefinition.func.defname: $token
```