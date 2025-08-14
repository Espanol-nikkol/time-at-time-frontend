import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type UserConfig } from 'vite';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsConfigPaths from 'vite-tsconfig-paths';

const pwaOptions: Partial<VitePWAOptions> = {
    manifest: {
        name: 'pwa-example',
        short_name: 'pwa-example',
        description: 'pwa-example',
        theme_color: '#ffffff',
        icons: [
            {
                src: 'pwa-64x64.png',
                sizes: '64x64',
                type: 'image/png',
            },
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    },
    injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    },
    devOptions: {
        enabled: true,
        suppressWarnings: true,
        type: 'module',
        navigateFallback: 'index.html',
    },

    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'service-worker.ts',
    registerType: 'autoUpdate',
    injectRegister: false,
};

export default defineConfig((config): UserConfig => {
    const { mode } = config;
    return {
        plugins: [react(), VitePWA(pwaOptions), tsConfigPaths(), svgr()],
        css: {
            modules: {
                generateScopedName: mode === 'development' ? '[name]--[local]--[hash:base64:5]' : '[hash:base64:5]',
            },
        },
        server: {
            port: 3302,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                },
            },
        },
        preview: {
            port: 4172,
        },
        resolve: {
            alias: {
                '@styles': path.resolve(__dirname, './src/styles'),
            },
        },
    };
});
