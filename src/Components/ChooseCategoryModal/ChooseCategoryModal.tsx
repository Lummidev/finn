import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { categoryIcons } from "../../categoryIcons";
import { CategoryRepository } from "../../Database/CategoryRepository";
import type { Category } from "../../Entities/Category";
import { FormModal } from "../FormModal/FormModal";
import "./ChooseCategoryModal.css";

type ChooseCategoryModalProps = {
  visible: boolean;
  close: () => unknown;
  includeNoneOption?: boolean;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  secondaryButtonAction?: () => unknown;
} & (
  | {
      many: true;
      onChoice: (categoryIDs: string[]) => unknown;
      initialCategoryIDs: string[];
    }
  | {
      many?: false;
      onChoice: (categoryID: string) => unknown;
      initialCategoryID?: string;
    }
);
export const ChooseCategoryModal = (props: ChooseCategoryModalProps) => {
  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<string[]>([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState<
    string | undefined
  >();
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    CategoryRepository.getAll()
      .then((categories) => {
        setCategories(categories.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((e) => {
        throw e;
      });
  }, []);
  const checkInitial = props.many
    ? props.initialCategoryIDs
    : props.initialCategoryID;
  useEffect(() => {
    if (props.visible) {
      if (typeof checkInitial === "object") {
        setSelectedCategoryIDs(checkInitial);
      } else {
        setSelectedCategoryID(checkInitial);
      }
    } else {
      if (props.many) {
        setSelectedCategoryIDs([]);
      } else {
        setSelectedCategoryID(undefined);
      }
    }
  }, [props.visible, props.many, checkInitial]);
  const none = { id: "none", name: "Sem Categoria", iconName: undefined };
  const categoryOptions = categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
      iconName: category.iconName,
    };
  });
  const categoryOptionsWithNone = [none, ...categoryOptions];
  const categoryIsSelected = (searchID: string): boolean => {
    return (
      selectedCategoryIDs.filter((categoryID) => categoryID === searchID)
        .length > 0
    );
  };
  const addCategory = (id: string) => {
    setSelectedCategoryIDs([...selectedCategoryIDs, id]);
  };
  const removeCategory = (id: string) => {
    setSelectedCategoryIDs(
      selectedCategoryIDs.filter((selected) => selected !== id),
    );
  };
  const showIcon = (iconName: string) =>
    categoryIcons[iconName]?.icon ?? faQuestion;

  return (
    <FormModal
      title={`Escolha uma ${props.many ? "ou mais Categorias" : "Categoria"}`}
      visible={props.visible}
      close={() => {
        props.close();
      }}
      onSubmit={() => {
        if (props.many) {
          props.onChoice(selectedCategoryIDs);
        } else {
          if (selectedCategoryID) {
            props.onChoice(selectedCategoryID);
          }
        }
        props.close();
      }}
      primaryButtonLabel="Filtrar"
      secondaryButtonLabel="Limpar Filtro"
      secondaryButtonAction={props.secondaryButtonAction}
    >
      <div className="category-modal__options">
        {(props.includeNoneOption
          ? categoryOptionsWithNone
          : categoryOptions
        ).map((category) => {
          return (
            <label
              className="category-modal__label"
              key={category.id}
              htmlFor={`category-option-${category.id}`}
            >
              <input
                id={`category-option-${category.id}`}
                type={props.many ? "checkbox" : "radio"}
                className="category-modal__checkbox"
                checked={
                  props.many
                    ? categoryIsSelected(category.id)
                    : selectedCategoryID === category.id
                }
                name={props.many ? "choose-category-radio" : undefined}
                value={props.many ? undefined : category.id}
                onChange={(e) => {
                  console.log(props.many, e.target.value);
                  if (props.many) {
                    if (e.target.checked) addCategory(category.id);
                    else removeCategory(category.id);
                  } else {
                    setSelectedCategoryID(e.target.value);
                  }
                }}
              />
              {category.iconName && (
                <FontAwesomeIcon
                  className="category-modal__icon"
                  icon={showIcon(category.iconName)}
                />
              )}
              {category.name}
            </label>
          );
        })}
      </div>
    </FormModal>
  );
};
