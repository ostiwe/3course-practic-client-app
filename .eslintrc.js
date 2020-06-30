module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  ignorePatterns: [
    '/cypress',
    '/src/assets',
    '/src/redux',
    '/src/react-app-env.d.ts',
    '/src/serviceWorker.js',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'react/jsx-tag-spacing': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-bitwise': ['error', { allow: ['&'] }],
    'react/prop-types': [2,
      {
        ignore: ['dispatch', 'history', 'match', 'location', 'locale', 'userInfo'],
      }],
  },
};
