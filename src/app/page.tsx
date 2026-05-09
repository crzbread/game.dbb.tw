import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 font-sans">
      <main className="text-center max-w-2xl bg-white p-12 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
          三門問題遊戲 <span className="text-blue-600 block sm:inline">(Monty Hall)</span>
        </h1>
        <p className="text-xl leading-relaxed mb-10 text-slate-600">
          這是一個經典的機率遊戲。你有三扇門，其中一扇門後是一輛汽車，另外兩扇門後是山羊。
          選中汽車就能帶回家！
        </p>
        <Link 
          href="/game" 
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl text-xl font-bold transition-all hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 shadow-lg"
        >
          開始挑戰
        </Link>
      </main>
    </div>
  );
}
