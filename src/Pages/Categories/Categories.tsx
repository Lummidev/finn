import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Categories.css";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useNavigate } from "react-router";

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    CategoryRepository.getAll()
      .then((categories) => {
        setCategories(categories);
      })
      .catch((e) => {
        throw e;
      });
  }, []);
  return (
    <div className="categories">
      <PageHeader
        title="Categorias"
        buttons={{
          secondary: {
            name: "Nova Categoria",
            onAction: () => {
              navigate("/categories/new");
            },
          },
        }}
      />

      <ul className="categories__list">
        {categories.map((category) => {
          return (
            <li className="categories__list-item" key={category.id}>
              <div className="categories__grip">
                <FontAwesomeIcon icon={faGripVertical} />
              </div>
              <Link
                className="categories__link"
                to={`/categories/${category.id}`}
              >
                {category.name}
                {category.words.length > 0 && (
                  <span className="categories__link-words">
                    {`(${category.words.join(", ")})`}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
