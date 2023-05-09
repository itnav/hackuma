module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended', // eslintの推奨ルールを適用
    'next/core-web-vitals', // Next.jsのルールを適用
    'plugin:@typescript-eslint/recommended', // TypeScriptの推奨ルールを適用
    'plugin:react/recommended', // Reactの推奨ルールを適用
    'prettier', // prettierのルールを適用
  ],
  overrides: [],
  parser: '@typescript-eslint/parser', // ESLintのパーサーを指定
  parserOptions: {
    ecmaVersion: 'latest', // ECMAScriptのバージョンを指定
    sourceType: 'module', // import/exportを利用する場合は'module'を指定
  },
  rules: {
    'react/jsx-uses-react': 'off', // React17以降は不要
    'react/react-in-jsx-scope': 'off', // React17以降は不要
  },
}
