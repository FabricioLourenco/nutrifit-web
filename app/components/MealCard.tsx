import { XCardHome } from "./card-home";
import { XButtonHome } from "./button-home";

interface MealCardProps {
  title: string;
  tag: string;
  difficulty: string;
  info: string;
  image: string;
}

export function MealCard({ title, tag, difficulty, info, image }: MealCardProps) {
  return (
    <XCardHome className="flex flex-col md:flex-row items-center p-2">
      <img
        src={image}
        alt={title}
        className="w-full md:w-1/4 h-32 object-cover rounded-md"
      />
      <div className="flex-1 w-full mt-2 md:mt-0 md:ml-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">
              {tag} · {difficulty} · {info}
            </p>
          </div>
          <div className="mt-2 md:mt-0 md:text-right">
            
          </div>
        </div>
      </div>
    </XCardHome>
  );
}
