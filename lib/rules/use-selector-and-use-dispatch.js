/**
 * @fileoverview Rules for useSelector & useDispatch
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

const USE_SELECTOR_DISPATCH_ERROR_MESSAGE =
  'Components using useSelector/useDispatch should be wrapped in React.memo(). Please see https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#differences-between-connect-and-useselector for more info.'

module.exports = {
  USE_SELECTOR_DISPATCH_ERROR_MESSAGE,
  meta: {
    docs: {
      description: USE_SELECTOR_DISPATCH_ERROR_MESSAGE,
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
        const isUseDispatch = node.callee.name === 'useDispatch'
        if (!(isUseSelector || isUseDispatch)) return

        const isComponentWrappedInReactMemoInline = Boolean(
          recursivelyFindParentNode(node, node => isReactMemo(node))
        )

        if (isComponentWrappedInReactMemoInline) return

        const parentComponent = recursivelyFindParentNode(node, node => {
          return (
            (get(node, 'init.type') === 'ArrowFunctionExpression' ||
              get(node, 'type') === 'FunctionDeclaration') &&
            node.id.name &&
            /^[A-Z]/.test(node.id.name)
          )
        })

        if (!parentComponent) {
          return
        }

        const componentName = parentComponent.id.name

        const programNode = recursivelyFindParentNode(
          parentComponent,
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

          message: USE_SELECTOR_DISPATCH_ERROR_MESSAGE,
        })
      },
    }
  },
}
