import { ChevronDown } from 'lucide-react';
import { Recipe } from '../../models/recipe';
import { useState } from 'react';

export type RecipeCardProps = {
  recipe: Recipe;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isDropwdownOpen, setDropwdownOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Recipe header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {recipe.name}
            </h3>
            <p className="text-xs text-gray-500">
              ID: {recipe.id} • Creado:{' '}
              {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setDropwdownOpen((prevState) => !prevState)}
          >
            <ChevronDown
              className={`h-5 w-5 transform transition-transform ${
                isDropwdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Recipe ingredients summary (always visible) */}
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">
            {recipe.recipeIngredients.length} ingredientes requeridos
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.recipeIngredients.map((ri) => (
            <span
              key={ri.ingredientId}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800"
            >
              {ri.ingredient.name}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed ingredients (expandable) */}
      <div className={`px-4 pb-4 ${isDropwdownOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Detalles de ingredientes:
          </h4>
          <div className="space-y-1">
            {recipe.recipeIngredients.map((ri) => (
              <div
                key={ri.ingredientId}
                className="flex justify-between text-sm"
              >
                <span className="capitalize text-gray-700">
                  {ri.ingredient.name}
                </span>
                <span className="text-gray-600 font-medium">
                  {ri.quantity} {ri.quantity > 1 ? 'unidades' : 'unidad'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
