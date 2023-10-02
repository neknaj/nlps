# 構文

宣言: コロン`:`で区切る  
文: スペース` `で区切る  

include: 宣言

## トップレベル

| | | |
| - | - | - |
| !include: [filename]; | `!` `include` `:` \<space> [filename] `;` | [filename] を読み込む |
| !using: [filename];   | `!` `using` `:` \<space> [filename] `;` | [filename] を読み込む |
| !replace: [defname]: [defval]; | `!` `replace` `:` \<space> [defname] `:` \<space> [defval] `;` | [defname] を [defval] に置き換えるよう宣言する |
| !global: [deftype]: [defname]; | `!` `global` `:` \<space> [deftype] `:` \<space> [defname] `;` | [deftype] という型で [defname] という名前のグローバル変数を宣言する |

```bnf
<toplevel_member> ::= <import_dec> | <globalvar_def> | <func_def>
<import_dec> ::= "#" ( "include" | "using" ) <blank> <import_file>
<globalvar_def> ::= "!" "global" ":" <type> ":" <globalvar_name> ";"
```