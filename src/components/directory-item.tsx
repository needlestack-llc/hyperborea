import { formatBytes } from '../util';
import { BoxIcon, FileIcon, LinkBreakIcon } from './icons';

type DirFile = {
	type: 'file';
	name: string;
	size: number;
	href: string;
};

const DirFile = ({ item }: { item: DirFile }) => {
	return (
		<a
			data-filterable={item.name}
			href={`/__static/${item.href}`}
			class="hover:bg-neutral-900 px-3 py-1.5 flex flex-row items-center gap-3 rounded-md justify-between"
		>
			<div class="flex flex-row gap-3 items-center">
				<FileIcon />
				{item.name}
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
			data-filterable={item.name}
			class="hover:bg-neutral-900 px-3 py-1.5 flex flex-row items-center gap-3 rounded-md"
		>
			<LinkBreakIcon />
			{item.name}
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
			class="hover:bg-neutral-900 px-3 py-1.5 flex flex-row items-center gap-3 rounded-md"
		>
			<BoxIcon />
			{item.name}
		</a>
	);
};

export type DirectoryItem = DirFile | SubDirectory | Symlink;

export const DirectoryItem = ({ item }: { item: DirectoryItem }) => {
	switch (item.type) {
		case 'file':
			return <DirFile item={item} />;
		case 'directory':
			return <SubDirectory item={item} />;
		case 'symlink':
			return <Symlink item={item} />;
	}
};
