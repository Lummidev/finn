import { useParams, useNavigate } from "react-router";
import "./ViewCategory.css";
import { useEffect, useState } from "react";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { LabeledInput } from "../../Components/LabeledInput/LabeledInput";
export const ViewCategory = () => {
  const [category, setCategory] = useState<Category | undefined>();
  const [editing, setEditing] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedWords, setEditedWords] = useState<string[]>([]);
  const [validName, setValidName] = useState(false);
  const [validWord, setValidWord] = useState(false);
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
    const updatedCategory = {
      ...category,
      name: editedName,
      words: editedWords.sort((a, b) => a.localeCompare(b)),
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
          onAction: () => saveEdit(),
          disabled: !validName,
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
      <PageHeader
        title={`${editing ? "Editando " : ""}Categoria`}
        buttons={buttons}
        subMenu={subMenu}
      />

      {!!category && (
        <div className="view-category__content">
          {editing ? (
            <LabeledInput
              name="Nome"
              placeholder={category.name}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          ) : (
            <>
              <h2 className="view-category__name">{category.name}</h2>
              <span className="view-category__information-text">
                <FontAwesomeIcon icon={faCircleInfo} /> O nome da categoria é
                considerado como uma das palavras para a detecção automática de
                categoria
              </span>
            </>
          )}

          <div className="view-category__words">
            {editing && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addWord();
                }}
              >
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
                />
              </form>
            )}
            {editing ? (
              <ul className="view-category__word-list">
                {editedWords.map((word) => {
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
            ) : category.words.length > 0 ? (
              <>
                <h2 className="view-category__subtitle">Palavras</h2>

                <ul className="view-category__word-list">
                  {category.words.map((word) => {
                    return (
                      <li key={word} className="view-category__word-container">
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
                  <FontAwesomeIcon icon={faCircleInfo} /> Não há palavras nessa
                  categoria
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
