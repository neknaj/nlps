nlpjs: ./spec/nlp-tokenizer-statetransition.md ./spec/nlp-parser-statetransition.md nlp.ts
	node statemachine_tokenizer.js
	node statemachine_parser.js
	npx tsc nlp.ts

parser_stat: ./spec/nlp-tokenizer-statetransition.md nlp.ts
	node statemachine_tokenizer.js
	npx tsc nlp.ts

tokenizer_stat: ./spec/nlp-parser-statetransition.md nlp.ts
	node statemachine_parser.js
	npx tsc nlp.ts