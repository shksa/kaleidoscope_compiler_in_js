import { Parser } from "../src/parser"
import { assert } from 'chai'
import lexer from "../src/lexer";
import { validTokens } from "../src/token";
import * as AST from "../src/AST"

describe('Parser instance', () => {
  let tokens
  beforeEach(() => {
    lexer.resetInput(
      `def adder(a, b) a+b;`
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
})

describe('Parser instance', () => {
  describe(`.consume(token) checks if the 'token' argument matches with the current token being analysed
    and if it does match then 'consumeToken()' is called to move the pointer to the next token so that
    parsing can be continued. Else it throws an error saying 'unexpected input'.`, () => {
      it(`checks if the expected token is same as the current token and if it is, then that token is consumed
      and we move to the next token to parse`, () => {
        lexer.resetInput(
          `def adder(a, b) a+b;`
        )
        const tokens = lexer.lex()
        const parser = new Parser(tokens)
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
        const tokens = lexer.lex()
        const parser = new Parser(tokens)
        parser.consume(validTokens.def)
        const expectedToken = validTokens.identifier
        try {
          parser.consume(expectedToken)
        } catch(e) {
          assert.equal(e.message, `unexpected token 345`)
        }
      })
  })
  describe(`.parseIdentifier() expects the current token to be an identifier and if it is, then 
  the parser will consume that token and returns the identifier token value, otherwise it throws
  an error saying that the current token is not the expected token`, () => {
    it(`should consume if the current token is indeed an identifier`, () => {
      lexer.resetInput(
        `def adder(a, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      assert.equal(parser.currentToken.type, 'identifier')
      const value = parser.parseIdentifier()
      assert.equal(value, 'adder')
    })
    it(`should throw an error if the current token is not an identifier`, () => {
      lexer.resetInput(
        `def 345(a, b);`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      assert.notEqual(parser.currentToken.type, 'identifier')
      try {
        parser.parseIdentifier()
      } catch (error) {
        assert.equal(error.message, 'unexpected token 345')
      }
    })
  })
  describe(`.parseCommaSeperated(parseFunction) uses the parseFunction argument to parse comma
  seperated tokens. The parseFunction argument depends on the type of token to parse`, () => {
    it(`will take take the 'parseIdentifier' function as argument and parse comma seperated identifiers`, () => {
      lexer.resetInput(
        `def adder(a, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      parser.parseIdentifier()
      parser.consume(validTokens.leftParen)
      const values = parser.parseCommaSeperated(parser.parseIdentifier)
      const expectedValues = ['a', 'b']
      assert.deepEqual(values, expectedValues)
    })
    it(`will take take the 'parseIdentifier' function as argument and throw an error because a token
    inside the parens is not an identifier`, () => {
      lexer.resetInput(
        `def adder(a, 99);`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      parser.parseIdentifier()
      parser.consume(validTokens.leftParen)
      try {
        parser.parseCommaSeperated(parser.parseIdentifier)
      } catch (error) {
        assert.equal(error.message, 'unexpected token 99')
      }
    })
    it(`will take take the 'parseIdentifier' function as argument and throw an error because the tokens
    inside the parens are not delimited by the comma`, () => {
      lexer.resetInput(
        `def adder(a; 99);`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      parser.parseIdentifier()
      parser.consume(validTokens.leftParen)
      try {
        parser.parseCommaSeperated(parser.parseIdentifier)
      } catch (error) {
        assert.equal(error.message, 'unexpected token ;')
      }
    })
    it(`will take take the 'parseIdentifier' function as argument and parse the single identifier`, () => {
      lexer.resetInput(
        `def adder(a);`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      parser.parseIdentifier()
      parser.consume(validTokens.leftParen)
      const values = parser.parseCommaSeperated(parser.parseIdentifier)
      const expectedValues = ['a']
      assert.deepEqual(values, expectedValues)
    })
  })
  describe(`.parsePrototype() expects the tokens starting from the current token to be in the order
  'identifier(identifier,identifier, ...)', it parses the whole sequence and returns a prototypeAST object`, () => {
    it(`should parse the prototype sequence successfully and return the prototypeAST object`, () => {
      lexer.resetInput(
        `def adder(a, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      const prototypeAST = parser.parsePrototype()
      assert.instanceOf(prototypeAST, AST.PrototypeAST)
      assert.property(prototypeAST, 'name')
      assert.property(prototypeAST, 'parameters')
      assert.deepEqual(prototypeAST.name, 'adder')
      assert.deepEqual(prototypeAST.parameters, ['a', 'b'])
    })
    it(`should throw an error if token for function name is not an identifier`, () => {
      lexer.resetInput(
        `def 4544(a, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      try {
        const prototypeAST = parser.parsePrototype()
      } catch (error) {
        assert.equal(error.message, 'unexpected token 4544')
      }
    })
    it(`should throw an error if token after the function name token is not a left paren`, () => {
      lexer.resetInput(
        `def adder;a, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      try {
        const prototypeAST = parser.parsePrototype()
      } catch (error) {
        assert.equal(error.message, 'unexpected token ;')
      }
    })
    it(`should throw an error if tokens after left paren token is not an identifier`, () => {
      lexer.resetInput(
        `def adder(999, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      try {
        const prototypeAST = parser.parsePrototype()
      } catch (error) {
        assert.equal(error.message, 'unexpected token 999')
      }
    })
    it(`should throw an error if tokens inside the parens delimited by other than comma`, () => {
      lexer.resetInput(
        `def adder(a( b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      parser.consume(validTokens.def)
      try {
        const prototypeAST = parser.parsePrototype()
      } catch (error) {
        assert.equal(error.message, 'unexpected token (')
      }
    })
  })
})

describe(`Parser instance`, () => {
  describe(`.parseExpression() parses expressions which follow any of these types of sequences
  <binary> | <call> | <identifier> | <number> | <ifelse> | "("<expr>")"`, () => {
    it(`should parse a simple binary expression and return a BinaryExprAST instance`, () => {
      lexer.resetInput(
        `a+b`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.BinaryExprAST)
      assert.deepEqual(exprAST.lhs, new AST.VariableExprNode('a'))
      assert.deepEqual(exprAST.operator, '+')
      assert.deepEqual(exprAST.rhs, new AST.VariableExprNode('b'))
    })
    it(`should parse a nested binary expression and return a BinaryExprAST instance`, () => {
      lexer.resetInput(
        `a*b+c/d`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.BinaryExprAST)
      assert.deepEqual(exprAST.lhs, new AST.VariableExprNode('a'))
      assert.deepEqual(exprAST.operator, '*')
      assert.deepStrictEqual(exprAST.rhs, new AST.BinaryExprAST(
        new AST.VariableExprNode('b'), '+', new AST.BinaryExprAST(
          new AST.VariableExprNode('c'), '/', new AST.VariableExprNode('d')
        )
      ))
    })
    it(`should parse a binary expression in parens and return a BinaryExprAST instance`, () => {
      lexer.resetInput(
        `(a+b)`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.BinaryExprAST)
      assert.deepEqual(exprAST.lhs, new AST.VariableExprNode('a'))
      assert.deepEqual(exprAST.operator, '+')
      assert.deepEqual(exprAST.rhs, new AST.VariableExprNode('b'))
    })
    it(`should parse a binary expression of numbers in parens and return a BinaryExprAST instance`, () => {
      lexer.resetInput(
        `(78 + 88)`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.BinaryExprAST)
      assert.deepEqual(exprAST.lhs, new AST.NumberExprNode('78'))
      assert.deepEqual(exprAST.operator, '+')
      assert.deepEqual(exprAST.rhs, new AST.NumberExprNode('88'))
    })
    it(`should parse a call expression where the expressions inside the parens are numbers and return a CallExprAST instance`, () => {
      lexer.resetInput(
        `(adder(5, 6))`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.CallExprAST)
      assert.deepEqual(exprAST.callee, 'adder')
      assert.deepEqual(exprAST.args, [
        new AST.NumberExprNode('5'),
        new AST.NumberExprNode('6')
      ])
    })
    it(`should parse a call expression where the expressions inside the parens are identifiers and return a CallExprAST instance`, () => {
      lexer.resetInput(
        `(adder(a, b))`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.CallExprAST)
      assert.deepEqual(exprAST.callee, 'adder')
      assert.deepEqual(exprAST.args, [
        new AST.VariableExprNode('a'),
        new AST.VariableExprNode('b')
      ])
    })
    it(`should parse a call expression where the expressions inside the parens are binary expressions and return a CallExprAST instance`, () => {
      lexer.resetInput(
        `adder(1+2, 3/4)`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const exprAST = parser.parseExpression()
      assert.instanceOf(exprAST, AST.CallExprAST)
      assert.deepEqual(exprAST.callee, 'adder')
      assert.deepEqual(exprAST.args, [
        new AST.BinaryExprAST(
          new AST.NumberExprNode('1'), '+', new AST.NumberExprNode('2')
        ),
        new AST.BinaryExprAST(
          new AST.NumberExprNode('3'), '/', new AST.NumberExprNode('4')
        )
      ])
    })
  })
})

describe(`Parser instance`, () => {
  describe(`.parseFunctionDefinition() expects the sequence of tokens starting from the current token to be
  "def"<prototype><expr>;`, () => {
    it(`should parse the function definition successfully and return FunctionDefinitionAST instance`, () => {
      lexer.resetInput(
        `def adder(a, b) a+b;`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const functionDefinitionAST = parser.parseFunctionDefinition()
      assert.instanceOf(functionDefinitionAST, AST.FunctionDefinitionAST)
      assert.deepEqual(functionDefinitionAST.prototypeAST, new AST.PrototypeAST(
        'adder', ['a', 'b']
      ))
      assert.deepEqual(functionDefinitionAST.expressionAST, new AST.BinaryExprAST(
        new AST.VariableExprNode('a'), '+', new AST.VariableExprNode('b')
      ))
    })
  })
})

describe(`Parser instance`, () => {
  describe(`.parseProgram() parses the entire program's token sequence and returns an instance of ProgramAST`, () => {
    it('should successfully parse the full token sequence and return the ProgramAST instance', () => {
      lexer.resetInput(
        `def adder(a, b) a+b*2;
        adder(3, 4);
        extern sqrt(n);
        34 + 45;
        a+b;
        def foo(n) (n * sqrt(n * 200) + 57);`
      )
      const tokens = lexer.lex()
      const parser = new Parser(tokens)
      const programAST = parser.parseProgram()
      assert.instanceOf(programAST, AST.ProgramAST)
      assert.equal(programAST.externs.length, 1)
      assert.equal(programAST.functionDefinitions.length, 2)
      assert.equal(programAST.expressions.length, 3)
    })
  })
})