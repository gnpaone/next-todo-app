import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoutButton from "@/components/logoutButton";
import Bar from "@/app/todo/components/bar";
import { cookies } from "next/headers";

const Navbar = () => {
	const cookieStore = cookies();
	const cookie = cookieStore.get("access-token");
	const token = cookie ? cookie.value : null;

	return (
		<div className='bg-blue-500/95'>
			<div className='mx-auto max-w-screen-2xl px-4 md:px-8'>
				<header className='mb-4 flex flex-col gap-4 items-center justify-between py-4 md:mb-12 md:py-8 lg:mb-0 lg:flex-row lg:gap-0'>
					<Link
						href='/'
						className='inline-flex items-center gap-2.5 text-2xl font-bold text-white md:text-3xl'
						aria-label='logo'>
						Todo
					</Link>
					<>
						{token ? (
							<div className='flex gap-4 items-center'>
								<Bar />
							</div>
						) : (
							<div className='flex gap-4 items-center'>
								<Button asChild>
									<Link href='/login'>Login</Link>
								</Button>
								<Button variant='outline' asChild>
									<Link href='/sign-up'>Signup</Link>
								</Button>
							</div>
						)}
					</>
				</header>
			</div>
		</div>
	);
};

export default Navbar;
