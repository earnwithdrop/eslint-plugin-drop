'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { resolve } = require('path')
const { TSESLint } = require('@typescript-eslint/experimental-utils')
const rule = require('../../../lib/rules/dispatch-actions')

const ruleTester = new TSESLint.RuleTester({
  parser: resolve('./node_modules/@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
})

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('dispatch-actions', rule, {
  valid: [
    {
      code: `
      const mapDispatchToProps = {
        action,
      }
      `,
    },
    {
      code: `
        const mapDispatchToProps = {
          action: actionName,
        }
        `,
    },
    {
      code: `
          const mapDispatchToProps = {
            action: () => actionName(),
          }
          `,
    },
    {
      code: `
            const mapDispatchToProps = (dispatch) => ({
              action: () => dispatch(actionName()),
            })
            `,
    },
  ],

  invalid: [
    {
      code: `
      const mapDispatchToProps = {
        action: () => {
            action1()
            action2()
        },
      }
      `,
      errors: [
        {
          message: 'Did you forget to dispatch actions?',
        },
      ],
    },
  ],
})
