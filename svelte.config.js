import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
            pages: "docs",
            assets: "docs",
			// trailingSlash: 'always'
        }),
		// prerender: {
		// 	default: true
		// },
		paths: {
			base: dev ? '' : '/secretjs-svelte',
		}
	}
};

export default config;
