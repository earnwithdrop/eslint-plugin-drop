/**
 * @fileoverview Name all selectors with a 'get' prefix
 * @author drop
 */

'use strict'

const get = require('lodash/get')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const isSelectorFile = (fileName = '') =>
  fileName.endsWith('selectors.js') ||
  fileName.endsWith('Selectors.js') ||
  fileName.match(/selectors\/(.+).js/)

const isSelectorFunction = variableDeclarator =>
  get(variableDeclarator, 'init.type') === 'ArrowFunctionExpression' &&
  get(variableDeclarator, 'init.params[0].name') === 'state'

const doesNotStartWithGet = variableDeclarator =>
  !get(variableDeclarator, 'id.name', '').startsWith('get')

module.exports = {
  meta: {
    docs: {
      description: "Name all selectors with a 'get' prefix",
      category: 'selector-naming',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create: context => ({
    VariableDeclaration: node => {
      node.declarations.forEach(variableDeclarator => {
        if (
          isSelectorFile(context.getFilename()) &&
          isSelectorFunction(variableDeclarator) &&
          doesNotStartWithGet(variableDeclarator)
        ) {
          context.report({
            node,
            message: "Selector functions should be prefixed with 'get'",
          })
        }
      })
    },
  }),
}
