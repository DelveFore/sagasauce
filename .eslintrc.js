module.exports = {
  root: true,
  plugins: ['@babel', 'jest'],
  extends: [
    'plugin:prettier/recommended',
    'standard',
    'prettier',
    'prettier/babel',
    'prettier/standard',
    'prettier/unicorn',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  parser: '@babel/eslint-parser',
  ignorePatterns: ['./coverage', './dist/**/*']
}
