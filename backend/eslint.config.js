import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

export default [
  { files: [
    '**/*.js',
    'src/**/*.js',
    '*.js'],
  ignores: [
    'node_modules/**',
    'dist/**',
    'build/**'
  ], 
  plugins: { js,
    import: importPlugin
  },  
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.es2021
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  rules: {
    // Rules
    'no-console': 'off', 
    'no-unused-vars': 'warn', 
    'prefer-const': 'error', 
    'no-var': 'error',    
    'indent': ['error', 2],   
    'quotes': ['error', 'single'], 
    'semi': ['error', 'always'], 
    
    'import/extensions': ['error', 'always'],
    'import/no-unresolved': 'off'
  }
  },
];
