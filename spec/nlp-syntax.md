# 構文

宣言: コロン`:`で区切る  
文: スペース` `で区切る  

include: 宣言

## トップレベル
```bnf
<toplevel_member> ::= <import_dec> | <globalvar_def> | <func_def>
<import_dec> ::= "#" ( "include" | "using" ) <blank> <import_file>
<globalvar_def> ::= "!" "global" ":" <type> ":" <globalvar_name> ";"
```