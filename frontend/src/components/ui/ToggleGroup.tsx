interface ToggleGroupProps {
  options: string[];
  selectedIndex: number;
  onSelectionChange: (index: number, option: string) => void;
  className?: string;
}

const ToggleGroup = ({
  options,
  selectedIndex,
  onSelectionChange,
  className = '',
}: ToggleGroupProps) => {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectionChange(index, option)}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            selectedIndex === index
              ? 'bg-white text-gray-900 rounded-md shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export { ToggleGroup };
