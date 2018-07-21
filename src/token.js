export const mooLexerConfig = {
  // whitespace
  whitespace: /[ \t]+/,

  // newline
  newLine: { 
    match: /\n/, 
    lineBreaks: true 
  },

  //semi-colan
  semiColan: /;/,

  // comma
  comma: /,/,

  // Number
  number: /[0-9]+/,

  // Identifier and keywords
  identifier: {
    match: /[a-zA-Z_]+/,
    keywords: {
      keyword: ['def', 'extern']
    }
  },

  // operator
  operator: /[-+*/=]/,

  // Parenthesis
  leftParen: /\(/,
  rightParen: /\)/,
}

export const validTokens = {
  semiColan: {
    type: 'semiColan',
    value: ';',
  },

  number: {
    type: 'number',
  },

  def: {
    type: 'keyword',
    value: 'def',
  },
  
  extern: {
    type: 'keyword',
    value: 'extern',
  },
  
  identifier: {
    type: 'identifier',
  },

  operator: {
    type: 'operator',
    value: ''
  },
  
  leftParen: {
    type: 'leftParen',
    value: '(',
  },
  rightParen: {
    type: 'rightParen',
    value: ')',
  },

  eof: {
    type: 'eof',
    value: '\0',
  }
}

export const is = {
  same(token1, token2) {
    const isSameToken = (token1.type === token2.type)? true : false
    return isSameToken
  },

  identifier(token) {
    const isIdentifier = token.type === validTokens.identifier.type ? true : false
    return isIdentifier
  },

  comma(token) {
    const isComma = token.type === 'comma' ? true : false
    return isComma
  },

  leftParen(token) {
    const isLeftParen = token.type === validTokens.leftParen.type ? true : false
    return isLeftParen
  },

  rightParen(token) {
    const isRightParen = token.type === validTokens.rightParen.type ? true : false
    return isRightParen
  },

  operator(token) {
    const isOperator = token.type === validTokens.operator.type ? true : false
    return isOperator
  }
}