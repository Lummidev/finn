import {
  faEllipsisV,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import "./PageHeader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
interface Action {
  name: string;
  destructive?: boolean;
  icon?: IconDefinition;
  disabled?: boolean;
  onAction?: () => unknown;
}
interface PageHeaderProps {
  title: string;
  className?: string;
  subMenu?: Action[];
  buttons?: {
    primary?: Action & ({ submit?: false } | { submit: true; formID: string });
    secondary?: Action;
  };
}

export const PageHeader = (props: PageHeaderProps) => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const subMenuExists = props.subMenu && props.subMenu.length > 0;
  return (
    <header className={`page-header ${props.className ?? ""}`}>
      <h1 className="page-header__title">{props.title}</h1>
      <div className="page-header__right">
        {!!props.buttons && (
          <div className="page-header__buttons">
            {!!props.buttons.secondary && (
              <button
                type="button"
                disabled={props.buttons.secondary.disabled}
                className="page-header__button page-header__button--secondary"
                onClick={props.buttons.secondary.onAction}
              >
                {!!props.buttons.secondary.icon && (
                  <FontAwesomeIcon icon={props.buttons.secondary.icon} />
                )}
                {props.buttons.secondary.name}
              </button>
            )}
            {!!props.buttons.primary && (
              <button
                type={props.buttons.primary.submit ? "submit" : "button"}
                form={
                  props.buttons.primary.submit
                    ? props.buttons.primary.formID
                    : undefined
                }
                className="page-header__button"
                disabled={props.buttons.primary.disabled}
                onClick={props.buttons.primary.onAction}
              >
                {!!props.buttons.primary.icon && (
                  <FontAwesomeIcon icon={props.buttons.primary.icon} />
                )}
                {props.buttons.primary.name}
              </button>
            )}
          </div>
        )}
        {subMenuExists && (
          <button
            onClick={() => {
              setShowSubMenu(true);
            }}
            type="button"
            className="page-header__submenu-icon"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        )}
      </div>
      {subMenuExists && showSubMenu && (
        <>
          <div className="page-header__submenu">
            {!!props.subMenu &&
              props.subMenu.map((action) => {
                return (
                  <button
                    className={`page-header__submenu-button ${action.destructive ? "page-header__submenu-button--destructive" : ""}`}
                    type="button"
                    key={action.name}
                    onClick={() => {
                      setShowSubMenu(false);
                      if (action.onAction) action.onAction();
                    }}
                  >
                    {action.icon ? (
                      <FontAwesomeIcon icon={action.icon} />
                    ) : (
                      <></>
                    )}
                    {action.name}
                  </button>
                );
              })}
          </div>
          <div
            onClick={() => setShowSubMenu(false)}
            className="page-header__submenu-page-cover"
          ></div>
        </>
      )}
    </header>
  );
};
