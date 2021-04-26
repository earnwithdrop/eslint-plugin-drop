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
          get(node, 'declarations.0.init.type') === 'YieldExpression'

        const hasTypeAnnotation =
          get(node, 'declarations.0.id.typeAnnotation.type') ===
            'TypeAnnotation' ||
          get(node, 'declarations.0.id.typeAnnotation.type') ===
            'TSTypeAnnotation'

        if (isYieldExpression && !hasTypeAnnotation)
          context.report({
            node,
            message: 'Outputs of yield expressions should be typed',
          })
      },

      ReturnStatement(node) {
        const isYieldExpression = get(node, 'argument.type')

        if (isYieldExpression) {
          context.report({
            node,
            message: 'Outputs of yield expressions should be typed',
          })
        }
      },
    }
  },
}
