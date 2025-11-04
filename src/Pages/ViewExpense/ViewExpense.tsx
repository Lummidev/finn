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
import { getUniqueWords } from "../../util";
import { categoryIcons } from "../../categoryIcons";
import { ChooseCategoryModal } from "../../Components/ChooseCategoryModal/ChooseCategoryModal";
import { FormModal } from "../../Components/FormModal/FormModal";
import { numericFormatter } from "react-number-format";

export const ViewExpense = () => {
  const [entry, setEntry] = useState<JoinedEntry | undefined>();
  const [editing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedMoney, setEditedMoney] = useState<number | undefined>(0);
  const [editedNote, setEditedNote] = useState("");
  const [showCategoryChoice, setShowCategoryChoice] = useState(false);
  const [showWordChoice, setShowWordChoice] = useState(false);
  const [targetCategory, setTargetCategory] = useState<Category | undefined>();
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
    console.log(entry);
    setEditing(true);
    setEditedDescription(entry.description);
    setEditedMoney(entry.moneyExpent);
    setEditedNote(entry.note ?? "");
  };

  const validName = editedDescription.trim().length > 0;
  const validMoney = !editedMoney || (editedMoney >= 0 && !isNaN(editedMoney));
  const editExpenseFormID = "edit-expense";
  const saveEdit = () => {
    if (!entry || !(validName && validMoney)) return;
    const newDescription = editedDescription.trim();
    const newNote = editedNote.trim();
    const newMoneyExpent = !editedMoney
      ? 0
      : Math.trunc(editedMoney * 100) / 100;
    const newEntry: Entry = {
      ...entry,
      description: newDescription,
      moneyExpent: newMoneyExpent,
      note: newNote,
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
  const saveCategory = async (selectedCategoryID: string) => {
    if (!entry) {
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
    if (newCategory && entry.categoryID !== newCategory.id) {
      const suggestedWords = getUniqueWords(entry.description).filter(
        (word) =>
          !newCategory.words.some((categoryWord) => categoryWord === word),
      );
      if (suggestedWords.length > 0) {
        setTargetCategory(newCategory);
        setShowWordChoice(true);
      }
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
                  <ChooseCategoryModal
                    many={false}
                    includeNoneOption
                    visible={showCategoryChoice}
                    close={() => {
                      setShowCategoryChoice(false);
                    }}
                    initialCategoryID={entry.category?.id}
                    onChoice={(categoryID) => {
                      saveCategory(categoryID);
                    }}
                  />
                  <FormModal
                    title="Escolher Palavras"
                    visible={showWordChoice}
                    close={() => {
                      setShowWordChoice(false);
                      setTargetCategory(undefined);
                      setSelectedNewWords([]);
                    }}
                    onSubmit={() => {
                      saveNewWords();
                    }}
                    secondaryButtonAction={() => {
                      setSelectedNewWords([]);
                    }}
                    secondaryButtonLabel="Dispensar"
                  >
                    <span className="view-expense__word-choice-description">
                      Você gostaria de adicionar alguma das palavras da
                      descrição desse gasto à categoria{" "}
                      {!!targetCategory && targetCategory.name}?
                    </span>
                    <div className="view-expense__word-list">
                      {!!entry &&
                        !!targetCategory &&
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
                  </FormModal>
                </div>
              </div>
              <div className="view-expense__row">
                <h3 className="view-expense__row-title">Observação</h3>
                <div className="view-expense__row-data">
                  {entry.note && entry.note.length > 0 ? (
                    entry.note
                  ) : (
                    <span className="view-expense__no-note">
                      Nenhuma observação
                    </span>
                  )}
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
            placeholder={numericFormatter(entry.moneyExpent.toString(), {
              prefix: "R$",
              decimalScale: 2,
              fixedDecimalScale: true,
            })}
            value={editedMoney}
            onValueChange={(value) => {
              setEditedMoney(value);
            }}
            prefix="R$"
          />
          <LabeledInput
            name="Observação"
            type="text"
            placeholder="Escreva uma observação sobre o gasto aqui"
            value={editedNote}
            onChange={(e) => {
              setEditedNote(e.target.value);
            }}
          />
        </form>
      )}
    </div>
  );
};
