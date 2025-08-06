import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig((config): UserConfig => {
    const { mode } = config;
    return {
        plugins: [react(), tsConfigPaths(), svgr()],
        css: {
            modules: {
                generateScopedName: mode === 'development' ? '[name]--[local]--[hash:base64:5]' : '[hash:base64:5]',
            },
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                '@styles': path.resolve(__dirname, './src/styles'),
            },
        },
    };
});
