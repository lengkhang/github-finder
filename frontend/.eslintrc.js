module.exports = {
  parser: 'babel-eslint',

  settings: {
    react: {
      version: 'detect'
    }
  },

  extends: ['eslint:recommended'],

  rules: {
    // Possible Errors
    'comma-dangle': 'error',
    'no-cond-assign': 'error',
    'no-console': 'off',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-empty': 'error',
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-parens': 'off',
    'no-extra-semi': 'error',
    'no-func-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'error',
    'no-negated-in-lhs': 'error',
    'no-obj-calls': 'error',
    'no-regex-spaces': 'error',
    'no-sparse-arrays': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'use-isnan': 'error',
    'valid-jsdoc': 'off',
    'valid-typeof': 'error',
    'no-script-url': 'error',

    // Best Practices
    'accessor-pairs': 'error',
    'block-scoped-var': 'error',
    complexity: 'off',
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'default-case': 'off',
    'dot-notation': 'error',
    'dot-location': ['error', 'property'],
    eqeqeq: 'error',
    'guard-for-in': 'off',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-div-regex': 'error',
    'no-else-return': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'off',
    'no-implied-eval': 'error',
    'no-invalid-this': 'off',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-native-reassign': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-new': 'error',
    'no-octal-escape': 'error',
    'no-octal': 'error',
    'no-param-reassign': 'error',
    'no-process-env': 'off',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-return-assign': 'off',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-void': 'error',
    'no-warning-comments': 'off',
    'no-with': 'error',
    radix: 'off',
    'require-await': 'error',
    'vars-on-top': 'off',
    'wrap-iife': ['error', 'inside'],
    yoda: 'error',

    // Variables
    'init-declarations': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false
      }
    ],
    'no-catch-shadow': 'off',
    'no-delete-var': 'error',
    'no-label-var': 'error',
    'no-shadow-restricted-names': 'error',
    'no-shadow': 'off',
    'no-undef-init': 'error',
    'no-undef': 'error',
    'no-undefined': 'off',
    'no-unused-vars': 'error',
    'no-use-before-define': 'error',
    'no-var': 'error',
    'one-var': ['error', { initialized: 'never' }],

    // Stylistic
    camelcase: [
      'error',
      {
        properties: 'always',
        allow: ['UTM_Source', 'UTM_Medium', 'UTM_Campaign']
      }
    ],
    'new-cap': 'off',
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'eol-last': 'off',
    'func-style': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'linebreak-style': ['error', 'unix'],
    'new-parens': 'error',
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0 }],
    'no-nested-ternary': 'error',
    'no-spaced-func': 'error',
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'operator-linebreak': ['error', 'after'],
    quotes: ['error', 'single', 'avoid-escape'],
    semi: ['error', 'always'],
    'semi-spacing': ['error', { before: false, after: true }],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'off',
    'spaced-comment': 'off',
    'wrap-regex': 'error',

    // React
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-no-undef': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-multi-comp': 'off',
    'react/no-unknown-property': 'error',
    'react/prop-types': 'off',
    'react/sort-comp': [0],
    'react/react-in-jsx-scope': 'error',
    'react/self-closing-comp': ['error', { component: true, html: false }],
    'react/jsx-wrap-multilines': ['error', { arrow: false }],

    //Jest
    'jest/no-focused-tests': 'error',
    'jest/valid-expect': 'error',

    //Import
    'import/no-extraneous-dependencies': 'off'
  },

  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true
  },

  globals: {
    BROWSER: true,
    require: true,
    JSON: true,
    Raygun: true,
    grecaptcha: true
  },

  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  },

  plugins: ['react', 'jest', 'import']
};
