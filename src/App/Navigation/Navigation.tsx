import { Link } from "react-router";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faComments,
  faGear,
  faLayerGroup,
  faList,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
export const Navigation = () => {
  const location = useLocation();

  const activeLocationClass = (path: string) => {
    const active = location.pathname.split("/")[1] === path.split("/")[1];
    return {
      link: active ? "navigation__button--current" : "",
      icon: active ? "navigation__icon--current" : "",
    };
  };
  const links: { name: string; pathName: string; icon: IconDefinition }[] = [
    {
      name: "Ajustes",
      pathName: "/settings",
      icon: faGear,
    },
    {
      name: "Categorias",
      pathName: "/categories",
      icon: faLayerGroup,
    },
    {
      name: "Gastos",
      pathName: "/expenses",
      icon: faList,
    },
    {
      name: "Resumo",
      pathName: "/",
      icon: faChartSimple,
    },
    {
      name: "Chat",
      pathName: "/chat",
      icon: faComments,
    },
  ];
  return (
    <nav className="navigation">
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.pathName}
          className={`navigation__button ${activeLocationClass(link.pathName).link}`}
        >
          <div
            className={`navigation__icon ${activeLocationClass(link.pathName).icon}`}
          >
            <FontAwesomeIcon
              className="navigation__icon-element"
              icon={link.icon}
            />
          </div>
          {link.name}
        </Link>
      ))}
    </nav>
  );
};
