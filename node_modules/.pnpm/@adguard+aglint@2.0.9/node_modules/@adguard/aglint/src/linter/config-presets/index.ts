import { type LinterConfig } from '../common';
import aglintAll from './aglint-all';
import aglintRecommended from './aglint-recommended';

export const defaultConfigPresets = new Map<string, LinterConfig>([
    ['aglint:recommended', aglintRecommended],
    ['aglint:all', aglintAll],
]);
