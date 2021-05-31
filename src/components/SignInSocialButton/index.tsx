import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import { Button, IconContainer, Text } from "./styles";

interface Props extends RectButtonProps {
	title: string;
	svg: React.FC<SvgProps>;
	svgWidth: number;
	svgHeight: number;
}

export function SingInSocialButton({
	title,
	svg: Svg,
	svgWidth,
	svgHeight,
	...rest
}: Props) {
	return (
		<Button {...rest}>
			<IconContainer>
				<Svg width={svgWidth} height={svgHeight} />
			</IconContainer>
			<Text>{title}</Text>
		</Button>
	);
}
