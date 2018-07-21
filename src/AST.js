// Expression Node objects

export class ExprNode {
  nodeType = 'Expression'
}

export class NumberExprNode extends ExprNode {
  constructor(value) {
    this.value = value
  }
}

export class VariableExprNode extends ExprNode {
  constructor(name) {
    this.name = name
  }
}

export class BinaryExprAST extends ExprNode {
  constructor(lhs, operator, rhs) {
    this.lhs = lhs
    this.operator = operator
    this.rhs = rhs
  }
}

export class CallExprAST extends ExprNode {
  constructor(callee, arguments) {
    this.callee = callee
    this.arguments = arguments
  }
}

// Prototype Node object

export class PrototypeAST {
  constructor(name, parameters) {
    this.name = name
    this.parameters = parameters
  }
}

// Function definition node object

export class FunctionDefinitionAST {
  constructor(prototypeAST, expressionAST) {
    this.prototypeAST = prototypeAST
    this.expressionAST = expressionAST
  }
} 

// Top-level constructs holder a.k.a the main AST of the whole program

export class ProgramAST {
  externs = []
  functionDefinitions = []
  expressions = []
  prototypeMap = {}

  prototype(nameOfConstruct) {
    return this.prototypeMap[nameOfConstruct]
  }

  addExpression(expressionAST) {
    this.expressions.push(expressionAST)
  }

  addExternDefinition(prototypeAST) {
    this.externs.push(prototypeAST)
    this.prototypeMap[prototypeAST.name] = prototypeAST
  }

  addFunctionDefinition(functionDefinitionAST) {
    this.functionDefinitions.push(functionDefinitionAST)
    this.prototypeMap[functionDefinitionAST.prototypeAST.name] = functionDefinitionAST.prototypeAST
  }
}