import { Parser } from "../src/parser"
import { assert } from 'chai'
import lexer from "../src/lexer";
import { validTokens } from "../src/token";

describe('Parser', () => {
  describe('instance', () => {
    let tokens
    beforeEach(() => {
      lexer.resetInput(
        `def adder(a, b) a+b;
        extern exoticFunction(a, b);
        adder(4*3, 15/3)`
      )
      tokens = lexer.lex()
    })
    it('constructor(tokens) should store the tokens gen. by lexer', () => {
      
      const parser = new Parser(tokens)
      assert.deepStrictEqual(parser.tokens, tokens)
    })
    it('.currentToken getter should return the token indexed by this.currentTokenIdx', () => {
      const parser = new Parser(tokens)
      assert.deepStrictEqual(parser.currentToken, tokens[parser.currentTokenIdx])
    })
    it('.consumeToken() should move the pointer(this.currentTokenIdx) in tokens array to the next token', () => {
      const parser = new Parser(tokens)
      assert.equal(parser.currentTokenIdx, 0)
      parser.consumeToken()
      assert.equal(parser.currentTokenIdx, 1)
      parser.consumeToken()
      assert.equal(parser.currentTokenIdx, 2)
      parser.consumeToken()
      assert.equal(parser.currentTokenIdx, 3)
    })
    describe(`.consume(token) checks if the 'token' argument matches with the current token being analysed
    and if it does match then 'consumeToken()' is called to move the pointer to the next token so that
    parsing can be continued. Else it throws an error saying 'unexpected input'.`, () => {
      it(`checks if the expected token is same as the current token and if it is, then that token is consumed
      and we move to the next token to parse`, () => {
        lexer.resetInput(
          `def adder(a, b) a+b;`
        )
        tokens = lexer.lex()
        const parser = new Parser(tokens)
        assert.equal(parser.currentTokenIdx, 0)
        let expectedToken = validTokens.def
        parser.consume(expectedToken)
        assert.equal(parser.currentTokenIdx, 1)
        expectedToken = validTokens.identifier
        parser.consume(expectedToken)
        assert.equal(parser.currentTokenIdx, 2)
        expectedToken = validTokens.leftParen
        parser.consume(expectedToken)
        assert.equal(parser.currentTokenIdx, 3)
      })
      it(`should throw an error when the expected token is not the same as current token`, () => {
        lexer.resetInput(
          `def 345(a, b) a+b;`
        )
        tokens = lexer.lex()
        const parser = new Parser(tokens)
        assert.equal(parser.currentTokenIdx, 0)
        let expectedToken = validTokens.def
        parser.consume(expectedToken)
        assert.equal(parser.currentTokenIdx, 1)
        expectedToken = validTokens.identifier
        try {
          parser.consume(expectedToken)
        } catch(e) {
          assert.equal(e.message, `unexpected token 345`)
        }
      })
    })
  })
})