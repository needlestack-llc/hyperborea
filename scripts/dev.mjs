import { buildOptions } from './options.mjs';
import { context } from 'esbuild';

// FIXME: this watches but the nodemon watching it doesn't work

context({
	...buildOptions,
	outfile: '.tmp/index.js',
}).then((ctx) => {
	ctx.watch().then(() => {
		console.log('watching for changes...');
	});
});
