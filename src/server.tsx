import { serveStatic } from '@hono/node-server/serve-static';
import consola from 'consola';
import { readdir, stat } from 'fs/promises';
import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { relative, join, resolve } from 'path';
import { Crumbs } from './components/crumbs';
import { DirectoryItem } from './components/directory-item';
import {
	ChevronLeftIcon,
	CrossIcon,
	ExternalLinkIcon,
	MagnifyingGlassIcon,
} from './components/icons';
import { Config } from './config';
import unocss, { UnoStyles } from './middleware/uno';
import { parseArgs } from './arguments';
import clientScript from './index.client.js';

export function createServer(
	config: Config,
	args: ReturnType<typeof parseArgs>,
) {
	const app = new Hono();

	app.use(
		'*',
		logger(consola.info),
		secureHeaders(),
		cors(),
		timing(),
		unocss(),
	);

	if (config.basicAuth) {
		const [firstUser, ...users] = config.basicAuth.credentials;
		app.use(
			'*',
			basicAuth(
				{
					...firstUser,
				},
				...users,
			),
		);
	}
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
				<body class="flex flex-row bg-slate-950 text-white">
					<div class="min-h-screen flex flex-col grow">
						<span class="font-semibold text-lg flex flex-row items-center gap-1.5 px-6 pt-6">
							{urlPath !== '' && (
								<a
									class="ml-1.5 p-1.5 rounded-md hover:bg-slate-900"
									href={'/' + join(urlPath, '..')}
								>
									<ChevronLeftIcon />
								</a>
							)}
							{urlPath === '' && <span>{ctx.req.url}</span>}
							<Crumbs path={urlPath} />
						</span>
						<label class="sticky top-0 bg-slate-950 px-6 py-3 z-10">
							<span class="absolute top-1.5 bottom-1.5 left-9 flex items-center justify-center">
								<MagnifyingGlassIcon />
							</span>
							<input
								id="filter-input"
								type="text"
								placeholder="Filter this directory..."
								class="bg-slate-900 border border-slate-800 pl-9.5 py-1.5 pr-3 w-full rounded-md focus:outline outline-blue-500 outline-offset-1"
							/>
						</label>
						<div class="flex flex-col px-6 pb-6">
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
									<DirectoryItem
										newTab={config.newTab ?? false}
										item={f}
									/>
								))}
						</div>
					</div>
					<div
						id="preview"
						class="hidden basis-1/2 grow border-l border-l-slate-900 w-1/2 p-6"
					>
						<div class="flex flex-col gap-3">
							<div class="flex flex-row w-full gap-3 items-center">
								<div class="grow" id="filename"></div>
								<button
									class="p-2 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center my-auto"
									id="close-preview"
								>
									<CrossIcon />
								</button>
							</div>
							<img id="img" class="rounded-md" />
							<div class="flex flex-row justify-end">
								<a
									target={config.newTab ? '_blank' : ''}
									class="flex flex-row gap-1.5 px-3 py-1 rounded-md bg-gray-900 border border-gray-800 items-center"
								>
									<ExternalLinkIcon />
									Open file
								</a>
							</div>
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

	return app;
}
