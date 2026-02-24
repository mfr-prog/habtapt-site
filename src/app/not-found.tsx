import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 50%, #3d5a6f 100%)",
      }}
    >
      <h1
        className="text-8xl font-black mb-4"
        style={{ color: "#B8956A" }}
      >
        404
      </h1>
      <h2
        className="text-2xl font-bold mb-2"
        style={{ color: "#ffffff" }}
      >
        Pagina nao encontrada
      </h2>
      <p
        className="mb-8 text-center max-w-md"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        A pagina que procura nao existe ou foi movida. Verifique o endereco ou
        volte a pagina inicial.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #B8956A 0%, #C9A872 100%)",
          color: "#ffffff",
          boxShadow: "0 10px 40px rgba(184,149,106,0.3)",
        }}
      >
        Voltar ao inicio
      </Link>
    </div>
  );
}
