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

interface CategoryProps {
	category: Category;
	setCategory: (category: Category) => void;
	closeSelectedCategory: () => void;
}

export function CategorySelect({
	category,
	closeSelectedCategory,
	setCategory,
}: CategoryProps) {
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
					<Category>
						<Icon name={item.icon} />
						<Name>{item.name}</Name>
					</Category>
				)}
			/>

			<Footer>
				<Button title="Selecionar" onPress={closeSelectedCategory} />
			</Footer>
		</Container>
	);
}
