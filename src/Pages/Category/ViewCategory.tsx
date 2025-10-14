import { useParams, useNavigate } from "react-router";
import "./ViewCategory.css";
import { useEffect, useState } from "react";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faTag,
  faTrash,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { LabeledInput } from "../../Components/LabeledInput/LabeledInput";
import { categoryIcons } from "../../categoryIcons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { Modal } from "../../Components/Modal/Modal";
export const ViewCategory = () => {
  const [category, setCategory] = useState<Category | undefined>();
  const [editing, setEditing] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedWords, setEditedWords] = useState<string[]>([]);
  const [validName, setValidName] = useState(false);
  const [validWord, setValidWord] = useState(false);
  const [newIconName, setNewIconName] = useState<string | undefined>();
  const [selectedNewIconName, setSelectedNewIconName] = useState<
    string | undefined
  >();
  const [showIconChoice, setShowIconChoice] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const startEditing = () => {
    if (!category) return;
    setEditedName(category.name);
    setEditedWords(category.words);
    setNewWord("");
    setEditing(true);
  };
  const saveEdit = () => {
    if (!category) return;
    const updatedCategory: Category = {
      ...category,
      name: editedName,
      words: editedWords.sort((a, b) => a.localeCompare(b)),
      iconName: newIconName ?? category.iconName,
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
  useEffect(() => {
    setValidName(editedName.trim().length > 0);
    setValidWord(
      newWord.trim().length > 0 &&
        editedWords.filter((savedWord) => savedWord === newWord).length === 0,
    );
  }, [editedWords, newWord, editedName]);
  const buttons = editing
    ? {
        primary: {
          name: "Salvar alterações",
          disabled: !validName,
          submit: true,
          formID: "edit-category",
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
  const showIcon = (iconName?: string): IconDefinition => {
    console.log(faTag.iconName);
    if (!iconName) return faTag;
    const icon = categoryIcons[iconName]?.icon;
    return icon ? icon : faQuestion;
  };
  const openIconEditModal = () => {
    if (!category) return;
    setSelectedNewIconName(newIconName ?? category.iconName);
    setShowIconChoice(true);
  };
  return (
    <div className="view-category">
      <PageHeader
        title={`${editing ? "Editando " : ""}Categoria`}
        buttons={buttons}
        subMenu={subMenu}
      />

      {!!category && (
        <>
          {editing ? (
            <>
              <form
                id="edit-category"
                className="view-category__content"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
              >
                <div className="view-category__edit-header">
                  <button
                    id="edit-icon-button"
                    className="view-category__edit-icon-button"
                    type="button"
                    aria-label="Mudar Ícone"
                    onClick={() => {
                      openIconEditModal();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showIcon(newIconName ?? category.iconName)}
                    />
                  </button>
                  <LabeledInput
                    name="Nome"
                    className="view-category__edit-name"
                    placeholder={category.name}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div className="view-category__words">
                  <div>
                    <LabeledInput
                      name="Nova Palavra"
                      button={{
                        type: "submit",
                        icon: faPlus,
                        label: "Adicionar palavra",
                        disabled: !validWord,
                      }}
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addWord();
                        }
                      }}
                    />
                  </div>
                  <ul className="view-category__word-list">
                    {editedWords.map((word) => {
                      return (
                        <li
                          key={word}
                          className="view-category__word-container"
                        >
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
              </form>
              <Modal
                title="Escolha um ícone"
                visible={showIconChoice}
                onClose={() => {
                  setSelectedNewIconName(undefined);
                  setShowIconChoice(false);
                }}
              >
                <form
                  className="view-category__icon-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewIconName(selectedNewIconName);
                    setShowIconChoice(false);
                  }}
                >
                  <div className="view-category__icon-choice">
                    {Object.values(categoryIcons).map((categoryIcon) => {
                      return (
                        <label
                          key={categoryIcon.icon.iconName}
                          aria-label={categoryIcon.displayName}
                          className="view-category__icon-label"
                        >
                          <input
                            className="view-category__icon-radio"
                            type="radio"
                            name="category-icon-option"
                            value={categoryIcon.icon.iconName}
                            checked={
                              selectedNewIconName === categoryIcon.icon.iconName
                            }
                            onChange={(e) => {
                              setSelectedNewIconName(e.target.value);
                            }}
                          />
                          <FontAwesomeIcon icon={categoryIcon.icon} />
                        </label>
                      );
                    })}
                  </div>
                  <button
                    type="submit"
                    className="view-category__button view-category__button--primary"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    className="view-category__button view-category__button--secondary"
                    onClick={() => {
                      setShowIconChoice(false);
                    }}
                  >
                    Cancelar
                  </button>
                </form>
              </Modal>
            </>
          ) : (
            <div className="view-category__content">
              <div className="view-category__header">
                <div className="view-category__icon">
                  <FontAwesomeIcon icon={showIcon(category.iconName)} />
                </div>
                <h2 className="view-category__name">{category.name}</h2>
              </div>
              <span className="view-category__information-text">
                <FontAwesomeIcon icon={faCircleInfo} /> O nome da categoria é
                considerado como uma das palavras para a detecção automática de
                categoria
              </span>
              <div className="view-category__words">
                {category.words.length > 0 ? (
                  <>
                    <h2 className="view-category__subtitle">Palavras</h2>

                    <ul className="view-category__word-list">
                      {category.words.map((word) => {
                        return (
                          <li
                            key={word}
                            className="view-category__word-container"
                          >
                            <div className="view-category__word">{word}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <>
                    <h2 className="view-category__subtitle">Palavras</h2>

                    <span className="view-category__information-text">
                      <FontAwesomeIcon icon={faCircleInfo} /> Não há palavras
                      nessa categoria
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
