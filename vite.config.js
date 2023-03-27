import {defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import AutoImport from 'unplugin-auto-import/vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      AutoImport({
        imports:['vue','vue-router']
      })
  ],
  // server:{
  //   hmr:true,
  //   port:3001,
  //   proxy:{
  //     '/api':{
  //       target:'http://localhost:8081/', //目标代理地址
  //       secure:false,
  //       changeOrigin:true,
  //       pathRewrite:{
  //         '^/api':'/api',
  //       }
  //     },
  //   },
  // },
  server:{
    hmr:true,
    port:3001,
    proxy:{
      '/api':'http://localhost:8081/'
    }
  },
  resolve:{
    //配置路径别名
    alias:{
      '@': path.resolve(__dirname, './src'),
    },
  },

});
