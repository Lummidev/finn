import { useEffect, useState } from "react";
import "./CategoryForm.css";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faQuestion,
  faTag,
  faTrash,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { LabeledInput } from "../../Components/LabeledInput/LabeledInput";
import { ChooseIconModal } from "../../Components/ChooseIconModal/ChooseIconModal";
import { categoryIcons } from "../../categoryIcons";
import { useTranslation } from "react-i18next";
export const CategoryForm = () => {
  const [name, setName] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [validName, setValidName] = useState(false);
  const [validWord, setValidWord] = useState(false);
  const [showIconChoice, setShowIconChoice] = useState(false);
  const [newIconName, setNewIconName] = useState<string | undefined>();
  const navigate = useNavigate();
  const { t } = useTranslation("categoryForm");
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
      iconName: newIconName,
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
  const showIcon = (iconName?: string): IconDefinition => {
    if (!iconName) return faTag;
    const icon = categoryIcons[iconName]?.icon;
    return icon ? icon : faQuestion;
  };
  return (
    <div className="category-form">
      <PageHeader
        buttons={{
          primary: {
            name: t("save", { ns: "common" }),
            disabled: !validName,
            submit: true,
            formID: "new-category-form",
          },
        }}
        title={t("pageNames.newCategory", { ns: "common" })}
      />
      <form
        id="new-category-form"
        className="category-form__fields"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="category-form__name-row">
          <button
            id="edit-icon-button"
            className="category-form__edit-icon-button"
            type="button"
            aria-label={t("changeIconButton")}
            onClick={() => {
              setShowIconChoice(true);
            }}
          >
            <FontAwesomeIcon icon={showIcon(newIconName)} />
          </button>

          <LabeledInput
            className="category-form__edit-name"
            name={t("name")}
            placeholder={t("placeholders.name")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="category-form__labeled-input">
          <LabeledInput
            name={t("keywords")}
            placeholder={t("placeholders.keywords")}
            value={newWord}
            button={{
              icon: faPlus,
              type: "button",
              onClick: () => {
                if (validWord) addWord();
              },
              label: t("addWordButton"),
              disabled: !validWord,
            }}
            onChange={(e) => {
              setNewWord(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (validWord) addWord();
              }
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
                    aria-label={t("removeWordButton")}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
        initialIconName={newIconName}
      />
    </div>
  );
};
