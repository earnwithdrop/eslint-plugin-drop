/**
 * @fileoverview Type yield expressions
 * @author drop
 */

'use strict'

const get = require('lodash/get')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Outputs of yield expressions should be typed',
      category: 'typing',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create: context => {
    return {
      VariableDeclaration(node) {
        const isYieldExpression =
          node.declarations &&
          node.declarations[0] &&
          node.declarations[0].init &&
          node.declarations[0].init.type
        const hasTypeAnnotation =
          node.declarations &&
          node.declarations[0] &&
          node.declarations[0].id &&
          node.declarations[0].id.typeAnnotation &&
          node.declarations[0].id.typeAnnotation.type

        if (isYieldExpression && !hasTypeAnnotation)
          context.report({
            node,
            message: 'Outputs of yield expressions should be typed',
          })
      },
    }
  },
}
