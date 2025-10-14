import { useEffect, useState } from "react";
import "./ViewExpense.css";
import { useParams } from "react-router";
import {
  EntryRepository,
  type JoinedEntry,
} from "../../Database/EntryRepository";
import dayjs from "dayjs";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import {
  faChevronDown,
  faMoneyBill,
  faPencil,
  faQuestion,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LabeledInput } from "../../Components/LabeledInput/LabeledInput";
import type { Entry } from "../../Entities/Entry";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { Modal } from "../../Components/Modal/Modal";
import { getUniqueWords } from "../../util";
import { categoryIcons } from "../../categoryIcons";

export const ViewExpense = () => {
  const [entry, setEntry] = useState<JoinedEntry | undefined>();
  const [editing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedMoney, setEditedMoney] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryChoice, setShowCategoryChoice] = useState(false);
  const [showWordChoice, setShowWordChoice] = useState(false);
  const [targetCategory, setTargetCategory] = useState<Category | undefined>();
  const [selectedCategoryID, setSelectedCategoryID] = useState<
    string | undefined
  >();
  const [selectedNewWords, setSelectedNewWords] = useState<string[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.id) return;
    EntryRepository.get(params.id)
      .then((entry) => {
        setEntry(entry);
      })
      .catch((e) => {
        throw e;
      });
    CategoryRepository.getAll()
      .then((categories) => {
        setCategories(categories);
      })
      .catch((e) => {
        throw e;
      });
  }, [params]);
  const removeEntry = () => {
    if (!entry) {
      return;
    }
    EntryRepository.remove(entry.id)
      .then(() => {
        navigate("/expenses");
      })
      .catch((e) => {
        throw e;
      });
  };
  const startEdit = () => {
    if (!entry) return;
    setEditing(true);
    setEditedDescription(entry.description);
    setEditedMoney(
      entry.moneyExpent.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  };

  const validName = editedDescription.trim().length > 0;
  const validMoney =
    editedMoney.trim().length > 0 && !isNaN(Number(editedMoney.trim()));
  const editExpenseFormID = "edit-expense";
  const saveEdit = () => {
    if (!entry || !(validName && validMoney)) return;
    const newDescription = editedDescription.trim();
    const newMoneyExpent = Math.trunc(Number(editedMoney.trim()) * 100) / 100;
    const newEntry: Entry = {
      ...entry,
      description: newDescription,
      moneyExpent: newMoneyExpent,
    };
    EntryRepository.update(newEntry)
      .then(() => {
        setEntry(newEntry);
      })
      .catch((e) => {
        throw e;
      });
    setEditing(false);
  };
  const saveCategory = async () => {
    if (!entry || !selectedCategoryID) {
      return;
    }
    let newEntry: JoinedEntry;
    let newCategory: Category | undefined;
    if (selectedCategoryID === "none") {
      newEntry = { ...entry, categoryID: undefined };
    } else {
      newEntry = {
        ...entry,
        categoryID: selectedCategoryID,
      };
      newCategory = await CategoryRepository.get(selectedCategoryID);
    }
    await EntryRepository.update(newEntry);
    setEntry({ ...newEntry, category: newCategory });
    setShowCategoryChoice(false);
    if (newCategory) {
      setTargetCategory(newCategory);
      setShowWordChoice(true);
    }
  };
  const wordIsSelected = (word: string) =>
    selectedNewWords.filter((selectedNewWord) => selectedNewWord === word)
      .length > 0;
  const addWord = (word: string) => {
    setSelectedNewWords([...selectedNewWords, word]);
  };
  const removeWord = (word: string) => {
    setSelectedNewWords(
      selectedNewWords.filter((selectedNewWord) => selectedNewWord !== word),
    );
  };
  const saveNewWords = () => {
    if (!targetCategory) return;
    const resultWords = [...targetCategory.words];
    selectedNewWords.forEach((selectedNewWord) => {
      if (!resultWords.some((resultWord) => resultWord === selectedNewWord)) {
        resultWords.push(selectedNewWord);
      }
    });
    CategoryRepository.update({
      ...targetCategory,
      words: resultWords.sort((a, b) => {
        return a.localeCompare(b);
      }),
    }).catch((e) => {
      throw e;
    });
    setShowWordChoice(false);
  };
  const showIcon = (iconName?: string) => {
    if (!iconName) return faMoneyBill;
    else return categoryIcons[iconName]?.icon ?? faQuestion;
  };
  return (
    <div className="view-expense">
      <PageHeader
        title="Gasto"
        subMenu={
          !editing
            ? [
                {
                  name: "Editar Gasto",
                  icon: faPencil,
                  onAction: startEdit,
                },
                {
                  name: "Excluir Gasto",
                  destructive: true,
                  icon: faTrash,
                  onAction: removeEntry,
                },
              ]
            : undefined
        }
        buttons={
          editing
            ? {
                primary: {
                  name: "Salvar",
                  submit: true,
                  formID: editExpenseFormID,
                  disabled: !(validName && validMoney),
                },
                secondary: {
                  name: "Cancelar",
                  onAction: () => {
                    setEditing(false);
                  },
                },
              }
            : undefined
        }
      />

      {!entry ? (
        <></>
      ) : !editing ? (
        <div className="view-expense__information">
          <div className="view-expense__icon">
            <FontAwesomeIcon icon={showIcon(entry.category?.iconName)} />
          </div>
          <div className="view-expense__money">
            R$
            {entry.moneyExpent.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="view-expense__description">{entry.description}</div>

          <div className="view-expense__about">
            <h2 className="view-expense__about-title">Sobre esse gasto</h2>
            <div className="view-expense__rows">
              <div className="view-expense__row">
                <h3 className="view-expense__row-title">Data</h3>
                <div className="view-expense__row-data">
                  {dayjs(entry.createdAtTimestampMiliseconds).format(
                    "dddd, LL",
                  )}
                </div>
              </div>
              <div className="view-expense__row">
                <h3 className="view-expense__row-title">Horário</h3>
                <div className="view-expense__row-data">
                  {dayjs(entry.createdAtTimestampMiliseconds).format("HH:mm")}
                </div>
              </div>
              <div className="view-expense__row">
                <h3 className="view-expense__row-title">Categoria</h3>
                <div className="view-expense__row-data">
                  <button
                    type="button"
                    className="view-expense__choose-category-button"
                    onClick={() => {
                      setSelectedCategoryID(entry.categoryID);
                      setShowCategoryChoice(true);
                    }}
                  >
                    {entry.category ? (
                      <>{entry.category.name}</>
                    ) : (
                      <div>Sem categoria</div>
                    )}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                  <Modal
                    visible={showCategoryChoice}
                    onClose={() => {
                      setShowCategoryChoice(false);
                      setSelectedCategoryID(undefined);
                    }}
                    title="Escolha uma Categoria"
                  >
                    <form
                      className="view-expense__word-choice"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveCategory();
                      }}
                    >
                      <div className="view-expense__word-list">
                        <label className="view-expense__word-label">
                          <input
                            className="view-expense__word-check"
                            type="radio"
                            name="category-choice"
                            value={"none"}
                            checked={
                              selectedCategoryID === "none" ||
                              !selectedCategoryID
                            }
                            onChange={(e) => {
                              setSelectedCategoryID(e.target.value);
                            }}
                          />
                          Sem Categoria
                        </label>
                        {categories.map((category) => {
                          return (
                            <label
                              className="view-expense__word-label"
                              key={category.id}
                            >
                              <input
                                className="view-expense__word-check"
                                type="radio"
                                name="category-choice"
                                value={category.id}
                                checked={category.id === selectedCategoryID}
                                onChange={(e) => {
                                  setSelectedCategoryID(e.target.value);
                                }}
                              />
                              {category.name}
                            </label>
                          );
                        })}
                      </div>
                      <button
                        type="submit"
                        className="view-expense__button view-expense__button--primary"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        className="view-expense__button view-expense__button--secondary"
                        onClick={() => {
                          setShowCategoryChoice(false);
                          setSelectedCategoryID(undefined);
                        }}
                      >
                        Cancelar
                      </button>
                    </form>
                  </Modal>
                  <Modal
                    title="Escolher palavras"
                    visible={showWordChoice}
                    onClose={() => {
                      setShowWordChoice(false);
                      setTargetCategory(undefined);
                      setSelectedNewWords([]);
                    }}
                  >
                    <form
                      className="view-expense__word-choice"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveNewWords();
                      }}
                    >
                      <span className="view-expense__word-choice-description">
                        Você gostaria de adicionar alguma das palavras da
                        descrição desse gasto à categoria{" "}
                        {!!targetCategory && targetCategory.name}?
                      </span>
                      <div className="view-expense__word-list">
                        {!!entry &&
                          targetCategory &&
                          getUniqueWords(entry.description)
                            .filter(
                              (word) =>
                                !targetCategory.words.some(
                                  (categoryWord) => categoryWord === word,
                                ),
                            )
                            .map((word) => (
                              <label
                                className="view-expense__word-label"
                                key={word}
                              >
                                <input
                                  type="checkbox"
                                  className="view-expense__word-check"
                                  value={word}
                                  checked={wordIsSelected(word)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    if (checked) {
                                      addWord(word);
                                    } else {
                                      removeWord(word);
                                    }
                                  }}
                                />
                                {word}
                              </label>
                            ))}
                      </div>
                      <button
                        type="submit"
                        className="view-expense__button view-expense__button--primary"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        className="view-expense__button view-expense__button--secondary"
                        onClick={() => {
                          setShowWordChoice(false);
                          setSelectedNewWords([]);
                        }}
                      >
                        Dispensar
                      </button>
                    </form>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="view-expense__edit"
          id={editExpenseFormID}
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
        >
          <LabeledInput
            name="Descrição"
            placeholder={entry.description}
            value={editedDescription}
            onChange={(e) => {
              setEditedDescription(e.target.value);
            }}
          />
          <LabeledInput
            name="Dinheiro Gasto"
            type="number"
            placeholder={entry.moneyExpent.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            step={0.01}
            value={editedMoney}
            onChange={(e) => {
              setEditedMoney(e.target.value);
            }}
          />
        </form>
      )}
    </div>
  );
};
