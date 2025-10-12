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
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LabeledInput } from "../../Components/LabeledInput/LabeledInput";
import type { Entry } from "../../Entities/Entry";

export const ViewExpense = () => {
  const [entry, setEntry] = useState<JoinedEntry | undefined>();
  const [editing, setEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedMoney, setEditedMoney] = useState("");
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
    setEditing(true);
    setEditedDescription(entry.description);
    setEditedMoney(
      entry.moneyExpent.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  };

  const validName = editedDescription.trim().length > 0;
  const validMoney =
    editedMoney.trim().length > 0 && !isNaN(Number(editedMoney.trim()));
  const editExpenseFormID = "edit-expense";
  const saveEdit = () => {
    if (!entry || !(validName && validMoney)) return;
    const newDescription = editedDescription.trim();
    const newMoneyExpent = Math.trunc(Number(editedMoney.trim()) * 100) / 100;
    const newEntry: Entry = {
      ...entry,
      description: newDescription,
      moneyExpent: newMoneyExpent,
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
            placeholder={entry.moneyExpent.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            step={0.01}
            value={editedMoney}
            onChange={(e) => {
              console.log(e.target.value);
              setEditedMoney(e.target.value);
            }}
          />
        </form>
      )}
    </div>
  );
};
