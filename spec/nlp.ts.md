# nlp.ts

## 関数
| 名前 | 引数 | 内容 |
| --- | --- | --- |
| constructor | filename:string  | コードを取得する |
| tokenize | | トークナイズする |
| parse | | トークナイザの出力を元に構文を解析する |
| buildAST1 | | パーサの出力を元に構文木1を作る |

### constructor
`require`が定義されている場合は、`fs.readFileSync`からファイルを取得する
`require`が定義されていない場合は、`XMLHttpRequest`からファイルを取得する