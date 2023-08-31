import { serve } from '@hono/node-server';
import { consola } from 'consola';
import chalk from 'chalk';
import { parseArgs } from './arguments';
import { loadConfig } from './config';
import { createServer } from './server';

export const help = `\
hyperborea.js:
	--directory\t[path] Path to serve
	--config\t[path] Path to your configuration file
	--port\t\t[number] Port to serve your files on
	--help\t\tShows this message\
`;

const args = parseArgs();
const config = loadConfig(args.config ?? './hyperborea.json');

consola.log(chalk.bold(chalk.cyanBright('❄️ hyperborea')));

if (args.help) {
	consola.info(help);
} else {
	const app = createServer(config, args);
	serve(
		{
			fetch: app.fetch,
			port: config.port ?? args.port,
		},
		(info) => {
			consola.info(
				`Listening on ${chalk.underline(
					`http://${info.address}:${info.port}`,
				)}`,
			);
		},
	);
}
