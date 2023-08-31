import { formatBytes } from '../util';
import { BoxIcon, FileIcon, ImageIcon, LinkBreakIcon } from './icons';

type DirFile = {
	type: 'file';
	name: string;
	size: number;
	href: string;
};

const DirFile = ({ item, newTab }: { item: DirFile; newTab: boolean }) => {
	let canPreview = false;
	const extension = item.name.split('.').at(-1)?.toLocaleLowerCase();

	if (
		extension &&
		['png', 'webp', 'jpeg', 'jpg', 'gif'].includes(extension)
	) {
		canPreview = true;
	}

	return (
		<a
			data-filterable={item.name.toLocaleLowerCase()}
			data-filename={item.name}
			data-size={item.size}
			data-href={item.href}
			data-extension={extension ?? 'none'}
			data-can-preview={canPreview}
			href={`/__static/${item.href}`}
			target={newTab ? '_blank' : ''}
			class="hover:bg-slate-900 px-3 py-1.5 flex flex-row items-center gap-3 rounded-md justify-between truncate"
		>
			<div class="flex flex-row gap-3 items-center">
				{canPreview ? <ImageIcon /> : <FileIcon />}
				<span class="truncate">{item.name}</span>
			</div>
			<span class="font-medium opacity-50">{formatBytes(item.size)}</span>
		</a>
	);
};
type Symlink = {
	type: 'symlink';
	name: string;
};

const Symlink = ({ item }: { item: Symlink }) => {
	return (
		<div
			data-filterable={item.name.toLocaleLowerCase()}
			class="hover:bg-slate-900 px-3 py-1.5 flex flex-row items-center gap-3 rounded-md truncate"
		>
			<LinkBreakIcon />
			<span class="truncate">{item.name}</span>
			<span class="opacity-50 ml-auto">(symlink)</span>
		</div>
	);
};

type SubDirectory = {
	type: 'directory';
	name: string;
	href: string;
};

const SubDirectory = ({ item }: { item: SubDirectory }) => {
	return (
		<a
			data-filterable={item.name}
			href={`/${item.href}`}
			class="hover:bg-slate-900 px-3 py-1.5 flex flex-row items-center gap-3 rounded-md truncate"
		>
			<BoxIcon />
			<span class="truncate">{item.name}</span>
		</a>
	);
};

export type DirectoryItem = DirFile | SubDirectory | Symlink;

export const DirectoryItem = ({
	item,
	newTab,
}: {
	item: DirectoryItem;
	newTab?: boolean;
}) => {
	switch (item.type) {
		case 'file':
			return <DirFile newTab={newTab ?? false} item={item} />;
		case 'directory':
			return <SubDirectory item={item} />;
		case 'symlink':
			return <Symlink item={item} />;
	}
};
