import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger } from 'hono/logger';
import { timing } from 'hono/timing';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import unocss, { UnoStyles } from './middleware/uno';
import { consola } from 'consola';
import chalk from 'chalk';
import { readdir, stat } from 'fs/promises';
import { parseArgs } from './arguments';
import { resolve, join, relative } from 'path';
import { ChevronLeftIcon, MagnifyingGlassIcon } from './components/icons';
import { Crumbs } from './components/crumbs';
import { DirectoryItem } from './components/directory-item';
import clientScript from './index.client.js';

const args = parseArgs();

const app = new Hono();

consola.log(chalk.bold(chalk.cyanBright('❄️ hyperborea')));

app.use('*', logger(consola.info), secureHeaders(), cors(), timing(), unocss());
app.use(
	'/__static/*',
	serveStatic({
		root: relative(process.cwd(), args.directory),
		rewriteRequestPath: (path) => path.replace(/^\/__static/, ''),
	}),
);

app.notFound(async (ctx) => {
	const urlPath = decodeURIComponent(ctx.req.path).replace(/^\//, '');
	const basePath = join(resolve(args.directory), urlPath);
	const dir = await readdir(basePath);

	const files = await Promise.all(
		dir.map((f) =>
			(async () => {
				const info = await stat(join(basePath, f));
				if (!info.isFile() && !info.isDirectory()) {
					return {
						type: 'symlink',
						name: f,
					} satisfies DirectoryItem;
				}
				if (info.isDirectory()) {
					return {
						type: 'directory',
						name: f,
						href: join(urlPath, f),
					} satisfies DirectoryItem;
				}

				return {
					type: 'file',
					name: f,
					href: join(urlPath, f),
					size: info.size,
				} satisfies DirectoryItem;
			})(),
		),
	);

	return ctx.html(
		<html>
			<head>
				<UnoStyles />
			</head>
			<body class="bg-neutral-950 text-white">
				<div class="p-6 w-screen min-h-screen flex flex-col">
					<span class="font-semibold text-lg flex flex-row items-center gap-1.5">
						{urlPath !== '' && (
							<a
								class="ml-1.5 p-1.5 rounded-md hover:bg-neutral-900"
								href={'/' + join(urlPath, '..')}
							>
								<ChevronLeftIcon />
							</a>
						)}
						{urlPath === '' && <span>{ctx.req.url}</span>}
						<Crumbs path={urlPath} />
					</span>
					<label class="sticky top-0 bg-neutral-950 px-6 py-3 -translate-x-6 w-screen">
						<span class="absolute top-1.5 bottom-1.5 left-9 flex items-center justify-center">
							<MagnifyingGlassIcon />
						</span>
						<input
							id="filter-input"
							type="text"
							placeholder="Filter this directory..."
							class="bg-neutral-900 outline outline-1 -outline-offset-1 outline-neutral-800 pl-9.5 py-1.5 pr-3 w-full rounded-md"
						/>
					</label>
					<div class="flex flex-col">
						{files
							.filter((f) => f.type === 'directory')
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((f) => (
								<DirectoryItem item={f} />
							))}
						{files
							.filter((f) => f.type === 'file')
							.sort((a, b) => a.name.localeCompare(b.name))
							.map((f) => (
								<DirectoryItem item={f} />
							))}
					</div>
				</div>
				<script
					dangerouslySetInnerHTML={{
						__html: clientScript,
					}}
				/>
			</body>
		</html>,
	);
});

serve(app, (info) => {
	consola.info(
		`Listening on ${chalk.underline(
			`http://${info.address}:${info.port}`,
		)}`,
	);
});
