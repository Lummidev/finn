import { useState } from "react";
import "./CategoryForm.css";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { Category } from "../../Entities/Category";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
export const CategoryForm = () => {
  const [name, setName] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const navigate = useNavigate();
  const submit = () => {
    CategoryRepository.insert(new Category(name, words))
      .then(() => {
        navigate("/categories");
      })
      .catch((e) => {
        throw e;
      });
  };
  const addWord = () => {
    const word = newWord.trim();
    if (word.length === 0) return;
    setWords([...words, word]);
    setNewWord("");
  };
  const removeWord = (word: string) => {
    const filteredWords = words.filter((savedWord) => savedWord !== word);
    setWords(filteredWords);
  };
  return (
    <div className="category-form">
      <h1>Nova Categoria</h1>
      <div className="category-form__form">
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
        <form
          className="category-form__labeled-input"
          onSubmit={(e) => {
            addWord();
            e.preventDefault();
          }}
        >
          <label className="category-form__label" htmlFor="category-words">
            Palavras extras
          </label>
          <div className="category-form__word-list">
            {words.map((word) => (
              <button
                key={word}
                onClick={() => removeWord(word)}
                type="button"
                className="category-form__word"
              >
                <span>{word}</span>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            ))}
          </div>
          <div className="category-form__extra-words">
            <input
              id="category-words"
              type="text"
              placeholder="paracetamol"
              className="category-form__words-input"
              enterKeyHint="enter"
              value={newWord}
              onChange={(e) => {
                setNewWord(e.target.value);
              }}
            />
            <button
              className="category-form__add-words-button"
              aria-label="Adicionar"
              type="submit"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </form>

        <button
          onClick={() => {
            submit();
          }}
          type="button"
          className="category-form__button"
        >
          Salvar Categoria
        </button>
      </div>
    </div>
  );
};
