/**
 * @fileoverview Require explicit booleans in JSX conditional rendering using &&
 * @author drop
 */
'use strict'
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require('../../../lib/rules/jest-return-expect-saga')
// eslint-disable-next-line
const { RuleTester } = require('eslint')
RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
})
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester()
ruleTester.run('jest-return-expect-saga', rule, {
  valid: [
    {
      code: `
            describe(() => {
                it(() => {
                    return expectSaga()
                })
            })
        `,
      filename: 'test.js',
    },
    {
      code: `
      describe(() => {
        it(() => expectSaga())
      })
        `,
      filename: 'test.js',
    },
    {
      code: `
        const generateExpectSaga = () => expectSaga()
          `,
      filename: 'test.js',
    },
    {
      code: `
          import { expectSaga } from 'some-library'
            `,
      filename: 'test.js',
    },
    {
      code: `
      it('', () => expectSaga().fn())
            `,
      filename: 'test.js',
    },
  ],
  invalid: [
    {
      code: `
            describe(() => {
                it(() => {
                    expectSaga()
                })
            })
            `,
      filename: 'test.js',
      errors: [
        {
          message: 'expectSagas in `it` blocks should be returned',
        },
      ],
    },
    {
      code: `
              describe(() => {
                  it(() => {
                      doStuff()
                      expectSaga()
                  })
              })
              `,
      filename: 'test.js',
      errors: [
        {
          message: 'expectSagas in `it` blocks should be returned',
        },
      ],
    },
  ],
})
