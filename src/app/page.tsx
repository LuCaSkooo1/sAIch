"use client";

import Logo from "@/components/logo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
	const router = useRouter();
	const [visible, setVisible] = useState(true);

	const hideInfo = () => {
		setVisible(false);
	};

	return (
		<div className="min-h-screen text-center">
			{visible && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
					<div className="info-card relative p-6 bg-white rounded shadow-lg max-w-md w-full text-center">
						<p className="info-heading text-xl font-bold mb-2">
							Upozornenie!
						</p>
						<p className="info-para mb-4">
							Ospravedlňujeme sa, ale servery sú offline.
							Nezúfajte! Trénovať môžete aj v offline móde.
						</p>
						<button
							className="exit-button absolute top-2 right-2"
							onClick={hideInfo}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 162 162"
								className="svgIconCross w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeWidth="17"
									stroke="black"
									d="M9.01074 8.98926L153.021 153"
								/>
								<path
									strokeLinecap="round"
									strokeWidth="17"
									stroke="black"
									d="M9.01074 153L153.021 8.98926"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}
			<header className="py-10 items-center flex justify-center gap-16 ">
				<div className="w-28 md:w-32">
					<Link href="/" className="size-full">
						<Logo className="size-full" />
					</Link>
				</div>
			</header>

			<div className="justify-center items-center flex flex-row w-full h-full">
				<div className="flex flex-col xl:flex-row justify-center items-center gap-10">
					<div className="w-[70%] sm:w-1/3 md:w-1/2 max-w-[450px] aspect-square rounded">
						<Image
							width={500}
							height={500}
							className="size-full"
							src="/chessboard.png"
							alt="chessboard"
							priority
						/>
					</div>
					<div>
						<h1 className="text-center md:text-5xl xl:text-start text-4xl xl:text-7xl">
							Nauč sa hrať
							<br />
							šach
							<br />
							vďaka <span className="color">AI</span>
						</h1>
						<div className="flex flex-col items-center xl:items-start gap-5 mt-10">
							<button
								disabled
								type="button"
								className="w-[90%] primary h-20 text-lg md:text-2xl cursor-not-allowed"
								onClick={() => router.push("/login")}
							>
								Prihlásiť sa
							</button>
							<button
								disabled
								type="button"
								className="w-[90%] secondary h-20 text-lg md:text-2xl mb-5 px-5 cursor-not-allowed"
								onClick={() => router.push("/register")}
							>
								Zaregistrovať sa
							</button>
						</div>
					</div>
				</div>
			</div>
			<a href="chess/offline?level=easy">
				<p className="mt-10 text-xl underline mb-10">
					{" "}
					-{">"} Hrať offline
				</p>
			</a>
		</div>
	);
}
