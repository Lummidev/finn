import { Link } from "react-router";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faComments,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
export const Navigation = () => {
  const location = useLocation();
  const pathnames = {
    categories: "/categories",
    dashboard: "/",
    chat: "/chat",
  };
  const activeLocationClass = (path: string) =>
    location.pathname.split("/")[1] === path.split("/")[1]
      ? "navigation__button--current"
      : "";
  return (
    <div className="navigation">
      <Link
        to={pathnames.categories}
        className={`navigation__button ${activeLocationClass(pathnames.categories)}`}
      >
        <FontAwesomeIcon icon={faLayerGroup} />
        Categorias
      </Link>
      <Link
        to={pathnames.dashboard}
        className={`navigation__button ${activeLocationClass(pathnames.dashboard)}`}
      >
        <FontAwesomeIcon icon={faChartSimple} />
        Resumo
      </Link>
      <Link
        to={pathnames.chat}
        className={`navigation__button ${activeLocationClass(pathnames.chat)}`}
      >
        <FontAwesomeIcon icon={faComments} />
        Chat
      </Link>
    </div>
  );
};
