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
  faArrowUpRightFromSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const ViewExpense = () => {
  const [entry, setEntry] = useState<JoinedEntry | undefined>();
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
  return (
    <div className="view-expense">
      <PageHeader
        title="Gasto"
        subMenu={[
          {
            name: "Excluir gasto",
            destructive: true,
            icon: faTrash,
            onAction: removeEntry,
          },
        ]}
      />

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
                  {entry.category ? (
                    <Link
                      className="view-expense__link"
                      to={`/categories/${entry.category.id}`}
                    >
                      <div className="view-expense__link-icon">
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </div>
                      <div className="view-expense__link-text">
                        {entry.category.name}
                      </div>
                    </Link>
                  ) : (
                    <div>"Sem categoria"</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
