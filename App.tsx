import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components";
import { StatusBar } from "react-native";
import {
	useFonts,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { AuthProvider, useAuth } from "./src/hooks/auth";
import { Routes } from "./src/routes";
import theme from "./src/global/styles/theme";

export default function App() {
	const [areFontsLoaded, error] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_700Bold,
	});
	const { isLoadingStoragedUser } = useAuth();

	if (!areFontsLoaded || isLoadingStoragedUser) {
		if (error) console.error("Error loading fonts:", error);
		if (isLoadingStoragedUser) console.info("Loading storaged user!");
		return <AppLoading />;
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={theme.colors.primary}
			/>

			<AuthProvider>
				<Routes />
			</AuthProvider>
		</ThemeProvider>
	);
}
