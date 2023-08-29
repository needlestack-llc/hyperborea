import consola from 'consola';
import { resolve } from 'path';
import { cwd } from 'process';
import { parseArgs as parseNodeArgs } from 'util';

const help = `\
hyperborea [directory?] or --directory /path/to/files\
`;

export const parseArgs = () => {
	const args = parseNodeArgs({
		options: {
			directory: {
				type: 'string',
			},
		},
		allowPositionals: true,
	});

	const dir = args.values.directory ?? args.positionals[0];

	if (!dir) {
		consola.warn(
			'Defaulting to serving the current directory. Provide a directory to prevent this message in the future.',
		);
	}

	return {
		directory: dir ?? './',
	};
};
