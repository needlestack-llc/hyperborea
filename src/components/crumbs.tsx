import { memo } from 'hono/jsx';
import { join } from 'path';

export const Crumbs = ({ path }: { path: string }) => {
	return (
		<div class="flex flex-row items-center">
			{path.split('/').map((segment, i) => (
				<>
					{i > 0 && (
						<span class="opacity-50 px-1 select-none">{'/'}</span>
					)}
					<a
						class="hover:underline"
						href={'/' + join(...path.split('/').slice(0, i + 1))}
					>
						<span>{segment}</span>
					</a>
				</>
			))}
		</div>
	);
};
