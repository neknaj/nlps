# コメント

一般的なコメントの使い方には大きく2種類があると考える  
コードの意図を記したものと、コードを無効化したものだ  
(以降「コードの意図を記したもの・記すもの」を「ノート」、「コードを無効化したもの・無効化するもの」を「コメントアウト」と呼ぶ)

この二つは、コンパイラでは同じように扱っていいだろう  
しかし、プログラマ側からは別のものとして扱われる  
ノートは読む必要があるし、コメントアウトは基本的に読む必要がない  
ノートは目立つ必要があり、コメントアウトは隠れる必要があるのだ  

そこで、NLPにはノート・コメントアウトそれぞれに別の記法を用意した  