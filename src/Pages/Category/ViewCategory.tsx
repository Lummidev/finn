import { useParams, useNavigate } from "react-router";
import "./ViewCategory.css";
import { useEffect, useState } from "react";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFloppyDisk,
  faPencil,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
export const ViewCategory = () => {
  const [category, setCategory] = useState<Category | undefined>();
  const [editing, setEditing] = useState(false);
  const [addingWord, setAddingWord] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedWords, setEditedWords] = useState<string[]>([]);
  const params = useParams();
  const navigate = useNavigate();
  const startEditing = () => {
    if (!category) return;
    setEditedName(category.name);
    setEditedWords(category.words);
    setEditing(true);
  };
  const saveEdit = () => {
    if (!category) return;
    const updatedCategory = {
      ...category,
      name: editedName,
      words: editedWords,
    };
    CategoryRepository.update(updatedCategory)
      .then(() => {
        setCategory(updatedCategory);
        setEditing(false);
      })
      .catch((e) => {
        throw e;
      });
  };
  const addWord = () => {
    const updatedWords = [newWord, ...editedWords];
    setEditedWords(updatedWords);
    setNewWord("");
  };
  const removeWord = (removedWord: string) => {
    const updatedWords = editedWords.filter((word) => word !== removedWord);
    setEditedWords(updatedWords);
  };
  const removeCategory = () => {
    if (!category) return;
    CategoryRepository.remove(category.id)
      .then(() => {
        navigate("/categories");
      })
      .catch((e) => {
        throw e;
      });
  };
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
  const buttons = editing
    ? {
        primary: {
          name: "Salvar alterações",
          onAction: () => saveEdit(),
        },
        secondary: { name: "Cancelar", onAction: () => setEditing(false) },
      }
    : undefined;
  const subMenu = editing
    ? undefined
    : [
        {
          name: "Editar Categoria",
          onAction: () => {
            startEditing();
          },
          icon: faPencil,
        },
        {
          name: "Excluir Categoria",
          onAction: () => removeCategory(),
          icon: faTrash,
          destructive: true,
        },
      ];
  return (
    <div className="view-category">
      <PageHeader title="Categoria" buttons={buttons} subMenu={subMenu} />

      {!!category && (
        <div className="view-category__content">
          <div className="view-category__header">
            {editing ? (
              <div>
                <label htmlFor="name-input">Nome</label>
                <input
                  className="view-category__name-input"
                  type="text"
                  id="name-input"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
            ) : (
              <div className="view-category__name-container">
                <h2 className="view-category__name">{category.name}</h2>
              </div>
            )}
          </div>
          <span className="view-category__information-text">
            <FontAwesomeIcon icon={faCircleInfo} /> O nome da categoria é
            considerado como uma das palavras para a detecção automática de
            categoria
          </span>
          <div className="view-category__words">
            <h2 className="view-category__subtitle">Palavras</h2>
            {editing && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addWord();
                }}
              >
                <label htmlFor="words-input">Nova Palavra</label>
                <div className="view-category__save-words">
                  <input
                    className="view-category__save-words-input"
                    type="text"
                    id="words-input"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                  />
                  <button
                    className="view-category__save-words-button"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </form>
            )}
            <ul className="view-category__word-list">
              {editing
                ? editedWords.map((word) => {
                    return (
                      <li key={word} className="view-category__word-container">
                        <div className="view-category__word">{word}</div>
                        <button
                          className="view-category__remove-word-button"
                          type="button"
                          onClick={() => removeWord(word)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </li>
                    );
                  })
                : category.words.map((word) => {
                    return (
                      <li key={word} className="view-category__word-container">
                        <div className="view-category__word">{word}</div>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
