import fs from 'node:fs';

type StreamOptions = Parameters<typeof fs.createReadStream>[1];

export const onlyReadHexOptions: StreamOptions = {
	flags: 'r',
	encoding: undefined,
	autoClose: true,
	highWaterMark: 1024 * 16,
};
