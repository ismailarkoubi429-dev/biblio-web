import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite pour le projet React.js
// La section "test" configure Vitest pour les tests unitaires et d'intégration
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom simule un navigateur (DOM) dans Node.js pour les tests
    environment: 'jsdom',
    // Fichier exécuté avant chaque suite de tests (importe jest-dom)
    setupFiles: ['./src/setupTests.js'],
    // Permet d'utiliser describe/it/expect sans les importer dans chaque fichier
    globals: true,
    // Dossiers contenant les fichiers de tests
    include: ['src/__tests__/**/*.{test,spec}.{js,jsx}'],
    // Résolution des imports CSS (on les ignore dans les tests)
    css: false,
  },
})
