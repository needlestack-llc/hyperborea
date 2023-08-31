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
			port: {
				type: 'string',
			},
			help: {
				type: 'boolean',
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

	let port = 3000;

	if (args.values.port && !Number.isNaN(parseInt(args.values.port))) {
		port = parseInt(args.values.port);
	}

	return {
		directory: dir ?? './',
		config: args.values.config,
		help: args.values.help,
		port: port,
	};
};
