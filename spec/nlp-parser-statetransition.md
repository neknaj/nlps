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
TopLevel --> TL.LF: $LF
TopLevel --> Error: *

TL.comment --> TopLevel: *
TL.LF --> TopLevel: *

TLDefinition.exclam --> TLDefinition.include: $token&include
TLDefinition.exclam --> TLDefinition.using: $token&using
TLDefinition.exclam --> TLDefinition.define: $token&define
TLDefinition.exclam --> TLDefinition.global: $token&global
TLDefinition.exclam --> TLDefinition.func: $token&fn
TLDefinition.exclam --> Error: *

TLDefinition.include --> TLDefinition.include.colon1: $split&colon
TLDefinition.include --> Error: *
TLDefinition.include.colon1 --> TLDefinition.include.blank1: $split&space
TLDefinition.include.colon1 --> TLDefinition.include.filename: $token

TLDefinition.include.blank1 --> TLDefinition.include.blank1: $split&space
TLDefinition.include.blank1 --> TLDefinition.include.filename: $token
TLDefinition.include.blank1 --> Error: *
TLDefinition.include.filename --> TLDefinition.include.blank2: $split&space
TLDefinition.include.filename --> TLDefinition.include.EOS: $split&semicolon
TLDefinition.include.filename --> Error: *
TLDefinition.include.blank2 --> TLDefinition.include.blank2: $split&space
TLDefinition.include.blank2 --> TLDefinition.include.EOS: $split&semicolon
TLDefinition.include.blank2 --> Error: *
TLDefinition.include.EOS --> TopLevel: *

TLDefinition.using --> TLDefinition.using.colon1: $split&colon
TLDefinition.using --> Error: *
TLDefinition.using.colon1 --> TLDefinition.using.blank1: $split&space
TLDefinition.using.colon1 --> TLDefinition.using.filename: $token
TLDefinition.using.colon1 --> Error: *
TLDefinition.using.blank1 --> TLDefinition.using.blank1: $split&space
TLDefinition.using.blank1 --> TLDefinition.using.filename: $token
TLDefinition.using.blank1 --> Error: *
TLDefinition.using.filename --> TLDefinition.using.blank2: $split&space
TLDefinition.using.filename --> TLDefinition.using.EOS: $split&semicolon
TLDefinition.using.filename --> Error: *
TLDefinition.using.blank2 --> TLDefinition.using.blank2: $split&space
TLDefinition.using.blank2 --> TLDefinition.using.EOS: $split&semicolon
TLDefinition.using.blank2 --> Error: *
TLDefinition.using.EOS --> TopLevel: *

TLDefinition.define --> TLDefinition.define.colon1: $split&colon
TLDefinition.define --> Error: *
TLDefinition.define.colon1 --> TLDefinition.define.blank1: $split&space
TLDefinition.define.colon1 --> TLDefinition.define.defname: $token
TLDefinition.define.colon1 --> Error: *
TLDefinition.define.blank1 --> TLDefinition.define.blank1: $split&space
TLDefinition.define.blank1 --> TLDefinition.define.defname: $token
TLDefinition.define.blank1 --> Error: *
```