interface DoorProps {
  index: number;
  type: 'car' | 'goat';
  isOpen: boolean;
  isSelected: boolean;
  isHostOpened: boolean;
  onClick: () => void;
  disabled: boolean;
  isGameRevealed: boolean;
}

export default function Door({
  index,
  type,
  isOpen,
  isSelected,
  isHostOpened,
  onClick,
  disabled,
  isGameRevealed
}: DoorProps) {
  const isWinningDoor = isGameRevealed && isSelected && type === 'car';
  const isLosingDoor = isGameRevealed && isSelected && type === 'goat';

  return (
    <div
      className={`relative w-36 h-52 perspective-1000 cursor-pointer transition-transform duration-200 
        ${!disabled ? 'hover:scale-105' : ''} 
        ${isSelected ? 'ring-4 ring-yellow-400 rounded-sm' : ''}
        ${isWinningDoor ? 'ring-8 ring-green-500 rounded-sm animate-bounce' : ''}
        ${isLosingDoor ? 'ring-8 ring-red-500 rounded-sm' : ''}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="relative w-full h-full bg-slate-800 border-x-4 border-t-4 border-amber-900 overflow-hidden">
        {/* Content behind the door */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-slate-200 text-6xl transition-opacity duration-300 ${(isOpen || isHostOpened) ? 'opacity-100' : 'opacity-0'}`}>
          <span>{type === 'car' ? '🚗' : '🐐'}</span>
          {isWinningDoor && <span className="text-xl font-bold text-green-600 mt-2 uppercase">Winner!</span>}
          {isLosingDoor && <span className="text-xl font-bold text-red-600 mt-2 uppercase">Oops!</span>}
        </div>

        {/* The Door Leaf */}
        <div 
          className={`absolute inset-0 bg-amber-700 border-2 border-amber-900 flex flex-col items-center justify-center transition-transform duration-700 origin-left z-10
            ${isOpen || isHostOpened ? 'rotate-y-n110 shadow-2xl' : ''}
          `}
        >
          <div className="text-5xl font-bold text-white drop-shadow-lg">{index + 1}</div>
          <div className="absolute right-4 top-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-inner border border-amber-900"></div>
        </div>
      </div>
    </div>
  );
}
