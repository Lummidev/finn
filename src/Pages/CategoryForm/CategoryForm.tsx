import { useState } from "react";
import "./CategoryForm.css";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { Category } from "../../Entities/Category";
import { useNavigate } from "react-router";
export const CategoryForm = () => {
  const [name, setName] = useState("");
  const [words, setWords] = useState("");
  const navigate = useNavigate();
  const submit = () => {
    CategoryRepository.insert(new Category(name, words.split(",")))
      .then(() => {
        navigate("/categories");
      })
      .catch((e) => {
        throw e;
      });
  };
  return (
    <div className="category-form">
      <h1>Nova Categoria</h1>
      <form
        className="category-form__form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="category-form__labeled-input">
          <label className="category-form__label" htmlFor="category-name">
            Nome
          </label>
          <input
            className="category-form__input"
            placeholder="Farmácia"
            id="category-name"
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="category-form__labeled-input">
          <label className="category-form__label" htmlFor="category-words">
            Palavras extras (separadas por vírgula)
          </label>
          <input
            className="category-form__input"
            id="category-words"
            type="text"
            placeholder="paracetamol,remédio,pomada"
            onChange={(e) => {
              setWords(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="category-form__button">
          Salvar Categoria
        </button>
      </form>
    </div>
  );
};
