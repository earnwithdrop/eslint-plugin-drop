/**
 * @fileoverview Require explicit booleans in JSX conditional rendering using &&
 * @author drop
 */

'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using non-booleans in && expressions in JSX',
      category: 'react-native-safety',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },

  create: context => {
    const message = 'Conditionals in JSX should use explicit Booleans'

    const getSourceForLeftNode = node =>
      context.getSourceCode().getText(node.left)

    const reportUnsafeCondition = node => {
      context.report({
        node,
        message,
        fix: fixer =>
          fixer.replaceText(node.left, `!!(${getSourceForLeftNode(node)})`),
      })
    }

    const isAndExpressionSurroundedByJSX = node =>
      node.parent.type === 'JSXExpressionContainer' && node.operator === '&&'

    const boolBinaryOperators = ['==', '===', '!=', '!==', '<', '<=', '>', '>=']

    const boolPrefixes = ['is', 'should', 'can', 'has']

    const isPrefixedWithOneOfPrefixes = (word = '', prefixes) =>
      prefixes.filter(prefix => word.startsWith(prefix)).length > 0

    const isLeftSideBoolean = inputNode => {
      const leftNode = inputNode.left
      return (
        (leftNode.type === 'UnaryExpression' && leftNode.operator === '!') || // Eg: !something
        (leftNode.type === 'CallExpression' && // Eg: Boolean(something)
          leftNode.callee.name === 'Boolean') ||
        (leftNode.type === 'BinaryExpression' && // Eg: something === somethingElse
          boolBinaryOperators.includes(leftNode.operator)) ||
        (leftNode.type === 'CallExpression' &&
          isPrefixedWithOneOfPrefixes(leftNode.callee.name, boolPrefixes)) ||
        (leftNode.type === 'Identifier' &&
          isPrefixedWithOneOfPrefixes(leftNode.name, boolPrefixes))
      )
    }

    const isRightSideJSX = node => node.right.type === 'JSXElement'

    const getIsUnsafeCode = node => {
      if (
        isAndExpressionSurroundedByJSX(node) &&
        isRightSideJSX(node) &&
        !isLeftSideBoolean(node)
      ) {
        return true
      }

      return false
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      LogicalExpression(node) {
        if (getIsUnsafeCode(node)) {
          reportUnsafeCondition(node)
        }
      },
    }
  },
}
