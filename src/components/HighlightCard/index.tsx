import React from "react";

import { IconProps } from "../Form/TransactionTypeButton/styles";

import {
	Container,
	Header,
	Title,
	Icon,
	Footer,
	Amount,
	LastTransaction,
} from "./styles";

interface Props {
	title: string;
	amount: string;
	lastTransaction: string;
	type: IconProps["type"] | "total";
}

const icon = {
	positive: "arrow-up-circle",
	negative: "arrow-down-circle",
	total: "dollar-sign",
};

export function HighlightCard({ title, amount, lastTransaction, type }: Props) {
	return (
		<Container type={type}>
			<Header>
				<Title type={type}>{title}</Title>
				<Icon name={icon[type]} type={type} />
			</Header>

			<Footer>
				<Amount type={type}>{amount}</Amount>
				<LastTransaction type={type}>{lastTransaction}</LastTransaction>
			</Footer>
		</Container>
	);
}
