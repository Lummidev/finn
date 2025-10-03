import { useEffect, useState } from "react";
import "./ViewExpense.css";
import { useParams } from "react-router";
import {
  EntryRepository,
  type JoinedEntry,
} from "../../Database/EntryRepository";
import dayjs from "dayjs";
export const ViewExpense = () => {
  const [entry, setEntry] = useState<JoinedEntry | undefined>();
  const params = useParams();
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
  return (
    <div className="view-expense">
      <h1>Gasto</h1>
      {!entry ? (
        <></>
      ) : (
        <div className="view-expense__information">
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
                <div>
                  {dayjs(entry.createdAtTimestampMiliseconds).format(
                    "dddd, LL",
                  )}
                </div>
              </div>
              <div className="view-expense__row">
                <h3 className="view-expense__row-title">Horário</h3>
                <div>
                  {dayjs(entry.createdAtTimestampMiliseconds).format("HH:mm")}
                </div>
              </div>
              <div className="view-expense__row">
                <h3 className="view-expense__row-title">Categoria</h3>
                <div>
                  {entry.category ? entry.category.name : "Sem categoria"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
