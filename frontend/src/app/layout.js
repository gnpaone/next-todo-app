import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/layouts/navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SearchProvider } from "@/context/todoContext";
import { AuthProvider } from "@/context/authContext";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata = {
	title: "Todo",
	description: "A modern todo manager",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<GoogleOAuthProvider
				clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
				<body
					className={cn(
						"bg-background font-sans antialiased",
						fontSans.variable
					)}>
					<SearchProvider>
						<AuthProvider>
							<Navbar />
							{children}
						</AuthProvider>
					</SearchProvider>
				</body>
			</GoogleOAuthProvider>
		</html>
	);
}
