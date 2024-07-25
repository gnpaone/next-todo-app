"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/api";
import { useAuth } from "@/context/authContext";

const LogoutButton = () => {
	const router = useRouter();
	const { logout } = useAuth();

	const handleLogout = async () => {
		try {
			const data = await fetchData({
				url: `api/v1/auth/logout`,
				method: "GET",
			});

			console.log("Logout data: ", data);

			if (data.success) {
				await logout();
				router.push("/");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Button onClick={handleLogout} variant='outline'>
			Logout
		</Button>
	);
};

export default LogoutButton;
