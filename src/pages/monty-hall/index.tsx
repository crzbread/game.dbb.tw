'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Door from '@/components/Door';
import Stats from '@/components/Stats';

type GameState = 'idle' | 'selected' | 'revealed';
type DoorType = 'car' | 'goat';

export default function GamePage() {
  const [doorCount, setDoorCount] = useState(3);
  const [doors, setDoors] = useState<DoorType[]>(['goat', 'goat', 'goat']);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [hostOpenedDoors, setHostOpenedDoors] = useState<number[]>([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [message, setMessage] = useState('請選擇一扇門！');
  const [simCount, setSimCount] = useState(10);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);
  const [isSkipAnimation, setIsSkipAnimation] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, isFastMode ? ms / 4 : ms));

  useEffect(() => {
    const savedStats = localStorage.getItem('monty-hall-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    initGame();
  }, [doorCount]);

  const clearStats = () => {
    if (confirm('確定要清除所有勝負紀錄嗎？')) {
      const emptyStats = { wins: 0, losses: 0 };
      setStats(emptyStats);
      localStorage.removeItem('monty-hall-stats');
      initGame();
    }
  };

  const initGame = useCallback(() => {
    const newDoors: DoorType[] = Array(doorCount).fill('goat');
    const carIndex = Math.floor(Math.random() * doorCount);
    newDoors[carIndex] = 'car';
    
    setDoors(newDoors);
    setGameState('idle');
    setSelectedDoor(null);
    setHostOpenedDoors([]);
    setMessage(`請從 ${doorCount} 扇門中選擇一扇！`);
  }, [doorCount]);

  const handleDoorClick = (index: number) => {
    if (gameState === 'idle') {
      setSelectedDoor(index);
      setGameState('selected');
      
      const carIndex = doors.indexOf('car');
      const allIndices = Array.from({ length: doorCount }, (_, i) => i);
      
      const possibleHostDoors = allIndices.filter(
        i => i !== index && i !== carIndex
      );

      let doorsToOpen: number[] = [];
      if (index === carIndex) {
        const shuffledGoats = possibleHostDoors.sort(() => Math.random() - 0.5);
        doorsToOpen = shuffledGoats.slice(0, doorCount - 2);
      } else {
        doorsToOpen = possibleHostDoors;
      }

      setHostOpenedDoors(doorsToOpen);
      setMessage(`主持人打開了 ${doorsToOpen.length} 扇門，裡面全是山羊！你要更換選擇嗎？`);
    }
  };

  const handleChoice = (switchDoor: boolean) => {
    let finalSelection = selectedDoor!;
    
    if (switchDoor) {
      finalSelection = Array.from({ length: doorCount }, (_, i) => i).find(
        i => i !== selectedDoor && !hostOpenedDoors.includes(i)
      )!;
      setSelectedDoor(finalSelection);
    }

    setGameState('revealed');
    const isWin = doors[finalSelection] === 'car';
    
    setStats(prev => {
      const newStats = {
        wins: prev.wins + (isWin ? 1 : 0),
        losses: prev.losses + (isWin ? 0 : 1)
      };
      localStorage.setItem('monty-hall-stats', JSON.stringify(newStats));
      return newStats;
    });
    
    setMessage(isWin ? '恭喜你！你贏得了一輛汽車！🚗' : '真可惜，這是一隻山羊。🐐');
  };

  const runSimulation = async (shouldSwitch: boolean) => {
    setIsSimulating(true);
    const maxLimit = isSkipAnimation ? 10000 : 50;
    const iterations = Math.min(simCount, maxLimit);
    const strategyName = shouldSwitch ? '更換' : '不換';

    if (isSkipAnimation) {
      setMessage(`正在即時模擬 ${doorCount} 門 ${strategyName}策略 ${iterations} 次...`);
      let localWins = 0;
      let localLosses = 0;

      await sleep(100);

      for (let i = 0; i < iterations; i++) {
        const carIndex = Math.floor(Math.random() * doorCount);
        const playerChoice = Math.floor(Math.random() * doorCount);
        
        let finalSelection = playerChoice;
        if (shouldSwitch) {
          if (playerChoice !== carIndex) {
            finalSelection = carIndex;
          } else {
            const allIndices = Array.from({ length: doorCount }, (_, idx) => idx);
            const otherGoat = allIndices.find(idx => idx !== playerChoice && idx !== carIndex)!;
            finalSelection = otherGoat;
          }
        }

        if (finalSelection === carIndex) {
          localWins++;
        } else {
          localLosses++;
        }
      }

      setStats(prev => {
        const updated = {
          wins: prev.wins + localWins,
          losses: prev.losses + localLosses
        };
        localStorage.setItem('monty-hall-stats', JSON.stringify(updated));
        return updated;
      });
      
      setMessage(`模擬結束！${doorCount} 門 ${strategyName}策略完成 ${iterations} 次。贏: ${localWins}, 輸: ${localLosses}`);
    } else {
      for (let i = 0; i < iterations; i++) {
        setMessage(`模擬${strategyName}中... 第 ${i + 1} / ${iterations} 次`);
        
        const newDoors: DoorType[] = Array(doorCount).fill('goat');
        const carIdx = Math.floor(Math.random() * doorCount);
        newDoors[carIdx] = 'car';
        setDoors(newDoors);
        setGameState('idle');
        setSelectedDoor(null);
        setHostOpenedDoors([]);
        
        await sleep(isFastMode ? 100 : 300);

        const playerChoice = Math.floor(Math.random() * doorCount);
        setSelectedDoor(playerChoice);
        setGameState('selected');

        const allIndices = Array.from({ length: doorCount }, (_, idx) => idx);
        const possibleHostDoors = allIndices.filter(idx => idx !== playerChoice && idx !== carIdx);
        
        let doorsToOpen: number[] = [];
        if (playerChoice === carIdx) {
          const shuffledGoats = possibleHostDoors.sort(() => Math.random() - 0.5);
          doorsToOpen = shuffledGoats.slice(0, doorCount - 2);
        } else {
          doorsToOpen = possibleHostDoors;
        }
        
        setHostOpenedDoors(doorsToOpen);
        
        await sleep(isFastMode ? 200 : 500);

        let finalSelection = playerChoice;
        if (shouldSwitch) {
          finalSelection = allIndices.find(
            idx => idx !== playerChoice && !doorsToOpen.includes(idx)
          )!;
          setSelectedDoor(finalSelection);
        }
        
        await sleep(isFastMode ? 100 : 300);

        setGameState('revealed');
        const isWin = newDoors[finalSelection] === 'car';
        
        setStats(prev => {
          const updated = {
            wins: prev.wins + (isWin ? 1 : 0),
            losses: prev.losses + (isWin ? 0 : 1)
          };
          localStorage.setItem('monty-hall-stats', JSON.stringify(updated));
          return updated;
        });

        await sleep(isFastMode ? 300 : 800);
      }
      setMessage(`模擬結束！${doorCount} 門 ${strategyName}策略共完成 ${iterations} 次。`);
    }

    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <header className="flex items-center mb-8 max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 font-bold mr-8 hover:underline text-lg">← 返回首頁</Link>
        <h1 className="text-3xl font-extrabold text-slate-900">三門問題實驗室</h1>
      </header>

      <main className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center overflow-hidden">
          <div className="text-xl font-semibold mb-6 text-center min-h-[3rem] flex items-center justify-center text-slate-800 w-full">
            <p className="bg-slate-50 px-6 py-2 rounded-full border border-slate-100 shadow-sm w-full max-w-3xl truncate">
              {message}
            </p>
          </div>

          <div 
            className={`grid gap-2 mb-8 w-full max-h-[60vh] overflow-y-auto p-4 justify-items-center
              ${doorCount <= 5 ? 'grid-cols-3 md:grid-cols-5' : 
                doorCount <= 20 ? 'grid-cols-5 md:grid-cols-10' : 
                'grid-cols-5 md:grid-cols-10 lg:grid-cols-10'}
            `}
          >
            {doors.map((type, i) => (
              <Door
                key={i}
                index={i}
                type={type}
                isOpen={gameState === 'revealed'}
                isSelected={selectedDoor === i}
                isHostOpened={hostOpenedDoors.includes(i)}
                onClick={() => handleDoorClick(i)}
                disabled={gameState !== 'idle' || isSimulating}
                isGameRevealed={gameState === 'revealed'}
                size={doorCount > 20 ? 'small' : 'normal'}
              />
            ))}
          </div>

          <div className="h-16 flex items-center justify-center">
            {gameState === 'selected' && !isSimulating && (
              <div className="flex gap-4">
                <button 
                  onClick={() => handleChoice(true)} 
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                  更換選擇
                </button>
                <button 
                  onClick={() => handleChoice(false)} 
                  className="bg-slate-200 text-slate-800 px-8 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all shadow-md"
                >
                  不更換
                </button>
              </div>
            )}
            
            {gameState === 'revealed' && !isSimulating && (
              <button 
                onClick={initGame} 
                className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md"
              >
                重新開始
              </button>
            )}
          </div>
        </div>

        <aside className="w-full xl:w-80 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="mt-0 mb-4 border-b-2 border-slate-100 pb-2 text-lg font-bold text-slate-800">遊戲設定</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-slate-500 font-semibold">門的數量: {doorCount}</label>
              </div>
              <input 
                type="range" 
                min="3" 
                max="100" 
                value={doorCount} 
                onChange={(e) => setDoorCount(parseInt(e.target.value))}
                disabled={gameState !== 'idle' || isSimulating}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400 mt-1">增加門的數量能讓你更清楚感受到「換門」的優勢。</p>
            </div>
          </div>

          <Stats wins={stats.wins} losses={stats.losses} />
          
          <button 
            onClick={clearStats} 
            className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-md"
          >
            清除紀錄
          </button>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="mt-0 mb-4 border-b-2 border-slate-100 pb-2 text-lg font-bold text-slate-800">自動模擬</h3>
            
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-sm font-bold text-slate-700">加速模式</span>
                <button 
                  onClick={() => setIsFastMode(!isFastMode)}
                  disabled={isSkipAnimation}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isFastMode && !isSkipAnimation ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFastMode && !isSkipAnimation ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">跳過動畫</span>
                  <span className="text-[10px] text-slate-400">解鎖上限至 10,000 次</span>
                </div>
                <button 
                  onClick={() => setIsSkipAnimation(!isSkipAnimation)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isSkipAnimation ? 'bg-blue-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSkipAnimation ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="text-sm text-slate-500 font-semibold">次數 (最多{isSkipAnimation ? '10,000' : '50'}):</label>
              <input 
                type="number" 
                min="1" 
                max={isSkipAnimation ? 10000 : 50} 
                value={simCount} 
                onChange={(e) => setSimCount(parseInt(e.target.value) || 0)}
                disabled={gameState !== 'idle' || isSimulating}
                className="w-full p-2 border border-slate-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => runSimulation(true)} 
                disabled={gameState !== 'idle' || isSimulating || simCount <= 0}
                className="py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-purple-200 transition-all shadow-md"
              >
                模擬換門
              </button>
              <button 
                onClick={() => runSimulation(false)} 
                disabled={gameState !== 'idle' || isSimulating || simCount <= 0}
                className="py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-indigo-200 transition-all shadow-md"
              >
                模擬不換
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
