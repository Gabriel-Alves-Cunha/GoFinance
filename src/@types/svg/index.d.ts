declare module "*.svg" {
	// todo arquivo que termina em .svg
	import React from "react";
	import { SvgProps } from "react-native-svg";
	const content: React.FC<SvgProps>;
	export default content;
}
