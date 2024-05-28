declare const BUILD_INFO: {
	TIME: string;
	GIT_BRANCH: string;
	GIT_COMMIT: string;
};

declare module "*package.json" {
	const value: import("type-fest").PackageJson;
	export default value;
}
