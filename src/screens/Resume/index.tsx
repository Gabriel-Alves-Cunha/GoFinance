import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMonths, subMonths, format } from "date-fns";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { RFValue } from "react-native-responsive-fontsize";
import { ptBR } from "date-fns/locale";

import { DataListProps } from "../Dashboard";
import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import { dataKey } from "../Register";

import {
	Container,
	Header,
	Title,
	Content,
	ChartContainer,
	MonthSelect,
	PreviousButton,
	MonthName,
	NextButton,
	Icon,
} from "./styles";
import { LoadingContainer } from "../Dashboard/styles";

interface CategoryData {
	key: string;
	name: string;
	total: string;
	color: string;
	percent: string;
}

export function Resume() {
	const theme = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
		[]
	);

	function handleDateChange(action: "next" | "prev") {
		if (action === "next") setSelectedDate(addMonths(selectedDate, 1));
		else setSelectedDate(subMonths(selectedDate, 1));
	}

	async function loadFormattedData() {
		setIsLoading(true);

		const response = await AsyncStorage.getItem(dataKey);
		const data: DataListProps[] = response ? JSON.parse(response) : [];
		const outcomes = data.filter(
			(outcome) =>
				outcome.type === "negative" &&
				new Date(outcome.date).getMonth() === selectedDate.getMonth() &&
				new Date(outcome.date).getFullYear() === selectedDate.getFullYear()
		);
		const totalOutcomes = outcomes.reduce(
			(acc, outcome) => acc + Number(outcome.amount),
			0
		);

		const totalByCategory: CategoryData[] = [];

		categories.forEach((category) => {
			let sum = 0;

			outcomes.forEach((outcome) => {
				if (outcome.category === category.key) sum += Number(outcome.amount);
			});

			if (sum > 0) {
				const percent = `${((sum / totalOutcomes) * 100).toFixed(0)}%`;

				totalByCategory.push({
					color: category.color,
					name: category.name,
					key: category.key,
					total: String(sum),
					percent,
				});
			}
		});

		setTotalByCategories(totalByCategory);
		setIsLoading(false);
	}

	useFocusEffect(
		useCallback(() => {
			loadFormattedData();
		}, [selectedDate])
	);

	return (
		<Container>
			<Header>
				<Title>Resumo por categoria</Title>
			</Header>
			{isLoading ? (
				<LoadingContainer>
					<ActivityIndicator color={theme.colors.primary} size="large" />
				</LoadingContainer>
			) : (
				<Content
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 24,
						paddingBottom: useBottomTabBarHeight(),
					}}
				>
					<MonthSelect>
						<PreviousButton onPress={() => handleDateChange("prev")}>
							<Icon name="chevron-left" />
						</PreviousButton>
						<MonthName>
							{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
						</MonthName>
						<NextButton onPress={() => handleDateChange("next")}>
							<Icon name="chevron-right" />
						</NextButton>
					</MonthSelect>

					<ChartContainer>
						<VictoryPie
							data={totalByCategories}
							colorScale={totalByCategories.map((category) => category.color)}
							style={{
								labels: {
									fontSize: RFValue(18),
									fontWeight: "bold",
									fill: theme.colors.shape,
								},
							}}
							padAngle={1}
							labelRadius={75}
							cornerRadius={50}
							innerRadius={30}
							x="total"
							y="percent"
						/>
					</ChartContainer>

					{totalByCategories.map((item) => (
						<HistoryCard
							key={item.key}
							title={item.name}
							amount={item.total}
							color={item.color}
						/>
					))}
				</Content>
			)}
		</Container>
	);
}
