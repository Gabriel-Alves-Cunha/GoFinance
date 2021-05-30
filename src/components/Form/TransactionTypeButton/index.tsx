import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { IconProps } from "./styles";

import { Container, Title, Icon, Button } from "./styles";

interface Props extends RectButtonProps {
	title: string;
	type: IconProps["type"];
	isActive: boolean;
}

const icons = {
	positive: "arrow-up-circle",
	negative: "arrow-down-circle",
};

export function TransactionTypeButton({
	title,
	type,
	isActive,
	...rest
}: Props) {
	return (
		<Container type={type} isActive={isActive}>
			<Button {...rest}>
				<Icon name={icons[type]} type={type} />
				<Title>{title}</Title>
			</Button>
		</Container>
	);
}
