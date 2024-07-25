"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { axiosInstance } from "@/lib/api";
import { createCookie } from "@/actions/auth";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
	email: z.string().email().min(2).max(50),
	password: z.string().min(7).max(50),
});

const Login = () => {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const router = useRouter();

	const [loading, setLoading] = useState(false);

	async function onSubmit(values) {
		setLoading(true);
		try {
			const { data } = await axiosInstance.post("/api/v1/auth/login", values);
			console.log("data: ", data.data);

			if (data.success) {
				console.log("Success: ", data.message);
				createCookie(data.data.token, data.data.user);
				setLoading(false);
				router.push("/");
				if (typeof window === 'undefined') {
			        revalidatePath("/");
			    }
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	const handleGoogleLoginSuccess = async (tokenResponse) => {
		const accessToken = tokenResponse.access_token;
		try {
			const { data } = await axiosInstance.post("/api/v1/auth/google", {
				accessToken,
			});

			if (data.success) {
				createCookie(data.data.token, data.data.user);
				router.push("/");
				if (typeof window === 'undefined') {
			        revalidatePath("/");
			    }
			}
		} catch (error) {
			console.error(error);
		}
	};

	const signInWithGoogle = useGoogleLogin({
		onSuccess: handleGoogleLoginSuccess,
	});

	return (
		<div>
			<div className='bg-white py-6 sm:py-8 lg:py-12'>
				<div className='mx-auto max-w-screen-2xl px-4 md:px-8'>
					<h2 className='mb-4 text-center text-2xl font-bold text-blue-500/95 md:mb-8 lg:text-3xl'>
						Login
					</h2>

					<Form {...form}>
						<form className='mx-auto max-w-lg rounded-lg border'>
							<div className='flex flex-col gap-4 p-4 md:p-8'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder='test@email.com'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='Enter your password'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									disable={!loading}
									onClick={form.handleSubmit(onSubmit)}
									variant='hero'>
									{loading ? "loading..." : "Log in"}
								</Button>

								<div className='relative flex items-center justify-center'>
									<span className='absolute inset-x-0 h-px bg-gray-300'></span>
									<span className='relative bg-white px-4 text-sm text-gray-400'>
										Log in with social
									</span>
								</div>

								<Button
									onClick={signInWithGoogle}
									variant='outline'
									asChild>
									<div className='flex items-center gap-4'>
										<svg
											className='h-5 w-5 shrink-0'
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M23.7449 12.27C23.7449 11.48 23.6749 10.73 23.5549 10H12.2549V14.51H18.7249C18.4349 15.99 17.5849 17.24 16.3249 18.09V21.09H20.1849C22.4449 19 23.7449 15.92 23.7449 12.27Z'
												fill='#4285F4'
											/>
											<path
												d='M12.2549 24C15.4949 24 18.2049 22.92 20.1849 21.09L16.3249 18.09C15.2449 18.81 13.8749 19.25 12.2549 19.25C9.12492 19.25 6.47492 17.14 5.52492 14.29H1.54492V17.38C3.51492 21.3 7.56492 24 12.2549 24Z'
												fill='#34A853'
											/>
											<path
												d='M5.52488 14.29C5.27488 13.57 5.14488 12.8 5.14488 12C5.14488 11.2 5.28488 10.43 5.52488 9.71V6.62H1.54488C0.724882 8.24 0.254883 10.06 0.254883 12C0.254883 13.94 0.724882 15.76 1.54488 17.38L5.52488 14.29Z'
												fill='#FBBC05'
											/>
											<path
												d='M12.2549 4.75C14.0249 4.75 15.6049 5.36 16.8549 6.55L20.2749 3.13C18.2049 1.19 15.4949 0 12.2549 0C7.56492 0 3.51492 2.7 1.54492 6.62L5.52492 9.71C6.47492 6.86 9.12492 4.75 12.2549 4.75Z'
												fill='#EA4335'
											/>
										</svg>
										Sign in with Google
									</div>
								</Button>
							</div>

							<div className='flex items-center justify-center bg-gray-100 p-4'>
								<p className='text-center text-sm text-gray-500'>
									Don&apos;t have an account?{" "}
									<Link
										href='/sign-up'
										className='text-blue-500 transition duration-100 hover:text-blue-600 active:text-blue-700'>
										Sign up
									</Link>
								</p>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
