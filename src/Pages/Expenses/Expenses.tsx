import { useEffect, useState } from "react";
import "./Expenses.css";
import {
  EntryRepository,
  type JoinedEntry,
} from "../../Database/EntryRepository";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faFilterCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { Modal } from "../../Components/Modal/Modal";
export const Expenses = () => {
  const [dateEntryRecord, setDateEntryRecord] = useState<
    Record<string, JoinedEntry[]>
  >({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string | null>();
  const [categoryIDs, setCategoryIDs] = useState<string[] | null>();
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const filterByCategory = categoryIDs && categoryIDs.length > 0;
  useEffect(() => {
    CategoryRepository.getAll()
      .then((categories) => {
        setCategories(categories.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((e) => {
        throw e;
      });
    EntryRepository.getAll()
      .then((entries) => {
        let filteredEntries = entries;
        if (filterByCategory) {
          filteredEntries = filteredEntries.filter((entry) => {
            for (const id of categoryIDs) {
              const returnNoCategory = id === "none" && !entry.categoryID;
              const returnMatch = id === entry.categoryID;
              if (returnNoCategory || returnMatch) {
                return true;
              }
            }
            return false;
          });
        }
        if (search) {
          const regex = new RegExp(search.trim(), "i");
          filteredEntries = filteredEntries.filter(
            (entry) =>
              regex.test(entry.description) ||
              (entry.category && regex.test(entry.category.name)),
          );
        }
        const record: Record<string, JoinedEntry[]> = {};
        for (const entry of filteredEntries) {
          const date = dayjs(entry.createdAtTimestampMiliseconds).format("LL");
          if (record[date]) {
            record[date] = [...record[date], entry];
          } else {
            record[date] = [entry];
          }
        }
        setDateEntryRecord(record);
      })
      .catch((e) => {
        throw e;
      });
  }, [categoryIDs, search]);
  useEffect(() => {
    const search = searchParams.get("search");
    setSearch(search);
    if (search) {
      setSearchText(search);
    }
    const categoryIDs = searchParams.getAll("categoryID");
    setCategoryIDs(categoryIDs);
  }, [searchParams]);
  const clearFilter = () => {
    setSearchParams({});
    setSelectedCategoryIDs([]);
    setSearchText("");
  };
  const selectedCategoryName = () => {
    if (!filterByCategory) return "";
    if (categoryIDs.length === 1) {
      if (categoryIDs[0] === "none") {
        return "Sem Categoria";
      } else {
        for (const category of categories) {
          if (category.id === categoryIDs[0]) {
            return category.name;
          }
        }
        return "ID inválido";
      }
    } else if (categoryIDs.length >= 1) {
      return `${categoryIDs.length} Categorias`;
    }
  };
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
  const startCategorySearch = () => {
    searchParams.delete("categoryID");
    for (const id of selectedCategoryIDs) {
      searchParams.append("categoryID", id);
    }
    setSearchParams(searchParams);
  };
  const clearCategorySearch = () => {
    searchParams.delete("categoryID");
    setSearchParams(searchParams);
  };
  return (
    <div className="expenses">
      <PageHeader title="Gastos" />
      <div className="expenses__filter">
        <form
          className="expenses__search"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchText.trim().length === 0) {
              searchParams.delete("search");
            } else {
              searchParams.set("search", searchText);
            }
            setSearchParams(searchParams);
          }}
        >
          <input
            placeholder="Pesquisar"
            className="expenses__search-input"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            style={{
              color: searchText === search ? "var(--theme-accent)" : undefined,
            }}
          />
          <button type="submit" className="expenses__search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <div className="expenses__category-filter">
          <button
            type="button"
            className="expenses__category-filter-button"
            onClick={() => {
              setShowCategoryMenu(true);
            }}
            style={{
              color: filterByCategory ? "var(--theme-accent)" : undefined,
            }}
          >
            {filterByCategory ? (
              <span className="expenses__selected-category">
                {selectedCategoryName()}
              </span>
            ) : (
              "Categoria"
            )}
            <span className="expenses__selected-category-icon">
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </button>
          <Modal
            title="Escolha uma Categoria"
            visible={showCategoryMenu}
            onClose={() => {
              setSelectedCategoryIDs(categoryIDs ?? []);
              setShowCategoryMenu(false);
            }}
          >
            <form
              className="expenses__category-selection"
              onSubmit={(e) => {
                e.preventDefault();
                setShowCategoryMenu(false);
                startCategorySearch();
              }}
            >
              <div className="expenses__category-options">
                {[
                  { id: "none", name: "Sem Categoria" },
                  ...categories.map((category) => {
                    return { id: category.id, name: category.name };
                  }),
                ].map((category) => {
                  return (
                    <label
                      className="expenses__category-label"
                      key={category.id}
                      htmlFor={`category-option-${category.id}`}
                    >
                      <input
                        id={`category-option-${category.id}`}
                        type="checkbox"
                        className="expenses__category-checkbox"
                        checked={categoryIsSelected(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) addCategory(category.id);
                          else removeCategory(category.id);
                        }}
                      />
                      {category.name}
                    </label>
                  );
                })}
              </div>
              <div className="expenses__category-form-buttons">
                <button
                  type="submit"
                  className="expenses__button expenses__button--primary"
                >
                  Filtrar
                </button>
                <button
                  type="button"
                  className="expenses__button expenses__button--secondary"
                  onClick={() => {
                    clearCategorySearch();
                    setSelectedCategoryIDs([]);
                    setShowCategoryMenu(false);
                  }}
                >
                  Limpar filtro
                </button>
              </div>
            </form>
          </Modal>
        </div>
        <div className="expenses__filter-clear">
          <button
            type="button"
            className="expenses__filter-clear-button"
            disabled={Array.from(searchParams.entries()).length === 0}
            onClick={() => {
              clearFilter();
            }}
          >
            <FontAwesomeIcon icon={faFilterCircleXmark} />
            Limpar
          </button>
        </div>
      </div>

      <div className="expenses__list">
        {Object.entries(dateEntryRecord).map(([date, entries]) => (
          <div key={date} className="expenses__date-group">
            <h2 className="expenses__date-title">{date}</h2>
            <ul className="expenses__group-list">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <Link className="expenses__item" to={`/expenses/${entry.id}`}>
                    <div className="expenses__item-details">
                      <h3 className="expenses__item-title">
                        {entry.description}
                      </h3>
                      <div className="expenses__item-date-category">
                        {dayjs(entry.createdAtTimestampMiliseconds).format(
                          "HH:mm",
                        ) +
                          " • " +
                          (entry.category
                            ? entry.category.name
                            : "Sem categoria") +
                          (entry.updatedAtTimestampMiliseconds
                            ? ` • Editado ${
                                dayjs.duration({ days: 1 }).asMilliseconds() <
                                entry.updatedAtTimestampMiliseconds
                                  ? dayjs(
                                      entry.updatedAtTimestampMiliseconds,
                                    ).fromNow()
                                  : dayjs(
                                      entry.updatedAtTimestampMiliseconds,
                                    ).format("L")
                              }`
                            : "")}
                      </div>
                    </div>
                    <div className="expenses__item-money">
                      R$
                      {entry.moneyExpent.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
