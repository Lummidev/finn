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
  faMoneyBill,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import type { Category } from "../../Entities/Category";
import { CategoryRepository } from "../../Database/CategoryRepository";
import { categoryIcons } from "../../categoryIcons";
import { ChooseCategoryModal } from "../../Components/ChooseCategoryModal/ChooseCategoryModal";
export const Expenses = () => {
  const [dateEntryRecord, setDateEntryRecord] = useState<
    Record<string, JoinedEntry[]>
  >({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string | null>();
  const [categoryIDs, setCategoryIDs] = useState<string[] | null>();
  const [searchText, setSearchText] = useState("");
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
  }, [categoryIDs, search, filterByCategory]);
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

  const startCategorySearch = (selectedCategoryIDs: string[]) => {
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
  const showIcon = (iconName?: string) => {
    if (!iconName) return faMoneyBill;
    else return categoryIcons[iconName]?.icon ?? faQuestion;
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
            style={
              searchText === search
                ? {
                    color: "var(--theme-accent)",
                    fontWeight: 500,
                  }
                : undefined
            }
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
          <ChooseCategoryModal
            close={() => {
              setShowCategoryMenu(false);
            }}
            initialCategoryIDs={categoryIDs ?? []}
            onChoice={(selectedCategoryIDs) => {
              startCategorySearch(selectedCategoryIDs);
            }}
            visible={showCategoryMenu}
            secondaryButtonAction={() => {
              clearCategorySearch();
            }}
            includeNoneOption
            many
          />
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
                    <div className="expenses__item-left">
                      <span className="expenses__item-icon">
                        <FontAwesomeIcon
                          icon={showIcon(entry.category?.iconName)}
                        />
                      </span>

                      <div className="expenses__item-details">
                        <h3 className="expenses__item-title">
                          {entry.description}
                        </h3>
                        <div className="expenses__item-date-category">
                          <span>
                            {dayjs(entry.createdAtTimestampMiliseconds).format(
                              "HH:mm",
                            )}
                          </span>
                          <span>•</span>
                          {entry.category ? (
                            <span>{entry.category.name}</span>
                          ) : (
                            <span>Sem categoria</span>
                          )}
                          {entry.updatedAtTimestampMiliseconds && (
                            <>
                              <span>•</span>
                              Editado{" "}
                              {dayjs.duration({ days: 1 }).asMilliseconds() <
                              entry.updatedAtTimestampMiliseconds
                                ? dayjs(
                                    entry.updatedAtTimestampMiliseconds,
                                  ).fromNow()
                                : dayjs(
                                    entry.updatedAtTimestampMiliseconds,
                                  ).format("L")}
                            </>
                          )}
                        </div>
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
