declare const BUILD_INFO: {
	TIME: string | undefined;
	BUILD_MODE: string | undefined;
	GIT_BRANCH: string | undefined;
	GIT_COMMIT: string | undefined;
};

declare module '*/package.json' {
	const value: import('type-fest').PackageJson;
	export default value;
}
