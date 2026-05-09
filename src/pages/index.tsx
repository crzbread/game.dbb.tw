import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 font-sans">
      <main className="text-center max-w-2xl bg-white p-12 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-slate-900 tracking-tight">
          機率實驗室
        </h1>
        
        <div className="grid gap-6 max-w-md mx-auto w-full">
          <Link 
            href="/monty-hall" 
            className="flex flex-col items-center p-8 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm bg-white"
          >
            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 mb-4">三門問題 (Monty Hall)</h2>
            <p className="text-slate-600 text-center leading-relaxed">經典的機率問題：換門真的會提高勝率嗎？進入實驗室驗證你的直覺！</p>
            <div className="mt-6 bg-blue-600 text-white px-8 py-2 rounded-lg font-bold group-hover:bg-blue-700 transition-colors">
              進入遊戲
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
