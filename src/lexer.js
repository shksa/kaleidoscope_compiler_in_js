import moo from 'moo';
import { mooLexerConfig, validTokens } from './token';

const lexer = moo.compile(mooLexerConfig)

function* generatorForTokens () {
  for(const token of lexer){
    if(token.type !== 'whitespace' && token.type !== 'newLine') {
      yield token
    }
  }
  yield validTokens.eof
}

lexer.tokenIterator = generatorForTokens()

lexer.getNextToken = function() {
  const {value} = this.tokenIterator.next()
  return value
}

lexer.resetInput = function(chunk, state) {
  lexer.reset(chunk, state)
  lexer.tokenIterator = generatorForTokens()
}

lexer.lex = function() {
  const tokens = []
  for(const token of this.tokenIterator) {
    tokens.push(token)
  }
  return tokens
}

export default lexer