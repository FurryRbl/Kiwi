import fs from 'node:fs';
import { showHelp } from '../main';
import color from '../../../utils/output/color';
import { onlyReadHexOptions } from '../../../utils/defaultOptions';
import { getHeader, getAlgorithmType, getDisableStatus, verifyReserved } from '../utils';

export default (path: string): void => {
	if (!path) {
		console.error(color.redBright('请提供 vbmeta 路径！\n'));
		showHelp();
		process.exit(1);
	} else if (!fs.existsSync(path)) {
		console.error(color.redBright(`找不到或无法访问 ${path} 文件，请检查文件是否存在和权限问题！`));
		process.exit(1);
	}

	const vbmetaStream = fs.createReadStream(path, onlyReadHexOptions);
	vbmetaStream.once('readable', () => {
		const HeaderBuffer = vbmetaStream.read(255); // 头

		// 判断是否是 vbmeta 文件
		const headerBytes = HeaderBuffer.subarray(0, 4);
		if (!headerBytes || headerBytes.toString('utf-8') !== 'AVB0') {
			console.error(color.redBright('您似乎打开的不是 vbmeta 文件？文件头并非‘AVB0’!'));
			process.exit(1);
		}

		// 输出 vbmeta 头信息
		const header = getHeader(HeaderBuffer);
		if (!header) {
			console.error(color.redBright('vbmeta 头信息解析失败！'));
			process.exit(1);
		}

		console.log(
			[
				'vbmeta 头信息：',
				`\t所需最低 libavb版本：${header.libavbVersion?.Major}.${header.libavbVersion?.Minor}`,
				`\t验证数据块大小：${header.authenticationDataBlockSize}字节`,
				`\t辅助数据块大小：${header.auxiliaryDataBlockSize}字节`,
				`\t算法类型：${getAlgorithmType(header.algorithmType as number)}`,
				`\t哈希数据的‘身份验证数据’块偏移量：${header.hashOffset}`,
				`\t哈希数据长度：${header.hashSize}字节`,
				`\t签名数据的‘身份验证数据’块偏移量：${header.signatureOffset}`,
				`\t签名数据长度：${header.signatureSize}字节`,
				`\t公钥数据的‘辅助数据’块偏移量：${header.publicKeyMetadataOffset}`,
				`\t公钥数据长度：${header.signatureSize}字节`,
				`\t公钥元数据的‘辅助数据’块偏移量：${header.publicKeyMetadataSize}`,
				`\t公钥元数据长度：${header.signatureSize}字节`,
				`\t描述符数据的‘辅助数据’块的偏移量：${header.descriptorOffset}`,
				`\t描述符数据长度：${header.descriptorSize}字节`,
				`\t防回滚索引：${header.rollbackIndex}`,
				`\tAVB 验证禁用状态：${getDisableStatus(header.flags as number)}`,
				`\t回滚索引位置：${header.rollbackIndexLocation}`,
				`\t来自 avbtool 的发布字符串：‘${header.releaseString}’`,
				`\t保留位置的填充完整性及正确性：${verifyReserved(header.reserved as Buffer) ? color.greenBright('通过') : color.redBright('未通过')}`,
			].join('\n'),
		);
	});
};
