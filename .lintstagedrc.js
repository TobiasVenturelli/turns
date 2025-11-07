module.exports = {
  'apps/backend/**/*.{ts,tsx}': (filenames) => {
    // Ejecutar lint del workspace completo
    return [
      'pnpm --filter backend lint',
      `prettier --write ${filenames.join(' ')}`,
    ];
  },
  '*.{json,md,yml,yaml}': ['prettier --write'],
};

