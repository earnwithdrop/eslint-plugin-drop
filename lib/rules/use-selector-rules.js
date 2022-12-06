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

const isReactMemo = node =>
  get(node, 'callee.object.name') === 'React' &&
  get(node, 'callee.property.name') === 'memo'

const isNodeArgumentNamed = (node, name) =>
  get(node, 'arguments.0.name') === name

const isConnect = node =>
  ['connect', 'connectExtendedWithNavigation'].includes(
    get(node, 'callee.callee.name')
  )

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
        const isUseSelector = node.callee.name === 'useSelector'
        if (!isUseSelector) return

        const isComponentWrappedInReactMemoInline = Boolean(
          recursivelyFindParentNode(node, node => isReactMemo(node))
        )

        if (isComponentWrappedInReactMemoInline) return

        const parentArrowFunction = recursivelyFindParentNode(node, node => {
          return (
            get(node, 'init.type') === 'ArrowFunctionExpression' && node.id.name
          )
        })

        if (!parentArrowFunction) {
          return
        }

        const componentName = parentArrowFunction.id.name

        const programNode = recursivelyFindParentNode(
          parentArrowFunction,
          x => x.type === 'Program'
        )

        const exportDefault = programNode.body.filter(
          x => x.type === 'ExportDefaultDeclaration'
        )[0]

        if (
          exportDefault &&
          (isReactMemo(exportDefault.declaration) ||
            isConnect(exportDefault.declaration)) &&
          isNodeArgumentNamed(exportDefault.declaration, componentName)
        ) {
          return
        }

        const exportNamed = programNode.body.filter(
          x => x.type === 'ExportNamedDeclaration'
        )[0]

        if (
          exportNamed &&
          get(exportNamed, 'declaration.declarations', []).some(
            x =>
              isNodeArgumentNamed(get(x, 'init'), componentName) &&
              (isReactMemo(x.init) || isConnect(x.init))
          )
        ) {
          return
        }
        context.report({
          node,

          message: USE_SELECTOR_ERROR_MESSAGE,
        })
      },
    }
  },
}
