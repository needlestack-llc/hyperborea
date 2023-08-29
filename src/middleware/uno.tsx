import { presetUno } from 'unocss';
import { createGenerator } from '@unocss/core';
import reset from '@unocss/reset/tailwind.css';
import { startTime, endTime } from 'hono/timing';
import { Context, MiddlewareHandler, Next } from 'hono';

const generator = createGenerator({
	presets: [presetUno()],
});

async function unocss(ctx: Context, next: Next) {
	await next();

	const contentType = ctx.res.headers.get('Content-Type');

	if (!contentType?.includes('text/html')) {
		return;
	}

	const body = await ctx.res.text();
	startTime(ctx, 'unocss');
	const { css, getLayer } = await generator.generate(body);
	endTime(ctx, 'unocss');
	ctx.res = new Response(
		body.replace('__UNOCSS_ENTRY__', reset + css),
		ctx.res,
	);
}

export const UnoStyles = () => <style>__UNOCSS_ENTRY__</style>;

export default (): MiddlewareHandler => unocss;
