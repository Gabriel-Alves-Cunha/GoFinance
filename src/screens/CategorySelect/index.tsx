import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "../../components/Form/Button";

import { categories } from "../../utils/categories";

import {
	Container,
	Header,
	Title,
	Category,
	Icon,
	Name,
	Separator,
	Footer,
} from "./styles";

interface Category {
	key: string;
	name: string;
}

interface CategorySelectProps {
	category: Category;
	setCategory: (category: Category) => void;
	closeSelectCategoryModal: () => void;
}

export function CategorySelect({
	category,
	setCategory,
	closeSelectCategoryModal,
}: CategorySelectProps) {
	function handleCategorySelect(category: Category) {
		setCategory(category);
	}

	return (
		<Container>
			<Header>
				<Title>Categoria</Title>
			</Header>

			<FlatList
				data={categories}
				style={{ flex: 1, width: "100%" }}
				keyExtractor={(item) => item.key}
				ItemSeparatorComponent={() => <Separator />}
				renderItem={({ item }) => (
					<Category
						onPress={() => handleCategorySelect(item)}
						isActive={category.key === item.key}
					>
						<Icon name={item.icon} />
						<Name>{item.name}</Name>
					</Category>
				)}
			/>

			<Footer>
				<Button title="Selecionar" onPress={closeSelectCategoryModal} />
			</Footer>
		</Container>
	);
}
