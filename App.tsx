import React from "react";
import { ThemeProvider } from "styled-components";
import { StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import {
	useFonts,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { Register } from "./src/screens/Register";

import theme from "./src/global/styles/theme";

export default function App() {
	const [areFontsLoaded, error] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_700Bold,
	});

	if (!areFontsLoaded) {
		if (error) console.error(error);
		return <AppLoading />;
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={theme.colors.primary}
			/>

			<Register />
		</ThemeProvider>
	);
}
