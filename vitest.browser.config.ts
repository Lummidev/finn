import { defineConfig } from 'vitest/config'
import { webdriverio } from '@vitest/browser-webdriverio'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: webdriverio(),
      // https://vitest.dev/config/browser/webdriverio
      instances: [
        { browser: 'firefox' },
      ],
    },
  },
})
