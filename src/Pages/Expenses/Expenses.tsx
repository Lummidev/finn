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
import { DateModal } from "../../Components/DateModal/DateModal";
import { useTranslation } from "react-i18next";
import { formatRelativeDate } from "../../util";
export const Expenses = () => {
  const [dateEntryRecord, setDateEntryRecord] = useState<
    Record<string, JoinedEntry[]>
  >({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string | null>();
  const [categoryIDs, setCategoryIDs] = useState<string[] | null>();
  const [dateFilter, setDateFilter] = useState<
    { fromDate: string; toDate: string } | undefined
  >();
  const [showDateModal, setShowDateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const filterByCategory = categoryIDs && categoryIDs.length > 0;
  const [oldestTimestampMiliseconds, setOldestTimestampMiliseconds] = useState(
    Date.now().valueOf(),
  );
  const { t } = useTranslation("expenses");
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
        const record: Record<string, JoinedEntry[]> = {};
        if (entries.length === 0) {
          setDateEntryRecord(record);
          return;
        }
        const oldestTimestampMiliseconds = [...entries].pop()
          ?.createdAtTimestampMiliseconds;
        setOldestTimestampMiliseconds(
          oldestTimestampMiliseconds ?? Date.now().valueOf(),
        );
        let filteredEntries = entries;
        if (dateFilter) {
          const { fromDate, toDate } = dateFilter;
          const from = dayjs(fromDate).startOf("day");
          const to = dayjs(toDate).endOf("day");
          filteredEntries = entries.filter((entry) => {
            const createdDate = dayjs(entry.createdAtTimestampMiliseconds);
            return createdDate.isBetween(from, to);
          });
        }
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
  }, [categoryIDs, search, filterByCategory, dateFilter]);
  useEffect(() => {
    const search = searchParams.get("search");
    setSearch(search);
    if (search) {
      setSearchText(search);
    }
    const categoryIDs = searchParams.getAll("categoryID");
    setCategoryIDs(categoryIDs);
    const { from, to } = {
      from: searchParams.get("fromDate"),
      to: searchParams.get("toDate"),
    };
    if (from && to) {
      setDateFilter({
        fromDate: from,
        toDate: to,
      });
    } else {
      setDateFilter(undefined);
    }
  }, [searchParams]);
  const clearFilter = () => {
    setSearchParams({});
    setSearchText("");
  };
  const selectedCategoryName = () => {
    if (!filterByCategory) return "";
    if (categoryIDs.length === 1) {
      if (categoryIDs[0] === "none") {
        return t("noCategory", { ns: "common" });
      } else {
        for (const category of categories) {
          if (category.id === categoryIDs[0]) {
            return category.name;
          }
        }
        return t("invalidCategoryID");
      }
    } else if (categoryIDs.length >= 1) {
      return t("categoryFilterCounter", { count: categoryIDs.length });
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
  const currentDateFilter = () => {
    if (!dateFilter) return t("invalidDate");
    const { fromDate, toDate } = dateFilter;
    const from = formatRelativeDate(fromDate);
    const to = formatRelativeDate(toDate);
    return `${from} - ${to}`;
  };
  return (
    <div className="expenses">
      <PageHeader title={t("pageNames.expenses", { ns: "common" })} />

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
            placeholder={t("search")}
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
        <div className="expenses__filter-sections">
          <div className="expenses__filter-section">
            <button
              type="button"
              className="expenses__filter-button"
              onClick={() => {
                setShowCategoryMenu(true);
              }}
              style={{
                color: filterByCategory ? "var(--theme-accent)" : undefined,
              }}
            >
              {filterByCategory ? (
                <span className="expenses__selected-filter">
                  {selectedCategoryName()}
                </span>
              ) : (
                t("categoryFilterButton")
              )}
              <span className="expenses__selected-filter-icon">
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
              primaryButtonLabel={t("modalFilterButton")}
              secondaryButtonLabel={t("modalClearFilterButton")}
              secondaryButtonAction={() => {
                clearCategorySearch();
              }}
              includeNoneOption
              many
            />
          </div>
          <div className="expenses__filter-section">
            <button
              type="button"
              className="expenses__filter-button"
              onClick={() => {
                setShowDateModal(true);
              }}
              style={{
                color: dateFilter ? "var(--theme-accent)" : undefined,
              }}
            >
              {dateFilter ? (
                <span className="expenses__selected-filter">
                  {currentDateFilter()}
                </span>
              ) : (
                t("dateFilterButton")
              )}
              <span className="expenses__selected-filter-icon">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </button>
            <DateModal
              visible={showDateModal}
              close={() => {
                setShowDateModal(false);
              }}
              oldestPossibleTimestampMiliseconds={oldestTimestampMiliseconds}
              onSubmit={(from, to) => {
                searchParams.set("fromDate", from);
                searchParams.set("toDate", to);
                setSearchParams(searchParams);
              }}
              primaryButtonLabel={t("modalFilterButton")}
              secondaryButtonLabel={t("modalClearFilterButton")}
              secondaryButtonAction={() => {
                searchParams.delete("fromDate");
                searchParams.delete("toDate");
                setSearchParams(searchParams);
              }}
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
              {t("clearFilterButton")}
            </button>
          </div>
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
                              "LT",
                            )}
                          </span>
                          <span>•</span>
                          {entry.category ? (
                            <span>{entry.category.name}</span>
                          ) : (
                            <span>{t("noCategory", { ns: "common" })}</span>
                          )}
                          {((updatedAtMilis?: number) => {
                            if (!updatedAtMilis) return <></>;
                            const now = dayjs();
                            const updatedAt = dayjs(updatedAtMilis);
                            return (
                              <>
                                <span>•</span>

                                {now.diff(updatedAt, "day") < 1
                                  ? t("editedRelativeTime", {
                                      localizedRelativeTimeString:
                                        updatedAt.fromNow(),
                                    })
                                  : t("editedOnDate", {
                                      date: updatedAt.toDate(),
                                    })}
                              </>
                            );
                          })(entry.updatedAtTimestampMiliseconds)}
                        </div>
                      </div>
                    </div>
                    <div className="expenses__item-money">
                      {t("currency", {
                        value: entry.moneyExpent,
                        ns: "common",
                        formatParams: {
                          value: {
                            currency: "BRL",
                          },
                        },
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
