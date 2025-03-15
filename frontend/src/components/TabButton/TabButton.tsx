export type TabButtonProps = {
  variant?: 'default' | 'active';
  children: React.ReactNode;
  onClick?: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
  children,
  onClick,
  variant = 'default',
}) => {
  return (
    <button
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
        variant === 'active'
          ? 'bg-gray-900 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TabButton;
