import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: './',
	resolve:{
		alias:{
			'@root': '.',
			'@shared': '../shared',
			'@ts': '/src/ts',
			'@components': '/src/components',
			'@views': '/src/views',
		
		}
		// alias:[
		// 	{ find: '@/shared', replacement: fileURLToPath(new URL('../shared', import.meta.url)) },
		// 	{ find: '@/ts', replacement: fileURLToPath(new URL('./src/ts', import.meta.url)) },
		// 	{ find: '@/views', replacement: fileURLToPath(new URL('./src/views', import.meta.url)) },
		// ]
	},
	build:{
		outDir: '../../out/frontend/dist'
	}
})

