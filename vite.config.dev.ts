import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueFacingDecoratorHmr from './vite-plugin-vue-facing-decorator-hmr'
import checker from 'vite-plugin-checker'
import { textureResize } from '@gltf-transform/functions'
import gltf from 'vite-plugin-gltf'
//for use in dev mode
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('a-')
        }
      }
    }),
    vueJsx(),
    vueDevTools(),
    vueFacingDecoratorHmr(),
    checker({
      vueTsc: false //Check compatibility once this gets fixed
    }),
    gltf({
      transforms: [textureResize({ size: [1024, 1024] })]
    })
  ],
  base: '/',
  assetsInclude: ['**/*.glb'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    hmr: {
      overlay: true
    }
  }
})
