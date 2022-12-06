/**
 * @fileoverview Rules for useSelector
 * @author drop
 */

'use strict'

const get = require('lodash/get')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const recursivelyFindParentNode = (node, cb) => {
  if (!node) return undefined
  if (cb(node)) {
    return node
  }
  return recursivelyFindParentNode(node.parent, cb)
}

const USE_SELECTOR_ERROR_MESSAGE =
  'Components using useSelector should be wrapped in React.memo(). See for [this link](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#differences-between-connect-and-useselector) further reading.'

module.exports = {
  USE_SELECTOR_ERROR_MESSAGE,
  meta: {
    docs: {
      description: USE_SELECTOR_ERROR_MESSAGE,
      category: 'hooks',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create: context => {
    return {
      CallExpression(node) {
        const isUseSelector = get(node, 'callee.name') === 'useSelector'
        if (!isUseSelector) return

        const isComponentWrappedInReactMemo = Boolean(
          recursivelyFindParentNode(
            node,
            node =>
              get(node, 'callee.object.name') === 'React' &&
              get(node, 'callee.property.name') === 'memo'
          )
        )

        if (!isComponentWrappedInReactMemo) {
          context.report({
            node,
            message: USE_SELECTOR_ERROR_MESSAGE,
          })
        }
      },
    }
  },
}
