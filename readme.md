# Neknaj Language Processing System

スタックマシンを基にした自作プログラミング言語とその処理システム

雑に拡張し続けて把握不可能になった前のプログラムたちを整理して作り直すプロジェクト  
前は個別に名前をつけてたけど、相互に依存しまくって意味不明なので、全体にNLPSという名前を付けてみた  


# 処理系の特徴
| 特徴 | 理由 | 対象 |
| -- | -- | -- |
| 逆ポーランド記法 | - 中置演算子や括弧を含む式の解析が難しかった為<br> - 引数の式を先に書くことで引数の式が評価されてから関数がcallされることが明確になる為 | NLP |
| 右に記述する代入先の変数 | - 式を先に書くことで式が評価されてから変数へ代入されることが明確になる為 | NLP |
| 代入を表す`:>` | - 等号として用いられる`=`との違いを明確にするため<br> - 代入の方向を明確にする為<br> - 顔文字のようで可愛い為  | NLP |
| 関数の定義の巻き上げ | - 定義文の前でも使用できるのが便利で気に入った為 | NLP |
| 変数の定義の巻き上げ | - 同じスコープの同じ名前が違うものを指すのは気に入らなかった為 | NLP |
| 浮動小数点数は基数10が基本 | - 2進化による丸め誤差が気に入らなかった為 | BemLib for NVM |
| コンパイル結果をincludeする | - inlcudeしたプログラムもコンパイルしないといけないのが面倒と感じた為 | NLPS |
| 全関数呼び出しでハンドリングする例外 | - 例外の為に特別な処理を作るのが気に入らなかった為 | NLPS |

## 旧プロジェクトの場所
### NLP
/mylang/nlp/
### ASM Linker VM
/nve/vm2/

## 略称
| 略称 | |
| -- | -- |
| NLPS | Neknaj Language Processing System |
| NLP | Neknaj Language for Programming |
| NLPO | Neknaj Language for Programming - Object file |
| NVA NVASM | Neknaj Virtual machine - Assembly language |
| NVMC | Neknaj Virtual machine - Machine Code |
| NVM | Neknaj Virtual Machine |