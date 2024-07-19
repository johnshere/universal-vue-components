import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default tsEslint.config(
    {
        ignores: ['node_modules', 'output', 'dist'],
    },
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
        rules: {
            'vue/html-indent': ['error', 4],
            'vue/singleline-html-element-content-newline': 'off',
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: {
                        max: 2,
                    },
                    multiline: {
                        max: 1,
                    },
                },
            ],
        },
    },
    {
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
