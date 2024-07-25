"use server";

import { cookies } from "next/headers";

async function createCookie(token, user) {
	const twoDay = 2 * 24 * 60 * 60 * 1000;
	cookies().set("access-token", token, { expires: Date.now() + twoDay });
	cookies().set("user", JSON.stringify(user), {
		expires: Date.now() + twoDay,
	});
}

async function deleteCookie() {
	cookies().delete("access-token");
	cookies().delete("user");
}

async function getCookie() {
	const cookieStore = cookies();
	const cookie = cookieStore.get("access-token");
	const token = cookie ? cookie.value : null;
	return token;
}

export { createCookie, deleteCookie, getCookie };
