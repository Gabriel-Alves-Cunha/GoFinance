import React, { useState } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import * as Yup from "yup";

import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from "../CategorySelect";
import { DataListProps } from "../Dashboard";
import { IconProps } from "../../components/Form/TransactionTypeButton/styles";
import { InputForm } from "../../components/Form/InputForm";
import { useAuth } from "../../hooks/auth";
import { Button } from "../../components/Form/Button";

import AppInfo from "../../../app.json";

import {
	Container,
	Header,
	Title,
	Form,
	Fields,
	TransactionsTypes,
} from "./styles";

interface FormData extends DataListProps {}

const schema = Yup.object().shape({
	name: Yup.string().required("Nome é obrigatório!"),
	amount: Yup.number()
		.typeError("Informe um valor numérico!")
		.positive("O valor não pode ser negativo!")
		.required("Insira um valor!"),
});

async function clearDataFromAsyncStorage(Key: string) {
	const data = await AsyncStorage.removeItem(Key);
	console.log("Cleared transaction data:", data);
}

export const dataKey = "@" + AppInfo.name + ":" + "transactions_user:";

export function Register() {
	const { user } = useAuth();
	const dataKey_ = dataKey + user!.id;
	const clearAllTransactionData = false;
	if (clearAllTransactionData) clearDataFromAsyncStorage(dataKey_);

	const [transactionType, setTransactionType] =
		useState<IconProps["type"] | "">("");
	const [categoryModalOpen, setCategoryModalOpen] = useState(false);
	const [category, setCategory] = useState({
		key: "category",
		name: "Categoria",
	});
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ resolver: yupResolver(schema) });

	const navigation = useNavigation();

	async function handleRegister(form: FormData) {
		if (!transactionType) return Alert.alert("Selecione o tipo da transação!");
		if (category.key === "category")
			return Alert.alert("Selecione a categoria!");

		const newTransaction: DataListProps = {
			id: String(uuid.v4()),
			name: form.name,
			amount: form.amount,
			type: transactionType,
			category: category.key,
			date: String(new Date()),
		};

		try {
			const response = await AsyncStorage.getItem(dataKey_);
			const oldData: DataListProps[] = response ? JSON.parse(response) : [];
			const newData = [...oldData, newTransaction];
			//console.log("newData:", newData);
			await AsyncStorage.setItem(dataKey_, JSON.stringify(newData));

			reset();
			setTransactionType("");
			setCategory({
				key: "category",
				name: "Categoria",
			});

			navigation.navigate("Listagem");
		} catch (error) {
			console.error("Erro ao tentar armazenar form: FormData =>", error);
			Alert.alert("Não foi possível armazenar seus dados!");
		}
	}

	function handleTransactionTypeSelect(type: IconProps["type"]) {
		setTransactionType(type);
	}

	function handleCloseSelectCategoryModal() {
		setCategoryModalOpen(false);
	}

	function handleOpenSelectCategoryModal() {
		setCategoryModalOpen(true);
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Container>
				<Header>
					<Title>Cadastro</Title>
				</Header>

				<Form>
					<Fields>
						<InputForm
							name="name"
							control={control}
							placeholder="Nome"
							autoCapitalize="sentences"
							autoCorrect={false}
							error={errors.name && errors.name.message}
						/>
						<InputForm
							name="amount"
							control={control}
							placeholder="Preço"
							keyboardType="numeric"
							error={errors.amount && errors.amount.message}
						/>

						<TransactionsTypes>
							<TransactionTypeButton
								type="positive"
								title="Income"
								onPress={() => handleTransactionTypeSelect("positive")}
								isActive={transactionType === "positive"}
							/>
							<TransactionTypeButton
								type="negative"
								title="Outcome"
								onPress={() => handleTransactionTypeSelect("negative")}
								isActive={transactionType === "negative"}
							/>
						</TransactionsTypes>

						<CategorySelectButton
							title={category.name}
							onPress={handleOpenSelectCategoryModal}
						/>
					</Fields>

					<Button title="Enviar" onPress={handleSubmit(handleRegister)} />
				</Form>

				<Modal visible={categoryModalOpen}>
					<CategorySelect
						category={category}
						setCategory={setCategory}
						closeSelectCategoryModal={handleCloseSelectCategoryModal}
					/>
				</Modal>
			</Container>
		</TouchableWithoutFeedback>
	);
}
