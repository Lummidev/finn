import {
  faBagShopping,
  faBook,
  faBurger,
  faBus,
  faCar,
  faComputer,
  faDumbbell,
  faGift,
  faGraduationCap,
  faMobileScreen,
  faPaw,
  faPills,
  faSoccerBall,
  faStore,
  faTag,
  faUtensils,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { faGamepad } from "@fortawesome/free-solid-svg-icons/faGamepad";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";

export const categoryIcons: Record<
  string,
  { icon: IconDefinition; displayName: string }
> = {
  tag: { icon: faTag, displayName: "Etiqueta" },
  house: { icon: faHouse, displayName: "Casa" },
  car: { icon: faCar, displayName: "Carro" },
  utensils: { icon: faUtensils, displayName: "Utensílios" },
  burger: { icon: faBurger, displayName: "Hambúrger" },
  gamepad: { icon: faGamepad, displayName: "Controle de videogame" },
  computer: { icon: faComputer, displayName: "Computador" },
  mobile: { icon: faMobileScreen, displayName: "Celular" },
  graduationCap: { icon: faGraduationCap, displayName: "Chapéu de formatura" },
  book: { icon: faBook, displayName: "Livro" },
  paw: { icon: faPaw, displayName: "Pata" },
  bus: { icon: faBus, displayName: "Ônibus" },
  bag: { icon: faBagShopping, displayName: "Sacola" },
  dumbbell: { icon: faDumbbell, displayName: "Haltere" },
  soccer: { icon: faSoccerBall, displayName: "Bola de Futebol" },
  pills: { icon: faPills, displayName: "Pílulas" },
  gift: { icon: faGift, displayName: "Presente" },
  store: { icon: faStore, displayName: "Loja" },
};
