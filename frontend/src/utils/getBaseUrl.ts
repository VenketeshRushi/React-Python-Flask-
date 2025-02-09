const getBaseUrl = () =>
	import.meta.env.VITE_PUBLIC_NODE_ENV === "development"
		? "http://localhost:5173"
		: import.meta.env.VITE_PUBLIC_DOMAIN;

export default getBaseUrl;
