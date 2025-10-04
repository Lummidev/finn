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
export const ViewCategory = () => {
  const [category, setCategory] = useState<Category | undefined>();
  const [editingName, setEditingName] = useState(false);
  const [addingWord, setAddingWord] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [editedName, setEditedName] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const startEdit = () => {
    if (!category) return;
    setEditedName(category.name);
    setEditingName(true);
  };
  const saveEdit = () => {
    if (!category) return;
    const updatedCategory = { ...category, name: editedName };
    CategoryRepository.update(updatedCategory)
      .then(() => {
        setCategory(updatedCategory);
        setEditingName(false);
      })
      .catch((e) => {
        throw e;
      });
  };
  const removeWord = (removedWord: string) => {
    if (!category) return;
    const updatedWords = category.words.filter((word) => word !== removedWord);
    const updatedCategory = { ...category, words: updatedWords };
    CategoryRepository.update(updatedCategory)
      .then(() => {
        setCategory(updatedCategory);
        setEditingName(false);
      })
      .catch((e) => {
        throw e;
      });
  };
  const saveWord = (savedWord: string) => {
    if (!category) return;
    const updatedWords = [savedWord, ...category.words];
    const updatedCategory = { ...category, words: updatedWords };
    CategoryRepository.update(updatedCategory)
      .then(() => {
        setCategory(updatedCategory);
        setAddingWord(false);
      })
      .catch((e) => {
        throw e;
      });
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
  return (
    <div className="view-category">
      <h1>Categoria</h1>
      {!category ? (
        <></>
      ) : (
        <div className="view-category__content">
          <div className="view-category__header">
            {editingName ? (
              <form className="view-category__name-form">
                <button
                  onClick={() => {
                    setEditingName(false);
                  }}
                  className="view-category__save-name-button"
                  type="button"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="view-category__name-form-fields">
                  <input
                    className="view-category__name-input"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      saveEdit();
                    }}
                    className="view-category__save-name-button"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="view-category__name-container">
                <h2 className="view-category__name">{category.name}</h2>
                <button
                  type="button"
                  onClick={() => startEdit()}
                  className="view-category__edit-name-button"
                >
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              </div>
            )}

            <button
              type="button"
              className="view-category__delete-category-button"
              onClick={removeCategory}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <span className="view-category__information-text">
            <FontAwesomeIcon icon={faCircleInfo} /> O nome da categoria é
            considerado como uma das palavras para a deteccção automática de
            categoria
          </span>
          <div className="view-category__words">
            <div className="view-category__words-header">
              <h2 className="view-category__subtitle">Palavras</h2>
              {addingWord ? (
                <div className="view-category__save-words">
                  <input
                    className="view-category__save-words-input"
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                  />
                  <button
                    onClick={() => saveWord(newWord)}
                    className="view-category__save-words-button"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingWord(true)}
                  className="view-category__add-words-button"
                  type="button"
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                </button>
              )}
            </div>
            <ul className="view-category__word-list">
              {category.words.map((word) => {
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
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
