import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: './',
	resolve:{
		alias:{
			'@shared': '/shared',
			'@ts': '/src/ts',
			'@components': '/src/components',
			'@views': '/src/views',
			//'./*': '../../../shared/*'
		}
	},
	build:{
		outDir: '../../out/frontend/dist'
	}
})
