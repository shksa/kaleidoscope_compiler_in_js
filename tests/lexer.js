import lexer from "../src/lexer";
import {assert} from 'chai';

describe('lexer', () => {
  describe('.tokenIterator', () => {
    it('is an Iterator object', () => {
      const {tokenIterator} = lexer
      assert.property(tokenIterator, 'next')
    })
  })
  describe('.getNextToken()', () => {
    it('should return a correct token per call and then undefined for every call after all tokens are returned', () => {
      lexer.resetInput(
        `def adder(a, b) a+b;
        extern exoticFunction(a, b);
        adder(4*3, 15/3)`
      )
      const tokensExpected = [
        {value: 'def', type: 'keyword'}, {value: 'adder', type: 'identifier'}, {value: '(', type: 'leftParen'},
        {value: 'a', type: 'identifier'}, {value: ',', type: 'comma'}, {value: 'b', type: 'identifier'}, {value: ')', type: 'rightParen'}, 
        {value: 'a', type: 'identifier'}, {value: '+', type: 'operator'}, {value: 'b', type: 'identifier'},
        {value: ';', type: 'semiColan'}, {value: 'extern', type: 'keyword'},{value: 'exoticFunction', type: 'identifier'},
        {value: '(', type: 'leftParen'}, {value: 'a', type: 'identifier'}, {value: ',', type: 'comma'}, {value: 'b', type: 'identifier'},
        {value: ')', type: 'rightParen'}, {value: ';', type: 'semiColan'}, {value: 'adder', type: 'identifier'},
        {value: '(', type: 'leftParen'}, {value: '4', type: 'number'}, {value: '*', type: 'operator'}, {value: '3', type: 'number'},
        {value: ',', type: 'comma'}, {value: '15', type: 'number'}, {value: '/', type: 'operator'}, {value: '3', type: 'number'},
        {value: ')', type: 'rightParen'}, {value: '\0', type: 'eof'}
      ]
      tokensExpected.forEach((expectedToken) => {
        const token = lexer.getNextToken()
        assert.equal(token.type, expectedToken.type)
        assert.equal(token.value, expectedToken.value)
      })
      assert.isUndefined(lexer.getNextToken())
      assert.isUndefined(lexer.getNextToken())
    })
  })
  describe('.resetInput()', () => {
    it('should reset to a new string or an empty string, and make a new tokenIterator object', () => {
      lexer.resetInput('def adder(a, b) a+b')
      for(const token of lexer.tokenIterator){
        assert.notEqual(token, undefined)
      }
      assert.isUndefined(lexer.tokenIterator.next().value)
      lexer.resetInput('extern sqrt(n)')
      for(const token of lexer.tokenIterator){
        assert.notEqual(token, undefined)
      }
      assert.isUndefined(lexer.tokenIterator.next().value)
    })
  })
  describe('.lex()', () => {
    it('should return a list of all valid tokens', () => {
      lexer.resetInput(
        `def adder(a, b) a+b;
        extern exoticFunction(a, b);
        adder(4*3, 15/3)`
      )
      const tokensFromLexer = lexer.lex()
      const tokensExpected = [
        {value: 'def', type: 'keyword'}, {value: 'adder', type: 'identifier'}, {value: '(', type: 'leftParen'},
        {value: 'a', type: 'identifier'}, {value: ',', type: 'comma'}, {value: 'b', type: 'identifier'}, {value: ')', type: 'rightParen'}, 
        {value: 'a', type: 'identifier'}, {value: '+', type: 'operator'}, {value: 'b', type: 'identifier'},
        {value: ';', type: 'semiColan'}, {value: 'extern', type: 'keyword'},{value: 'exoticFunction', type: 'identifier'},
        {value: '(', type: 'leftParen'}, {value: 'a', type: 'identifier'}, {value: ',', type: 'comma'}, {value: 'b', type: 'identifier'},
        {value: ')', type: 'rightParen'}, {value: ';', type: 'semiColan'}, {value: 'adder', type: 'identifier'},
        {value: '(', type: 'leftParen'}, {value: '4', type: 'number'}, {value: '*', type: 'operator'}, {value: '3', type: 'number'},
        {value: ',', type: 'comma'}, {value: '15', type: 'number'}, {value: '/', type: 'operator'}, {value: '3', type: 'number'},
        {value: ')', type: 'rightParen'}, {value: '\0', type: 'eof'}
      ]
      assert.equal(tokensFromLexer.length, tokensExpected.length)
      tokensExpected.forEach((expectedToken, idx) => {
        const token = tokensFromLexer[idx]
        assert.equal(token.type, expectedToken.type)
        assert.equal(token.value, expectedToken.value)
      })
      assert.isEmpty(lexer.lex())
    })
  })
})