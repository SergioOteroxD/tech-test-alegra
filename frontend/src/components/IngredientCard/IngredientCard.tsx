import { Ingredient } from '../../models/ingredient';
type CircularProgressProps = {
  size: number;
  value: number;
  max: number;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  max,
  size,
  value,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Calculate stroke dash values
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on stock level
  let color = 'text-emerald-500';
  if (percentage <= 25) {
    color = 'text-rose-500';
  } else if (percentage <= 50) {
    color = 'text-amber-500';
  }

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-xs text-gray-500">/ {max}</span>
      </div>
    </div>
  );
};

export type IngredientCardProps = {
  ingredient: Ingredient;
};

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  return (
    <div className="max-w-60 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium capitalize">
            {ingredient.ingredient.name}
          </h3>
        </div>
        <CircularProgress value={ingredient.quantity} max={6} size={80} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-sm text-gray-500">Stock:</span>
          <span
            className={`font-medium ${
              ingredient.quantity <= 1
                ? 'text-rose-500'
                : ingredient.quantity <= 3
                ? 'text-amber-500'
                : 'text-emerald-500'
            }`}
          >
            {ingredient.quantity === 0
              ? 'Sin stock'
              : ingredient.quantity <= 2
              ? 'Stock bajo'
              : ingredient.quantity >= 6
              ? 'Stock completo'
              : `${ingredient.quantity} unidades`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
