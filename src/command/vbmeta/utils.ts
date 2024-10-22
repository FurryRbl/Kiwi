import fs from 'node:fs';

export type Header = {
	Magic: string;
	libavbVersion: {
		Major: number;
		Minor: number;
	};
	authenticationDataBlockSize: bigint;
	auxiliaryDataBlockSize: bigint;
	algorithmType: number;
	hashOffset: bigint;
	hashSize: bigint;
	signatureOffset: bigint;
	signatureSize: bigint;
	publicKeyOffset: bigint;
	publicKeySize: bigint;
	publicKeyMetadataOffset: bigint;
	publicKeyMetadataSize: bigint;
	descriptorOffset: bigint;
	descriptorSize: bigint;
	rollbackIndex: number;
	flags: number;
	rollbackIndexLocation: number;
	releaseString: string;
	reserved: Buffer;
};

export const getHeader = (vbmetaHeaderBuffer: Buffer): Partial<Header> | undefined => {
	if (vbmetaHeaderBuffer.length !== 255) {
		return undefined;
	}

	return {
		Magic: vbmetaHeaderBuffer.subarray(0, 3).toString('utf-8'),
		libavbVersion: {
			Major: vbmetaHeaderBuffer.readUInt32BE(4),
			Minor: vbmetaHeaderBuffer.readUInt32BE(8),
		},
		authenticationDataBlockSize: vbmetaHeaderBuffer.readBigUInt64BE(12),
		auxiliaryDataBlockSize: vbmetaHeaderBuffer.readBigUInt64BE(20),
		algorithmType: vbmetaHeaderBuffer.readUInt32BE(28),
		hashOffset: vbmetaHeaderBuffer.readBigUInt64BE(32),
		hashSize: vbmetaHeaderBuffer.readBigUInt64BE(40),
		signatureOffset: vbmetaHeaderBuffer.readBigUInt64BE(48),
		signatureSize: vbmetaHeaderBuffer.readBigUInt64BE(56),
		publicKeyOffset: vbmetaHeaderBuffer.readBigUInt64BE(64),
		publicKeySize: vbmetaHeaderBuffer.readBigUInt64BE(72),
		publicKeyMetadataOffset: vbmetaHeaderBuffer.readBigUInt64BE(80),
		publicKeyMetadataSize: vbmetaHeaderBuffer.readBigUInt64BE(88),
		descriptorOffset: vbmetaHeaderBuffer.readBigUInt64BE(96),
		descriptorSize: vbmetaHeaderBuffer.readBigUInt64BE(104),
		rollbackIndex: vbmetaHeaderBuffer.readUInt32BE(112),
		flags: vbmetaHeaderBuffer.readUInt32BE(120),
		rollbackIndexLocation: vbmetaHeaderBuffer.readUInt32BE(124),
		releaseString: vbmetaHeaderBuffer
			.subarray(128, 176)
			.toString('utf-8')
			.replace(/\u0000/g, ''),
		reserved: vbmetaHeaderBuffer.subarray(176, 255),
	};
};

export const getAlgorithmType = (algorithmType: number): string => {
	switch (algorithmType) {
		case 0:
			return '无';
		case 1:
			return 'SHA256 + RSA2048';
		case 2:
			return 'SHA256 + RSA4096';
		case 3:
			return 'SHA256 + RSA8192';
		case 4:
			return 'SHA512 + RSA2048';
		case 5:
			return 'SHA512 + RSA4096';
		case 6:
			return 'SHA512 + RSA8192';
		default:
			return '未知';
	}
};

export const getDisableStatus = (flags: number): string => {
	switch (flags) {
		case 0:
			return '无禁用';
		case 1:
			return '已禁用镜像哈希树验证';
		case 2:
			return '已禁用镜像完整性验证';
		case 3:
			return '已禁用镜像哈希树验证 + 镜像完整性验证';
		default:
			return '未知';
	}
};

export const verifyReserved = (reserved: Buffer) => reserved.every(byte => byte === 0);

export const isVBMeta = (filepath: string): boolean => {
	const vbmetaFile = fs.openSync(filepath, 'r');

	const MagicBuffer = Buffer.alloc(4);

	fs.readSync(vbmetaFile, MagicBuffer, 0, 4, 0);
	fs.closeSync(vbmetaFile);

	return MagicBuffer.toString('utf-8') === 'AVB0';
};
