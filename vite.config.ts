import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueFacingDecoratorHmr from './vite-plugin-vue-facing-decorator-hmr'
import { textureResize } from '@gltf-transform/functions'
import gltf from 'vite-plugin-gltf'
//for use in build and test mode
export default defineConfig(({ command, mode }) => {
  const env = mode === 'production' ? 'production' : 'development'
  return {
    base: '/map',
    define: { 'process.env.NODE_ENV': '"production"' },
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
      gltf({
        transforms: [textureResize({ size: [1024, 1024] })]
      })
    ],
    assetsInclude: ['**/*.glb'],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      hmr: {
        overlay: true
      }
    },
    build: {
      outDir: 'build/dist',
      minify: 'terser', // Set Terser as the minifier
      terserOptions: {
        compress: {
          drop_console: true // Example option to remove console logs
        },
        mangle: true, // Enable name mangling
        format: {
          comments: false // Remove comments
        }
      }
    },
    optimizeDeps: {
      include: ['redux', 'vue-redux' /* other frequently used dependencies */]
    }
  }
})
