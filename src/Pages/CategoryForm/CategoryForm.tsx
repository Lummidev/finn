import { useEffect, useState } from "react";
import "./CategoryForm.css";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { LabeledInput } from "../../Components/LabeledInput/LabeledInput";
export const CategoryForm = () => {
  const [name, setName] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [validName, setValidName] = useState(false);
  const [validWord, setValidWord] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setValidName(name.trim().length > 0);
    setValidWord(
      newWord.trim().length > 0 &&
        words.filter((savedWord) => savedWord === newWord).length === 0,
    );
  }, [name, newWord, words]);
  const submit = () => {
    CategoryRepository.insert({
      name: name.trim(),
      words: words.sort((a, b) => a.localeCompare(b)),
    })
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
      <PageHeader
        buttons={{
          primary: {
            name: "Salvar",
            onAction: submit,
            disabled: !validName,
          },
        }}
        title="Nova Categoria"
      />
      <div className="category-form__fields">
        <LabeledInput
          name="Nome"
          placeholder="Farmácia"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <form
          className="category-form__labeled-input"
          onSubmit={(e) => {
            e.preventDefault();
            if (validWord) addWord();
          }}
        >
          <LabeledInput
            name="Palavras Extras"
            placeholder="paracetamol"
            value={newWord}
            button={{
              icon: faPlus,
              type: "submit",
              label: "Adicionar Palavra",
              disabled: !validWord,
            }}
            onChange={(e) => {
              setNewWord(e.target.value);
            }}
          />
          {words.length > 0 && (
            <ul className="category-form__word-list">
              {words.map((word) => (
                <li className="category-form__word-container" key={word}>
                  <span className="category-form__word">{word}</span>
                  <button
                    onClick={() => removeWord(word)}
                    type="button"
                    className="category-form__remove-word-button"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
};
