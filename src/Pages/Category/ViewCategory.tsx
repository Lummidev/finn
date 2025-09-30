import { useParams } from "react-router";
import "./ViewCategory.css";
import { useEffect, useState } from "react";
import { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
export const ViewCategory = () => {
  const [category, setCategory] = useState<Category | undefined>();
  const params = useParams();
  useEffect(() => {
    if (!params.id) return;
    CategoryRepository.get(params.id)
      .then((category) => {
        setCategory(category);
      })
      .catch((e) => {
        throw e;
      });
  }, [params]);
  return (
    <div className="category">
      <h1>Categoria</h1>
      {!category ? (
        <></>
      ) : (
        <div className="category__info">
          <h2>{category.name}</h2>
          <div className="category__words">
            {JSON.stringify(category.words, null, " ")}
          </div>
          <div className="category__precedence">{category.precedence}</div>
        </div>
      )}
    </div>
  );
};
