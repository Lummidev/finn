import { useEffect, useState } from "react";
import "./Expenses.css";
import type { Entry } from "../../Entities/Entry";
import { EntryRepository } from "../../Database/EntryRepository";
import dayjs from "dayjs";
import { Link } from "react-router";
export const Expenses = () => {
  const [dateEntryRecord, setDateEntryRecord] = useState<
    Record<string, Entry[]>
  >({});
  useEffect(() => {
    EntryRepository.getAll()
      .then((entries) => {
        const record: Record<string, Entry[]> = {};
        for (const entry of entries) {
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
  }, []);

  return (
    <div className="expenses">
      <h1>Gastos</h1>

      {Object.entries(dateEntryRecord).map(([date, entries]) => (
        <div key={date} className="expenses__date-group">
          <h2 className="expenses__date-title">{date}</h2>
          <ul className="expenses__list">
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
                          : "Sem categoria")}
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
  );
};
