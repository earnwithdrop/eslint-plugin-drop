/**
 * @fileoverview Name all selectors with a 'get' prefix
 * @author drop
 */
'use strict'
const errorMessage = 'expectSagas in `it` blocks should be returned'
const isExplicitReturn = node => node.parent.type === 'ReturnStatement'
const isArrowFunctionWithImplicitReturn = node =>
  node.parent.type === 'ArrowFunctionExpression' &&
  node.parent.expression === true

const getRootMemberExpression = node => {
  if (
    !node.parent ||
    (node.parent.type !== 'MemberExpression' &&
      node.parent.type !== 'CallExpression')
  ) {
    return node
  }
  if (
    (node.parent && node.parent.type === 'MemberExpression') ||
    node.parent.type === 'CallExpression'
  )
    return getRootMemberExpression(node.parent)
  return node
}
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const ruleModule = {
  meta: {
    docs: {
      description: 'Ensure expectSagas are returned',
      category: 'jest',
      recommended: false,
    },
    fixable: undefined,
    schema: [],
  },
  create: context => ({
    CallExpression: node => {
      if (
        node.callee.type === 'Identifier' &&
        node.callee.name === 'expectSaga'
      ) {
        if (
          node.type === 'CallExpression' &&
          node.parent.type === 'MemberExpression'
        ) {
          node = getRootMemberExpression(node)
        }

        if (
          !(isExplicitReturn(node) || isArrowFunctionWithImplicitReturn(node))
        )
          context.report({
            node,
            message: errorMessage,
          })
      }
      return null
    },
  }),
}
module.exports = ruleModule
