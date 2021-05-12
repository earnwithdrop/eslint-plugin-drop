'use strict'

const get = require('lodash/get')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Ensure actions are dispatched in mapDispatchToProps',
      category: 'redux',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create: context => {
    return {
      VariableDeclarator(node) {
        if (get(node, 'id.name') !== 'mapDispatchToProps') return

        if (!get(node, 'init.properties')) return

        const boundFunctions = node.init.properties.filter(x => {
          return get(x, 'value.type') === 'ArrowFunctionExpression'
        })

        if (!boundFunctions || !boundFunctions.length) return

        const functionsWithMultipleExpresisons = boundFunctions.filter(x => {
          return get(x, 'value.body.body.length') > 1
        })

        if (
          !functionsWithMultipleExpresisons ||
          !functionsWithMultipleExpresisons.length
        )
          return

        const problemExpressions = functionsWithMultipleExpresisons.filter(
          x => {
            const body = get(x, 'value.body.body')
            if (!body) return false

            return x.value.body.body.some(x => {
              return get(x, 'expression.type') === 'CallExpression'
            })
          }
        )

        if (problemExpressions.length)
          context.report({
            node,
            message: 'Did you forget to dispatch actions?',
          })
      },
    }
  },
}
