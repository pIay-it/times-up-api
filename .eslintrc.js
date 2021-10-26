module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    extends: ["eslint:recommended"],
    rules: {
        /*
         * ---- ESLint Rules -----
         * Possible Problems (https://eslint.org/docs/rules/#possible-problems)
         */
        "array-callback-return": "error",
        "constructor-super": "error",
        "for-direction": "error",
        "getter-return": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "off",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": "error",
        "no-const-assign": "error",
        "no-constant-condition": "error",
        "no-constructor-return": "error",
        "no-control-regex": "error",
        "no-debugger": process.env.nodeEnv === "production" ? "error" : "warn",
        "no-dupe-args": "error",
        "no-dupe-class-members": "error",
        "no-dupe-else-if": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-ex-assign": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-import-assign": "error",
        "no-inner-declarations": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "error",
        "no-loss-of-precision": "error",
        "no-misleading-character-class": "error",
        "no-new-symbol": "error",
        "no-obj-calls": "error",
        "no-promise-executor-return": "error",
        "no-prototype-builtins": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-setter-return": "error",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-this-before-super": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable": "warn",
        "no-unreachable-loop": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unsafe-optional-chaining": "error",
        "no-unused-private-class-members": "error",
        "no-unused-vars": "error",
        "no-use-before-define": "error",
        "no-useless-backreference": "error",
        "require-atomic-updates": "off",
        "use-isnan": "error",
        "valid-typeof": "error",
        /*
         * ---- ESLint Rules -----
         * Suggestions (https://eslint.org/docs/rules/#suggestions)
         */
        "accessor-pairs": "error",
        "arrow-body-style": ["error", "as-needed"],
        "block-scoped-var": "error",
        "camelcase": "error",
        "capitalized-comments": "error",
        "class-methods-use-this": "error",
        "complexity": "error",
        "consistent-return": "off",
        "consistent-this": "error",
        "curly": "error",
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-notation": "error",
        "eqeqeq": "error",
        "func-name-matching": "off",
        "func-names": "error",
        "func-style": ["error", "declaration"],
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "id-denylist": "off",
        "id-length": "off",
        "id-match": "off",
        "init-declarations": "off",
        "max-classes-per-file": "error",
        "max-depth": "off",
        "max-lines": "off",
        "max-lines-per-function": ["error", { max: 30, skipComments: true }],
        "max-nested-callbacks": ["error", 2],
        "max-params": ["error", 6],
        "max-statements": "off",
        "multiline-comment-style": "error",
        "new-cap": "error",
        "no-alert": "warn",
        "no-array-constructor": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-confusing-arrow": "off",
        "no-console": process.env.nodeEnv === "production" ? "error" : "warn",
        "no-continue": "error",
        "no-delete-var": "error",
        "no-div-regex": "error",
        "no-else-return": "error",
        "no-empty": "error",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-boolean-cast": "error",
        "no-extra-label": "error",
        "no-extra-semi": "error",
        "no-floating-decimal": "error",
        "no-global-assign": "error",
        "no-implicit-coercion": ["error", { allow: ["!!"] }],
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-inline-comments": "error",
        "no-invalid-this": "off",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-mixed-operators": "off",
        "no-multi-assign": "error",
        "no-multi-str": "off",
        "no-negated-condition": "off",
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-nonoctal-decimal-escape": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "off",
        "no-plusplus": "off",
        "no-proto": "error",
        "no-redeclare": "error",
        "no-regex-spaces": "error",
        "no-restricted-exports": "off",
        "no-restricted-globals": "off",
        "no-restricted-imports": "off",
        "no-restricted-properties": "off",
        "no-restricted-syntax": ["error", "SwitchStatement", "SwitchCase", "DoWhileStatement"],
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-sequences": "error",
        "no-shadow": ["error", { hoist: "never" }],
        "no-shadow-restricted-names": "error",
        "no-ternary": "off",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-undefined": "off",
        "no-underscore-dangle": "off",
        "no-unneeded-ternary": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-void": "error",
        "no-warning-comments": "off",
        "no-with": "error",
        "object-shorthand": "error",
        "one-var": ["error", "never"],
        "one-var-declaration-per-line": ["error", "initializations"],
        "operator-assignment": ["error", "always"],
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-destructuring": "off",
        "prefer-exponentiation-operator": "error",
        "prefer-named-capture-group": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "quote-props": ["error", "consistent-as-needed"],
        "radix": ["error", "as-needed"],
        "require-await": "error",
        "require-unicode-regexp": "error",
        "require-yield": "error",
        "sort-imports": "off",
        "sort-keys": "off",
        "sort-vars": "off",
        "spaced-comment": ["error", "always"],
        "strict": "off",
        "symbol-description": "error",
        "vars-on-top": "error",
        "yoda": "error",
        /*
         * ---- ESLint Rules -----
         * Layout & Formatting (https://eslint.org/docs/rules/#layout-formatting)
         */
        "array-bracket-newline": ["error", { multiline: true }],
        "array-bracket-spacing": ["error", "never"],
        "array-element-newline": ["error", "consistent"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": "error",
        "block-spacing": "error",
        "brace-style": "error",
        "comma-dangle": ["error", "always-multiline"],
        "comma-spacing": ["error", { before: false, after: true }],
        "comma-style": "error",
        "computed-property-spacing": "error",
        "dot-location": ["error", "property"],
        "eol-last": ["error", "never"],
        "func-call-spacing": ["error", "never"],
        "function-call-argument-newline": ["error", "consistent"],
        "function-paren-newline": ["error", "never"],
        "generator-star-spacing": [
            "error", {
                before: false,
                after: true,
            },
        ],
        "implicit-arrow-linebreak": "error",
        "indent": "error",
        "jsx-quotes": ["error", "prefer-double"],
        "key-spacing": ["error", { mode: "strict" }],
        "keyword-spacing": "error",
        "line-comment-position": "error",
        "linebreak-style": "error",
        "lines-around-comment": "off",
        "lines-between-class-members": "error",
        "max-len": ["error", { code: 150, ignoreTemplateLiterals: true, ignoreComments: true }],
        "max-statements-per-line": ["error", { max: 1 }],
        "multiline-ternary": ["error", "never"],
        "new-parens": "error",
        "newline-per-chained-call": "off",
        "no-extra-parens": "error",
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": ["error", { max: 1 }],
        "no-tabs": "off",
        "no-trailing-spaces": ["error", { skipBlankLines: true }],
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position": ["error", "below"],
        "object-curly-newline": ["error", { multiline: true }],
        "object-curly-spacing": ["error", "always"],
        "object-property-newline": "off",
        "operator-linebreak": ["error", "after"],
        "padded-blocks": ["error", "never"],
        "padding-line-between-statements": [
            "error", {
                blankLine: "always",
                prev: "import",
                next: "*",
            }, {
                blankLine: "never",
                prev: "import",
                next: "import",
            }, {
                blankLine: "always",
                prev: "*",
                next: "export",
            },
        ],
        "quotes": ["error", "double", { allowTemplateLiterals: true }],
        "rest-spread-spacing": "error",
        "semi": ["error", "always"],
        "semi-spacing": "error",
        "semi-style": ["error", "last"],
        "space-before-blocks": ["error", { functions: "always", keywords: "always", classes: "always" }],
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": ["error", "never"],
        "space-infix-ops": "error",
        "space-unary-ops": [
            "error", {
                words: true,
                nonwords: false,
            },
        ],
        "switch-colon-spacing": "error",
        "template-curly-spacing": "error",
        "template-tag-spacing": "error",
        "unicode-bom": "error",
        "wrap-iife": "error",
        "wrap-regex": "error",
        "yield-star-spacing": "error",
    },
    parserOptions: {
        parser: "babel-eslint",
        sourceType: "module",
        ecmaVersion: 2021,
    },
    overrides: [
        {
            files: ["*.test.js", "*.spec.js"],
            rules: {
                "one-var": "off",
                "max-lines-per-function": "off",
                "max-nested-callbacks": "off",
                "no-unused-expressions": "off",
                "max-len": "off",
            },
        }, {
            files: ["src/routes/*.js"],
            rules: { "max-lines-per-function": "off" },
        }, {
            files: ["app.js"],
            rules: { "no-console": "off" },
        },
    ],
};