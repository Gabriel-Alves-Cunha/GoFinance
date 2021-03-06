import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighlightCard } from "../../components/HighlightCard";
import { IconProps } from "../../components/Form/TransactionTypeButton/styles";
import { useAuth } from "../../hooks/auth";
import { dataKey } from "../Register";
import {
	TransactionCard,
	TransactionCardProps,
} from "../../components/TransactionCard";

import {
	Container,
	Header,
	UserInfo,
	Photo,
	UserGreeting,
	UserName,
	User,
	UserWrapper,
	Icon,
	List,
	Transactions,
	Title,
	TransactionList,
	LogoutButton,
	LoadingContainer,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
	id: string;
}

interface HighlightCardProps {
	amount: string;
	lastTransaction: string;
}

interface HighlightCardsData {
	totalIncome: HighlightCardProps;
	totalOutcome: HighlightCardProps;
	total: HighlightCardProps;
}

function getTransactionDate(
	transactions: DataListProps[],
	type: IconProps["type"]
) {
	const collectionFilttered = transactions.filter(
		(transaction) => transaction.type === type
	);

	if (collectionFilttered.length === 0) return "29 de fevereiro";

	const lastTransaction = Math.max.apply(
		Math,
		collectionFilttered.map((transaction) =>
			new Date(transaction.date).getTime()
		)
	);
	const lastTransactionDate = new Date(lastTransaction);
	const lastTransactionDay = lastTransactionDate.getDate();
	const lastTransactionMonth = lastTransactionDate.toLocaleString("pt-BR", {
		month: "long",
	});

	return `${lastTransactionDay} de ${lastTransactionMonth}`;
}

export function Dashboard() {
	const theme = useTheme();
	const { signOut, user } = useAuth();

	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useState<DataListProps[]>([]);
	const [highlightCardData, setHighlightCardData] =
		useState<HighlightCardsData>({
			totalIncome: { amount: "0", lastTransaction: "-" },
			totalOutcome: { amount: "0", lastTransaction: "-" },
			total: { amount: "0", lastTransaction: "-" },
		});

	async function loadTransactionsFormatted() {
		const dataKey_ = dataKey + user!.id;
		const response = await AsyncStorage.getItem(dataKey_);
		const transactions: DataListProps[] = response ? JSON.parse(response) : [];

		let totalIncome = 0;
		let totalOutcome = 0;
		const transactionsFormatted: DataListProps[] = transactions.map((item) => {
			if (item.type === "positive") {
				totalIncome += Number(item.amount);
			} else {
				totalOutcome += Number(item.amount);
			}

			const amount = Number(item.amount).toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			});

			const date = Intl.DateTimeFormat("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
			}).format(new Date(item.date));

			const ret = {
				category: item.category,
				type: item.type,
				name: item.name,
				id: item.id,
				amount,
				date,
			};
			//console.log("Transaction formatted:", ret);

			return ret;
		});
		//console.info("Transactions formatted:", transactionsFormatted);

		setTransactions(transactionsFormatted);

		const lastTransactionIncome = getTransactionDate(transactions, "positive");
		const lastTransactionOutcome = getTransactionDate(transactions, "negative");
		const totalInterval = `01 a ${lastTransactionOutcome}`;

		setHighlightCardData({
			totalIncome: {
				amount: totalIncome.toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				}),
				lastTransaction: `??ltima entrada dia ${lastTransactionIncome}`,
			},
			totalOutcome: {
				amount: totalOutcome.toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				}),
				lastTransaction: `??ltima sa??da dia ${lastTransactionOutcome}`,
			},
			total: {
				amount: (totalIncome - totalOutcome).toLocaleString("pt-BR", {
					style: "currency",
					currency: "BRL",
				}),
				lastTransaction: totalInterval,
			},
		});

		setIsLoading(false);
	}

	useFocusEffect(
		useCallback(() => {
			loadTransactionsFormatted();
		}, [])
	);

	return (
		<Container>
			{isLoading ? (
				<LoadingContainer>
					<ActivityIndicator color={theme.colors.primary} size="large" />
				</LoadingContainer>
			) : (
				<>
					<Header>
						<UserWrapper>
							<UserInfo>
								<Photo
									source={{
										uri: user?.photo,
									}}
								/>
								<User>
									<UserGreeting>Ol??,</UserGreeting>
									<UserName>{user?.name}</UserName>
								</User>
							</UserInfo>

							<LogoutButton onPress={signOut}>
								<Icon name="power" />
							</LogoutButton>
						</UserWrapper>
					</Header>

					<List>
						<HighlightCard
							title="Entradas"
							amount={highlightCardData.totalIncome.amount}
							lastTransaction={highlightCardData.totalIncome.lastTransaction}
							type="positive"
						/>
						<HighlightCard
							title="Sa??das"
							amount={highlightCardData.totalOutcome.amount}
							lastTransaction={highlightCardData.totalOutcome.lastTransaction}
							type="negative"
						/>
						<HighlightCard
							title="Total"
							amount={highlightCardData.total.amount}
							lastTransaction={highlightCardData.total.lastTransaction}
							type="total"
						/>
					</List>

					<Transactions>
						<Title>Listagem</Title>

						<TransactionList
							data={transactions}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <TransactionCard data={item} />}
						/>
					</Transactions>
				</>
			)}
		</Container>
	);
}
