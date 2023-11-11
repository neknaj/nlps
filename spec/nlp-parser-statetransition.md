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
TopLevel --> Error: *

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
TLDefinition.exclam --> Error: *

TLDefinition.include --> TLDefinition.include.colon1: $split&colon
TLDefinition.include --> Error: *
TLDefinition.include.colon1 --> TLDefinition.include.blank1: $split&space
TLDefinition.include.colon1 --> TLDefinition.include.filename: $token
TLDefinition.include.blank1 --> TLDefinition.include.blank1: $split&space
TLDefinition.include.blank1 --> TLDefinition.include.filename: $token
TLDefinition.include.blank1 --> Error: *
TLDefinition.include.filename --> TLDefinition.include.EOS: $split&semicolon
TLDefinition.include.filename --> Error: *
TLDefinition.include.EOS --> TopLevel: *

TLDefinition.using --> TLDefinition.using.colon1: $split&colon
TLDefinition.using --> Error: *
TLDefinition.using.colon1 --> TLDefinition.using.blank1: $split&space
TLDefinition.using.colon1 --> TLDefinition.using.filename: $token
TLDefinition.using.colon1 --> Error: *
TLDefinition.using.blank1 --> TLDefinition.using.blank1: $split&space
TLDefinition.using.blank1 --> TLDefinition.using.filename: $token
TLDefinition.using.blank1 --> Error: *
TLDefinition.using.filename --> TLDefinition.using.EOS: $split&semicolon
TLDefinition.using.filename --> Error: *
TLDefinition.using.EOS --> TopLevel: *

TLDefinition.replace --> TLDefinition.replace.colon1: $split&colon
TLDefinition.replace --> Error: *
TLDefinition.replace.colon1 --> TLDefinition.replace.blank1: $split&space
TLDefinition.replace.colon1 --> TLDefinition.replace.defname: $token
TLDefinition.replace.colon1 --> Error: *
TLDefinition.replace.blank1 --> TLDefinition.replace.blank1: $split&space
TLDefinition.replace.blank1 --> TLDefinition.replace.defname: $token
TLDefinition.replace.blank1 --> Error: *
TLDefinition.replace.defname --> TLDefinition.replace.colon2: $split&colon
TLDefinition.replace.defname --> Error: *
TLDefinition.replace.colon2 --> TLDefinition.replace.blank2: $split&space
TLDefinition.replace.colon2 --> TLDefinition.replace.defval: $token
TLDefinition.replace.colon2 --> Error: *
TLDefinition.replace.blank2 --> TLDefinition.replace.blank2: $split&space
TLDefinition.replace.blank2 --> TLDefinition.replace.defval: $token
TLDefinition.replace.defval --> TLDefinition.replace.EOS: $split&semicolon
TLDefinition.replace.defval --> Error: *
TLDefinition.replace.EOS --> TopLevel: *

TLDefinition.global --> TLDefinition.global.colon1: $split&colon
TLDefinition.global --> Error: *
TLDefinition.global.colon1 --> TLDefinition.global.blank1: $split&space
TLDefinition.global.colon1 --> TLDefinition.global.deftype: $token
TLDefinition.global.colon1 --> Error: *
TLDefinition.global.blank1 --> TLDefinition.global.blank1: $split&space
TLDefinition.global.blank1 --> TLDefinition.global.deftype: $token
TLDefinition.global.blank1 --> Error: *
TLDefinition.global.deftype --> TLDefinition.global.colon2: $split&colon
TLDefinition.global.deftype --> Error: *
TLDefinition.global.colon2 --> TLDefinition.global.blank2: $split&space
TLDefinition.global.colon2 --> TLDefinition.global.defname: $token
TLDefinition.global.colon2 --> Error: *
TLDefinition.global.blank2 --> TLDefinition.global.blank2: $split&space
TLDefinition.global.blank2 --> TLDefinition.global.defname: $token
TLDefinition.global.blank2 --> Error: *
TLDefinition.global.defname --> TLDefinition.global.EOS: $split&semicolon
TLDefinition.global.defname --> Error: *
TLDefinition.global.EOS --> TopLevel: *
```