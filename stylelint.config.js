/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss', 'stylelint-prettier/recommended'],
    plugins: ['stylelint-order', 'stylelint-scss', 'stylelint-prettier'],
    customSyntax: 'postcss-scss',
    rules: {
        'order/order': [
            {
                type: 'at-rule',
            },
            'declarations',
            {
                type: 'at-rule',
                hasBlock: true,
            },
            'rules',
        ],
        'scss/double-slash-comment-whitespace-inside': null, // сбой в работе правила
        'rule-empty-line-before': [
            'always',
            {
                except: ['after-single-line-comment', 'first-nested'],
            },
        ],
        'selector-class-pattern': '^[a-z][a-zA-Z0-9]*$|^Mui.*$',
        "selector-pseudo-class-no-unknown": [true, {
            ignorePseudoClasses: ["global"],
        }],
    },
};

/*
// allowing double dashes: --
const kebab = '^_?[a-z0-9]+(?:-+[a-z0-9]+)*$';

// sequential uppercase letters (like "toRGB") is not allowed
const camel = '^[a-z]+((\\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?$';

module.exports = {
    plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-prettier'],
    customSyntax: 'postcss-scss',
    rules: {
        'prettier/prettier': true,
        indentation: 4,
        'number-leading-zero': 'always',
        'string-quotes': 'single',
        'selector-max-id': 0,
        'selector-list-comma-newline-after': 'always',
        'comment-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
            },
        ],
        'block-opening-brace-space-before': 'always',
        'declaration-colon-space-after': 'always-single-line',
        'declaration-colon-space-before': 'never',
        'declaration-block-single-line-max-declarations': 1,
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['blockless-after-same-name-blockless', 'first-nested'],
                ignore: ['after-comment'],
                ignoreAtRules: ['else'],
            },
        ],
        'rule-empty-line-before': [
            'always',
            {
                except: ['after-single-line-comment', 'first-nested'],
            },
        ],
        'order/order': [
            {
                type: 'at-rule',
            },
            'declarations',
            {
                type: 'at-rule',
                hasBlock: true,
            },
            'rules',
        ],
        'max-nesting-depth': null,
        'scss/at-extend-no-missing-placeholder': null,
        'scss/at-function-pattern': camel,
        'scss/at-mixin-pattern': kebab,
        'scss/dollar-variable-pattern': kebab,
        'scss/percent-placeholder-pattern': camel,
        'scss/no-duplicate-dollar-variables': [
            true,
            {
                ignoreInside: ['at-rule', 'nested-at-rule'],
                ignoreInsideAtRules: ['include'],
            },
        ],
        'scss/no-duplicate-mixins': true,
        'scss/operator-no-unspaced': true,
        'property-no-unknown': [
            true,
            {
                ignoreProperties: ['size'],
                checkPrefixed: true,
            },
        ],
        'declaration-block-no-shorthand-property-overrides': true,
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-no-duplicate-custom-properties': true,
        'declaration-block-no-redundant-longhand-properties': [
            true,
            {
                ignoreShorthands: ['font'],
            },
        ],
        'length-zero-no-unit': true,
        'shorthand-property-no-redundant-values': true,
    },
};

 */
