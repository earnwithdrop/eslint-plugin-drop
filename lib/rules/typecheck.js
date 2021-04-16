/**
 * @fileoverview Name all selectors with a 'get' prefix
 * @author drop
 */

'use strict'

const fs = require('fs')

const { resolve } = require('path')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Function that recursively walks up directories until it finds the root of the molly project
 * Stops after reaching an arbitrary depth of 15
 * The purpose of this function is to make this rule work regardless of how a file in molly was opened
 * (eg: if a single file was opened using an editor, instead of the project root directory)
 */
const findMollyRoot = (startPath = process.cwd(), iterations = 1) => {
  if (
    fs.existsSync(`${startPath}/.typecheckignore`) &&
    fs.existsSync(`${startPath}/package.json`)
  ) {
    return startPath
  }
  if (iterations <= 15) {
    return findMollyRoot(`${startPath}/..`, iterations + 1)
  }
  throw new Error('Could not find molly root directory')
}

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
    const mollyRoot = findMollyRoot()
    const typecheckIgnorePath = `${mollyRoot}/.typecheckignore`

    const filesInTypecheckignore = fs
      .readFileSync(typecheckIgnorePath, 'utf8')
      .split('\n')
      .filter(line => Boolean(line))
      .filter(line => !line.includes('#'))

    return {
      onCodePathStart: (codePath, node) => {
        const currentFilename = resolve(context.getFilename())
        const appliesToPaths = options[0].appliesToPaths.map(partialPath =>
          resolve(`${mollyRoot}/${partialPath}`)
        )

        const doesCurrentFileApply = appliesToPaths.some(path => {
          return currentFilename.startsWith(path)
        })

        if (!doesCurrentFileApply) {
          return
        }

        if (currentFilename.endsWith('.js')) {
          context.report({
            node,
            message: 'Please rename this file to .ts | .tsx & add typings',
          })
          return
        }

        const isCurrentPathIgnored = filesInTypecheckignore.some(
          ignoredPath => {
            return currentFilename.includes(ignoredPath)
          }
        )

        if (isCurrentPathIgnored) {
          context.report({
            node,
            message: 'Remove file from .typecheckignore & fix typings',
          })
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
      appliesToPaths: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    additionalProperties: false,
  },
]
