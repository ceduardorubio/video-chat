import { defineConfig } from "vite";

export default defineConfig( {
        build: {
            sourcemap: 'inline',
        },
		server: {
			port: 5000,
            allowedHosts: 't3.cvx.dev'
		},
} );