import * as AST from "./AST"
import { validTokens, is } from "./token"
import { parseError } from "./errorsToUsers";

export class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.currentTokenIdx = 0
  }

  get currentToken() {
    const token = this.tokens[this.currentTokenIdx]
    return token
  }
  
  consumeToken() {
    this.currentTokenIdx += 1
  }

  consume(token) {
    if(is.same(token, this.currentToken)) {
      this.consumeToken()
    } else {
      throw parseError.unexpectedToken(token) 
    }
  }

  parseCommaSeperated(parseFunction) {
    const values = []
    do {
      const val = parseFunction()
      values.push(val)
    } while (
      !is.rightParen(this.currentToken) && is.comma(this.currentToken) && this.consumeToken()
    )
    return values
  }
  

  parseCommaSeperatedExpressions() {
    const argumentsOfCallExpr = this.parseCommaSeperated(this.parseExpression)
    return argumentsOfCallExpr
  }

  parseExpression() {
    const token = this.currentToken
    let expressionAST
    switch (token.type) {
      case validTokens.leftParen.type:
        this.consumeToken()
        expressionAST = this.parseExpression()
        this.consume(validTokens.rightParen)
        break
      
      case validTokens.number.type:
        const numberValue = token.value
        this.consumeToken()
        expressionAST = new AST.NumberExprNode(numberValue)
        break
      
      case validTokens.identifier.type:
        const identifierName = token.value
        this.consumeToken()
        if (is.leftParen(this.currentToken)) {
          this.consumeToken()
          const arguments = this.parseCommaSeperatedExpressions()
          this.consume(validTokens.rightParen)
          expressionAST = new AST.CallExprAST(identifierName, arguments)
        } else {
          expressionAST = new AST.VariableExprNode(identifierName)
        }
        break

      default:
        throw parseError.unexpectedToken(token)
    }

    if (is.operator(this.currentToken)) {
      const operator = this.currentToken
      this.consumeToken()
      const rhs = this.parseExpression()
      expressionAST = new AST.BinaryExprAST(expressionAST, operator.value, rhs)
    }

    return expressionAST

  }

  parseCommaSeperatedIdentifiers() {
    const parametersOfPrototype = this.parseCommaSeperated(this.parseIdentifier)
    return parametersOfPrototype
  }

  parseIdentifier() {
    const token = this.currentToken
    if (is.identifier(token)){
      this.consumeToken()
      return token.value
    } else {
      throw parseError.unexpectedToken(token) 
    }
  }

  parsePrototype() {
    const name = this.parseIdentifier()
    this.consume(validTokens.leftParen)
    const parameters = this.parseCommaSeperatedIdentifiers()
    this.consume(validTokens.rightParen)
    const prototypeAST = new AST.PrototypeAST(name, parameters)
    return prototypeAST
  }

  parseExternDefinition() {
    this.consume(validTokens.extern)
    const prototypeAST = this.parsePrototype()
    this.consume(validTokens.semiColan)
    return prototypeAST
  }

  parseFunctionDefinition() {
    this.consume(validTokens.def)
    const prototypeAST = this.parsePrototype()
    const expressionAST = this.parseExpression()
    const functionDefinitionAST = new AST.FunctionDefinitionAST(prototypeAST, expressionAST)
    this.consume(validTokens.semiColan)
    return functionDefinitionAST
  }
  
  // Looks for top-level constructs of the language like function definitions, extern declarations and expressions
  parseProgram() {
    const programAST = new AST.ProgramAST()
    let token
    while (token = this.currentToken) {
      switch (token.value) {
        case validTokens.extern.value:
          const prototypeAST = this.parseExternDefinition()
          programAST.addExternDefinition(prototypeAST)
          break
      
        case validTokens.def.value:
          const functionDefinitionAST = this.parseFunctionDefinition()
          programAST.addFunctionDefinition(functionDefinitionAST)
          break
        
        case validTokens.eof.value:
          break;
        
        default:
          const expressionAST = this.parseExpression()
          this.consume(validTokens.semiColan)
          programAST.addExpression(expressionAST)
          break
      }
    }
    return programAST
  }
}