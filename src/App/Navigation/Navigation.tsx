import { Link, useNavigate } from "react-router";
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
import { useTranslation } from "react-i18next";
import { ChatBar } from "../ChatBar/ChatBar";
import { MessageRepository } from "../../Database/MessageRepository";
import { useContext } from "react";
import { SettingsContext } from "../../Context/SettingsContext";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);
  const { t } = useTranslation("common");
  const activeLocationClass = (path: string) => {
    const active = location.pathname.split("/")[1] === path.split("/")[1];
    return {
      link: active ? "navigation__button--current" : "",
      icon: active ? "navigation__icon--current" : "",
    };
  };
  const links: { name: string; pathName: string; icon: IconDefinition }[] = [
    {
      name: t("pageNames.settings"),
      pathName: "/settings",
      icon: faGear,
    },
    {
      name: t("pageNames.categories"),
      pathName: "/categories",
      icon: faLayerGroup,
    },
    {
      name: t("pageNames.expenses"),
      pathName: "/expenses",
      icon: faList,
    },
    {
      name: t("pageNames.dashboard"),
      pathName: "/",
      icon: faChartSimple,
    },
    {
      name: t("pageNames.chat"),
      pathName: "/chat",
      icon: faComments,
    },
  ];
  const handleUserMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return;
    await MessageRepository.insert({
      messageType: "user",
      content: trimmedText,
    });
  };
  const atChat = location.pathname === "/chat";
  const shouldShowChatBar = settings.alwaysShowChatBar || atChat;
  const navigationStyle = `navigation--${settings.navigationTabsStyle}`;
  const buttonsStyle = `navigation__buttons--${settings.navigationTabsStyle}`;
  const buttonStyle = `navigation__button--${settings.navigationTabsStyle}`;
  return (
    <footer
      className={`navigation ${navigationStyle} ${atChat ? "navigation--background-block" : ""} ${shouldShowChatBar ? "navigation--with-chat-bar" : ""}`}
    >
      {shouldShowChatBar && (
        <div className="navigation__chat-bar">
          <ChatBar
            onSubmit={handleUserMessage}
            onFocus={() => {
              navigate("/chat");
            }}
          />
        </div>
      )}
      <nav className={`navigation__buttons ${buttonsStyle}`}>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.pathName}
            className={`navigation__button ${buttonStyle} ${activeLocationClass(link.pathName).link}`}
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
    </footer>
  );
};
