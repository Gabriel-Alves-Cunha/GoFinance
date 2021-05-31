import React, { useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { useTheme } from "styled-components";
import { RFValue } from "react-native-responsive-fontsize";

import { SingInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";

import GoFinanceLogoSvg from "../../assets/gofinance.svg";
import GoogleLogoSvg from "../../assets/google.svg";
import AppleLogoSvg from "../../assets/apple.svg";

import {
	Container,
	Header,
	TitleWrapper,
	Title,
	SignInTitle,
	Footer,
	FooterWrapper,
} from "./styles";

export function SignIn() {
	const theme = useTheme();

	const [isLoading, setIsLoading] = useState(false);
	const { signInWithGoogle, signInWithApple } = useAuth();

	async function handleSignInWithGoogle() {
		try {
			setIsLoading(true);
			return await signInWithGoogle();
		} catch (error) {
			console.error("Erro ao autenticar com o Google:", error);
			Alert.alert("Erro ao autenticar com o Google!");
			setIsLoading(false);
		}
	}

	async function handleSignInWithApple() {
		try {
			setIsLoading(true);
			return await signInWithApple();
		} catch (error) {
			console.error("Erro ao autenticar com o Apple:", error);
			Alert.alert("Erro ao autenticar com o Apple!");
			setIsLoading(false);
		}
	}

	return (
		<Container>
			<Header>
				<TitleWrapper>
					<GoFinanceLogoSvg width={RFValue(120)} height={RFValue(68)} />

					<Title>
						Controle suas{"\n"}finanças de forma{"\n"}muito simples
					</Title>
				</TitleWrapper>

				{Platform.OS === "ios" ? (
					<SignInTitle>
						Faça seu login com{"\n"}uma das contas abaixo
					</SignInTitle>
				) : (
					<SignInTitle>
						Faça seu login com{"\n"}sua conta da Google abaixo
					</SignInTitle>
				)}
			</Header>

			<Footer>
				<FooterWrapper>
					<SingInSocialButton
						title="Entrar com Google"
						svg={GoogleLogoSvg}
						svgWidth={RFValue(20)}
						svgHeight={RFValue(20)}
						onPress={handleSignInWithGoogle}
					/>

					{Platform.OS === "ios" && (
						<SingInSocialButton
							title="Entrar com Apple"
							svg={AppleLogoSvg}
							svgWidth={RFValue(20)}
							svgHeight={RFValue(20)}
							onPress={handleSignInWithApple}
						/>
					)}
				</FooterWrapper>

				{isLoading && (
					<ActivityIndicator
						color={theme.colors.shape}
						size="small"
						style={{ marginTop: 20 }}
					/>
				)}
			</Footer>
		</Container>
	);
}
