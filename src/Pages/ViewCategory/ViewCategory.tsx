import { useParams, useNavigate } from "react-router";
import "./ViewCategory.css";
import { useEffect, useMemo, useState } from "react";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
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
import { ChooseIconModal } from "../../Components/ChooseIconModal/ChooseIconModal";
import type { ManipulateType } from "dayjs";
import { FormModal } from "../../Components/FormModal/FormModal";
import { getTotalExpensesOfCategory } from "../../Database/ReportRepository";
import { useTranslation } from "react-i18next";
interface PeriodPair {
  count: number;
  type: ManipulateType;
}

export const ViewCategory = () => {
  const [category, setCategory] = useState<Category | undefined>();
  const [editing, setEditing] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedWords, setEditedWords] = useState<string[]>([]);
  const [validName, setValidName] = useState(false);
  const [validWord, setValidWord] = useState(false);
  const [newIconName, setNewIconName] = useState<string | undefined>();
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [periodKey, setPeriodKey] = useState<string>("month");
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>("month");
  const [showIconChoice, setShowIconChoice] = useState(false);
  const [moneyExpent, setMoneyExpent] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("viewCategory");
  const periodOptions: Record<
    string,
    { label: string; period: PeriodPair | null }
  > = useMemo(
    () => ({
      month: {
        label: t("periodOptions.thisMonth"),
        period: { count: 1, type: "month" },
      },
      threeMonths: {
        label: t("periodOptions.lastThreeMonths"),
        period: { count: 3, type: "months" },
      },
      year: {
        label: t("periodOptions.thisYear"),
        period: { count: 1, type: "year" },
      },
      all: { label: t("periodOptions.sinceTheBeginning"), period: null },
    }),
    [t],
  );
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
    const period = periodOptions[periodKey];

    getTotalExpensesOfCategory(
      params.id,
      period.period
        ? { count: period.period.count, type: period.period.type }
        : undefined,
    )
      .then((moneyExpent) => {
        setMoneyExpent(moneyExpent);
      })
      .catch((e) => {
        throw e;
      });
  }, [params, periodKey, periodOptions]);
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
          name: t("save", { ns: "common" }),
          disabled: !validName,
          submit: true,
          formID: "edit-category",
        },
        secondary: {
          name: t("cancel", { ns: "common" }),
          onAction: () => setEditing(false),
        },
      }
    : undefined;
  const subMenu = editing
    ? undefined
    : [
        {
          name: t("editCategoryButton"),
          onAction: () => {
            startEditing();
          },
          icon: faPencil,
        },
        {
          name: t("deleteCategoryButton"),
          onAction: () => removeCategory(),
          icon: faTrash,
          destructive: true,
        },
      ];
  const showIcon = (iconName?: string): IconDefinition => {
    if (!iconName) return faTag;
    const icon = categoryIcons[iconName]?.icon;
    return icon ? icon : faQuestion;
  };
  const openIconEditModal = () => {
    if (!category) return;
    setShowIconChoice(true);
  };
  const confirmPeriod = () => {
    if (!selectedPeriodKey) return;
    setPeriodKey(selectedPeriodKey);
  };

  return (
    <div className="view-category">
      <PageHeader
        title={editing ? t("pageTitle.editing") : t("pageTitle.normal")}
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
                    name={t("nameInputLabel")}
                    className="view-category__edit-name"
                    placeholder={category.name}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div className="view-category__words">
                  <div>
                    <LabeledInput
                      name={t("newKeywordInputLabel")}
                      button={{
                        type: "button",
                        onClick: () => {
                          if (validWord) addWord();
                        },
                        icon: faPlus,
                        label: t("addKeywordButtonLabel"),
                        disabled: !validWord,
                      }}
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (validWord) addWord();
                        }
                      }}
                    />
                  </div>
                  <ul className="view-category__word-list">
                    {editedWords.map((word) => {
                      return (
                        <li
                          key={word}
                          className="view-category__word-container view-category__word-container--editing"
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
              <ChooseIconModal
                visible={showIconChoice}
                close={() => {
                  setShowIconChoice(false);
                }}
                onChoice={(iconName) => {
                  setNewIconName(iconName);
                }}
                initialIconName={newIconName ?? category.iconName}
              />
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
                <FontAwesomeIcon icon={faCircleInfo} />{" "}
                {t("categoryInformationText")}
              </span>
              <div className="view-category__words">
                <h2 className="view-category__subtitle">{t("keywords")}</h2>

                {category.words.length > 0 ? (
                  <>
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
                    <span className="view-category__information-text">
                      <FontAwesomeIcon icon={faCircleInfo} /> {t("noKeywords")}
                    </span>
                  </>
                )}
              </div>
              <div className="view-category__details">
                <h2 className="view-category__subtitle">{t("details")}</h2>
                <div className="view-category__details-row">
                  <div className="view-category__row-title">
                    {t("moneySpent")}
                    <button
                      className="view-category__select-period-button"
                      type="button"
                      onClick={() => {
                        setShowPeriodModal(true);
                      }}
                    >
                      {periodOptions[periodKey].label || t("period")}
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  </div>
                  <div className="view-category__row-data view-category__row-data--money">
                    {t("currency", {
                      ns: "common",
                      value: moneyExpent,
                      formatParams: {
                        value: {
                          currency: "BRL",
                        },
                      },
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <FormModal
            title={t("timePeriodModalTitle")}
            close={() => {
              setShowPeriodModal(false);
            }}
            visible={showPeriodModal}
            onSubmit={() => {
              confirmPeriod();
              setShowPeriodModal(false);
            }}
            primaryButtonLabel={t("selectButton")}
            secondaryButtonAction={() => {
              setSelectedPeriodKey(periodKey);
            }}
          >
            {Object.keys(periodOptions).map((periodOptionKey) => {
              const currentOption = periodOptions[periodOptionKey];
              return (
                <label
                  className="view-category__period-label"
                  key={periodOptionKey}
                >
                  <input
                    type="radio"
                    className="view-category__period-radio"
                    value={periodOptionKey}
                    name="category-period-filter"
                    checked={selectedPeriodKey === periodOptionKey}
                    onChange={(e) => {
                      setSelectedPeriodKey(e.target.value);
                    }}
                  />
                  <span className="view-category__period-radio-indicator" />
                  {currentOption.label}
                </label>
              );
            })}
          </FormModal>
        </>
      )}
    </div>
  );
};
