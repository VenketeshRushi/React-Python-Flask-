import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/globals.css";
import App from "./App.tsx";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<HeroUIProvider>
				<App />
			</HeroUIProvider>
		</BrowserRouter>
	</StrictMode>
);
