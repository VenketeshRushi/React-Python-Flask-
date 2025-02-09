import Cookies from "js-cookie";

// Define a generic utility type
type StorageValue = string | object | number | boolean | null;

/**
 * Cookies Management
 */
export const CookieStorage = {
	setItem: (
		key: string,
		data: StorageValue
		// expiresInDays: number = 7
	): void => {
		console.log("CookieStorage.setItem", key, data);
		const encodedData = btoa(JSON.stringify(data)); // Encode and stringify the data
		Cookies.set(key, encodedData);
		// Cookies.set(key, encodedData, {
		// 	// sameSite: "none",
		// 	// secure: false, // Set to true if using HTTPS
		// 	// expires: expiresInDays,
		// });
	},

	getItem: <T = StorageValue>(key: string): T | undefined => {
		const encodedData = Cookies.get(key);
		if (encodedData) {
			try {
				return JSON.parse(atob(encodedData)) as T;
			} catch (error) {
				console.error("Error decoding cookie data:", error);
				return undefined;
			}
		}
		return undefined;
	},

	removeItem: (key: string): void => {
		Cookies.remove(key);
	},
};

/**
 * LocalStorage Management
 */
export const LocalStorage = {
	setItem: (key: string, data: StorageValue): void => {
		localStorage.setItem(key, JSON.stringify(data));
	},

	getItem: <T = StorageValue>(key: string): T | undefined => {
		const data = localStorage.getItem(key);
		if (data) {
			try {
				return JSON.parse(data) as T;
			} catch (error) {
				console.error("Error parsing localStorage data:", error);
				return undefined;
			}
		}
		return undefined;
	},

	removeItem: (key: string): void => {
		localStorage.removeItem(key);
	},
};

/**
 * SessionStorage Management
 */
export const SessionStorage = {
	setItem: (key: string, data: StorageValue): void => {
		sessionStorage.setItem(key, JSON.stringify(data));
	},

	getItem: <T = StorageValue>(key: string): T | undefined => {
		const data = sessionStorage.getItem(key);
		if (data) {
			try {
				return JSON.parse(data) as T;
			} catch (error) {
				console.error("Error parsing sessionStorage data:", error);
				return undefined;
			}
		}
		return undefined;
	},

	removeItem: (key: string): void => {
		sessionStorage.removeItem(key);
	},
};
