import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  { ignores: ['dist/**', 'android/**', 'ios/**'] },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-use-before-define": "off",
      "react-refresh/only-export-components": "off"
    }
  },
])
