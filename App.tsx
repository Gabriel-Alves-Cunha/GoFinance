import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "styled-components";
import { StatusBar } from "react-native";
import {
	useFonts,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { AppRoutes } from "./src/routes/app.routes";
import { SignIn } from "./src/screens/SignIn";
import theme from "./src/global/styles/theme";

export default function App() {
	const [areFontsLoaded, error] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_700Bold,
	});

	if (!areFontsLoaded) {
		if (error) console.error("Error loading fonts:", error);
		return <AppLoading />;
	}

	return (
		<ThemeProvider theme={theme}>
			<NavigationContainer>
				<StatusBar
					barStyle="light-content"
					backgroundColor={theme.colors.primary}
				/>

				<SignIn />
			</NavigationContainer>
		</ThemeProvider>
	);
}
