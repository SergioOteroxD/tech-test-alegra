import { useQuery } from '@tanstack/react-query';
import { Recipe } from '../models/recipe';
import { API } from '../config';
import { RecipeCard } from '../components/RecipeCard';

const recipesFetcher = async () => {
  const response = await fetch(API.RECIPES_GET_ALL);
  const result = await response.json();
  return result?.data;
};

export default function Recipes() {
  const { data } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: recipesFetcher,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Recetas
          </h3>
          <p className="text-sm text-gray-500">
            Aquí puedes ver las recetas de los platifcos detalladamente
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-start gap-4 w-full">
            {!!data &&
              data.map((recipe) => (
                <RecipeCard key={`recipe-${recipe.id}`} recipe={recipe} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
