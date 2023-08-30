import consola from 'consola';
import { parseArgs as parseNodeArgs } from 'util';

export const parseArgs = () => {
	const args = parseNodeArgs({
		options: {
			directory: {
				type: 'string',
			},
			config: {
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
		config: args.values.config,
	};
};
