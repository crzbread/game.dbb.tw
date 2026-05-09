interface StatsProps {
  wins: number;
  losses: number;
}

export default function Stats({ wins, losses }: StatsProps) {
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md min-w-[150px]">
      <h3 className="mt-0 mb-4 border-b-2 border-slate-100 pb-2 text-lg font-bold text-slate-800">勝負紀錄</h3>
      <div className="flex justify-between mb-2 text-lg text-slate-600">
        <span>勝利:</span>
        <span className="text-green-600 font-bold">{wins}</span>
      </div>
      <div className="flex justify-between mb-2 text-lg text-slate-600">
        <span>失敗:</span>
        <span className="text-red-500 font-bold">{losses}</span>
      </div>
      <div className="flex justify-between text-lg text-slate-600">
        <span>勝率:</span>
        <span className="font-semibold">{winRate}%</span>
      </div>
    </div>
  );
}
