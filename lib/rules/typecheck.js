/**
 * @fileoverview Name all selectors with a 'get' prefix
 * @author drop
 */

'use strict'

const fs = require('fs')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Typecheck files',
      category: 'typecheck',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create: context => {
    const { options } = context
    const typecheckIgnorePath = options[0].typecheckignorePath
    const pathsIgnored = fs
      .readFileSync(typecheckIgnorePath, 'utf8')
      .split('\n')
      .filter(line => Boolean(line))
      .filter(line => !line.includes('#'))

    return {
      onCodePathStart: (codePath, node) => {
        const currentFilename = context.getFilename()

        if (currentFilename.endsWith('.js')) {
          context.report({
            node,
            message: 'Please rename this file to .ts | .tsx & add typings',
          })
          return
        }

        const isCurrentPathIgnored = pathsIgnored.some(ignoredPath => {
          return currentFilename.includes(ignoredPath)
        })

        if (isCurrentPathIgnored) {
          context.report({
            node,
            message:
              'Remove file from .typecheckignore to validate types in CI',
          })
          return
        }
      },
    }
  },
}

module.exports.schema = [
  {
    type: 'object',
    properties: {
      typecheckignorePath: {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
]
