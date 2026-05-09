interface DoorProps {
  index: number;
  type: 'car' | 'goat';
  isOpen: boolean;
  isSelected: boolean;
  isHostOpened: boolean;
  onClick: () => void;
  disabled: boolean;
  isGameRevealed: boolean;
  size?: 'normal' | 'small';
}

export default function Door({
  index,
  type,
  isOpen,
  isSelected,
  isHostOpened,
  onClick,
  disabled,
  isGameRevealed,
  size = 'normal'
}: DoorProps) {
  const isWinningDoor = isGameRevealed && isSelected && type === 'car';
  const isLosingDoor = isGameRevealed && isSelected && type === 'goat';

  const dimensions = size === 'small' ? 'w-16 h-24' : 'w-32 h-48 md:w-36 md:h-52';
  const fontSize = size === 'small' ? 'text-3xl' : 'text-6xl';
  const numberSize = size === 'small' ? 'text-xl' : 'text-5xl';
  const ringSize = size === 'small' ? 'ring-2' : 'ring-4';
  const winningRingSize = size === 'small' ? 'ring-4' : 'ring-8';

  return (
    <div
      className={`relative ${dimensions} perspective-1000 cursor-pointer transition-transform duration-200 
        ${!disabled ? 'hover:scale-105' : ''} 
        ${isSelected ? `${ringSize} ring-yellow-400 rounded-sm` : ''}
        ${isWinningDoor ? `${winningRingSize} ring-green-500 rounded-sm animate-bounce` : ''}
        ${isLosingDoor ? `${winningRingSize} ring-red-500 rounded-sm` : ''}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="relative w-full h-full bg-slate-800 border-x-2 border-t-2 md:border-x-4 md:border-t-4 border-amber-900 overflow-hidden">
        {/* Content behind the door */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-slate-200 ${fontSize} transition-opacity duration-300 ${(isOpen || isHostOpened) ? 'opacity-100' : 'opacity-0'}`}>
          <span>{type === 'car' ? '🚗' : '🐐'}</span>
          {isWinningDoor && size !== 'small' && <span className="text-xl font-bold text-green-600 mt-2 uppercase">Winner!</span>}
          {isLosingDoor && size !== 'small' && <span className="text-xl font-bold text-red-600 mt-2 uppercase">Oops!</span>}
        </div>

        {/* The Door Leaf */}
        <div 
          className={`absolute inset-0 bg-amber-700 border border-amber-900 flex flex-col items-center justify-center transition-transform duration-700 origin-left z-10
            ${isOpen || isHostOpened ? 'rotate-y-n110 shadow-2xl' : ''}
          `}
        >
          <div className={`${numberSize} font-bold text-white drop-shadow-lg`}>{index + 1}</div>
          <div className={`absolute right-1 md:right-4 top-1/2 ${size === 'small' ? 'w-2 h-2' : 'w-4 h-4'} bg-yellow-400 rounded-full shadow-inner border border-amber-900`}></div>
        </div>
      </div>
    </div>
  );
}
