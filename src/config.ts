import consola from 'consola';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
	array,
	object,
	string,
	nullish,
	Output,
	safeParse,
	number,
	boolean,
} from 'valibot';

const configSchema = object({
	directory: nullish(string()),
	port: nullish(number()),
	newTab: nullish(boolean()),
	basicAuth: nullish(
		object({
			credentials: array(
				object({
					username: string(),
					password: string(),
				}),
			),
		}),
	),
});

export type Config = Output<typeof configSchema>;

export const defaultConfig: Config = {};

export function loadConfig(path: string): Config {
	try {
		const configString = readFileSync(resolve(path)).toString();
		const config = safeParse(configSchema, JSON.parse(configString));
		if (!config.success) {
			consola.warn(
				'Invalid config:\n',
				config.issues
					.map(
						(issue) =>
							`\t${issue.path?.map((p) => p.key).join('.')}: ${
								issue.message
							}. Expected ${issue.validation}`,
					)
					.join('\n'),
			);
			return defaultConfig;
		}
		return config.output;
	} catch {
		if (path !== '') {
			consola.warn(
				"Couldn't load specified config, check syntax and permissions: ",
				path,
			);
		}
		return defaultConfig;
	}
}
