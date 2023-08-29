/** @type {import('esbuild').BuildOptions} */
export const buildOptions = {
	entryPoints: ['src/index.tsx'],
	bundle: true,
	loader: {
		'.css': 'text',
		'.client.js': 'text',
	},
	minify: true,
	outfile: 'dist/index.js',
	platform: 'node',
};
