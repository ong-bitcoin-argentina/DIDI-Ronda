import colors from "../../components/colors";
import RoundCheck from "../../../assets/img/round-check";
import Round from "../../../assets/img/round";

export const cards = ({ activeRounds, finishedRounds }) => [
  {
    title: "rondas activas",
    qty: activeRounds.length,
    Icon: Round,
    color: colors.secondaryBlue,
    page: 0,
  },
  {
    title: "rondas terminadas",
    qty: finishedRounds.length,
    Icon: RoundCheck,
    color: colors.secondaryGreen,
    page: 2,
  },
];

export const snippets = [
  {
    primaryColor: colors.alterRed,
    description: "Invitá a tus amigos a participar de rondas",
    ImageSource: require("../../../assets/img/person.png"),
    buttonText: "¡Iniciar una ronda!",
  },
  {
    primaryColor: colors.secondaryBlue,
    description: "Accedé a todas tus credenciales de ronda en ai·di",
    ImageSource: require("../../../assets/img/see-credencials.png"),
    buttonText: "Ver Credenciales",
  },
];
