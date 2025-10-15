import {
  faBagShopping,
  faBook,
  faBurger,
  faBus,
  faCar,
  faComputer,
  faDumbbell,
  faFutbol,
  faGamepad,
  faGift,
  faGraduationCap,
  faHouse,
  faMobileScreen,
  faPaw,
  faPills,
  faStore,
  faTag,
  faUtensils,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
const iconOptions: [IconDefinition, string][] = [
  [faBagShopping, "Sacola"],
  [faBook, "Livro"],
  [faBurger, "Hambúrger"],
  [faBus, "Ônibus"],
  [faCar, "Carro"],
  [faComputer, "Computador"],
  [faDumbbell, "Haltere"],
  [faFutbol, "Bola de Futebol"],
  [faGamepad, "Controle de videogame"],
  [faGift, "Presente"],
  [faGraduationCap, "Chapéu de formatura"],
  [faHouse, "Casa"],
  [faMobileScreen, "Celular"],
  [faPaw, "Pata"],
  [faPills, "Pílulas"],
  [faStore, "Loja"],
  [faTag, "Etiqueta"],
  [faUtensils, "Utensílios"],
];
const categoryIcons: Record<
  string,
  { icon: IconDefinition; displayName: string }
> = {};
iconOptions.forEach((iconOption) => {
  const [icon, displayName] = iconOption;
  categoryIcons[icon.iconName] = { icon, displayName };
});

export { categoryIcons };
