# 構文

## トップレベル
```bnf
<toplevel_member> ::= <import_dec> | <globalvar_def> | <func_def>
<import_dec> ::= "#" ( "include" | "using" ) <blank> <import_file>
<globalvar_def> ::= "!" "global" ":" <type> ":" <globalvar_name> ";"
```