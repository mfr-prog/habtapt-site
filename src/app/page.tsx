\"use client\";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<null | "ok" | "error">(null);
	const [message, setMessage] = useState<string>("");

	async function subscribe(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		setMessage("");
		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			// Avoid JSON parse on non-OK responses to prevent SyntaxError
			const isJson = res.headers.get("content-type")?.includes("application/json");
			const payload = isJson ? await res.json() : null;
			if (!res.ok) {
				setStatus("error");
				setMessage(payload?.error ?? "Falha ao assinar.");
				return;
			}
			setStatus("ok");
			setMessage("Inscrição realizada!");
			setEmail("");
		} catch {
			setStatus("error");
			setMessage("Erro de rede.");
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={100}
					height={20}
					priority
				/>
				<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						Newsletter demo
					</h1>
					<form onSubmit={subscribe} className="flex gap-2">
						<input
							type="email"
							required
							className="rounded border px-3 py-2 text-black"
							placeholder="seu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button
							type="submit"
							className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
						>
							Assinar
						</button>
					</form>
					{status === "ok" && <p className="text-green-600">{message}</p>}
					{status === "error" && <p className="text-red-600">{message}</p>}
				</div>
			</main>
		</div>
	);
}
