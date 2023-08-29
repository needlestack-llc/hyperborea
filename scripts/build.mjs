import { buildSync } from 'esbuild';
import { buildOptions } from './options.mjs';

buildSync(buildOptions);
