import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-google-app-auth";

import AppInfo from "../../app.json";

interface AuthProviderProps {
	children: ReactNode;
}

interface User {
	id: string;
	name: string;
	email: string;
	photo?: string;
}

interface IAuthContextData {
	user: User | undefined;
	signInWithGoogle(): Promise<void>;
	signInWithApple(): Promise<void>;
	signOut(): Promise<void>;
	isLoadingStoragedUser: boolean;
}

const IOS_CLIENT_ID =
	"74848271009-s4000hc4mauhqctc6t00e9d8qtubhike.apps.googleusercontent.com";
const ANDROID_CLIENT_ID =
	"74848271009-nk0b0u7g87t8pqc2n6p5scoed2l5egir.apps.googleusercontent.com";
const AuthContext = createContext({} as IAuthContextData);
const userStorageKey = "@" + AppInfo.name + ":" + "user";

function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isLoadingStoragedUser, setIsLoadingStoragedUser] = useState(true);

	async function signInWithGoogle() {
		try {
			const result = await Google.logInAsync({
				iosClientId: IOS_CLIENT_ID,
				androidClientId: ANDROID_CLIENT_ID,
				scopes: ["profile", "email"],
			});

			if (result.type === "success") {
				const loggedUser = {
					id: String(result.user.id),
					email: result.user.email!,
					name: result.user.givenName!,
					photo: result.user.photoUrl!,
				};

				await AsyncStorage.setItem(userStorageKey, JSON.stringify(loggedUser));
				setUser(loggedUser);
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	async function signInWithApple() {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			if (credential) {
				const name = credential.fullName!.givenName!;
				const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;
				const loggedUser = {
					id: String(credential.user),
					email: credential.email!,
					name,
					photo,
				};

				await AsyncStorage.setItem(userStorageKey, JSON.stringify(loggedUser));
				setUser(loggedUser);
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	async function signOut() {
		setUser(undefined);
		await AsyncStorage.removeItem(userStorageKey);
	}

	useEffect(() => {
		(async function loadStoragedUserData() {
			const storagedUser = await AsyncStorage.getItem(userStorageKey);

			if (storagedUser) {
				const loggedUser: User = JSON.parse(storagedUser);
				setUser(loggedUser);
			}

			setIsLoadingStoragedUser(false);
		})();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				signInWithGoogle,
				signInWithApple,
				signOut,
				isLoadingStoragedUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	return useContext(AuthContext);
}

export { AuthProvider, useAuth };
