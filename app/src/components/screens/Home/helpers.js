import colors from "../../components/colors";
import RoundCheck from "../../../assets/img/round-check";
import Round from "../../../assets/img/round";
import Credential from "../../../assets/img/credential";

export const cards = ({ activeRounds, finishedRounds }) => [
  {
    title: "Rondas Activas",
    qty: activeRounds.length,
    Icon: Round,
    color: colors.secondaryBlue,
    page: 0,
  },
  {
    title: "Rondas Terminadas",
    qty: finishedRounds.length,
    Icon: RoundCheck,
    color: colors.secondaryGreen,
    page: 2,
  },
];

export const snippets = [
  {
    primaryColor: colors.alterRed,
    description: "Invitá a tus amigos a participar de Rondas!",
    ImageSource: require("../../../assets/img/person.png"),
    buttonText: "Invitar Amig@s",
  },
  {
    primaryColor: colors.secondaryBlue,
    description: "Accedé a todas tus credenciales de Ronda en ai.di",
    CustomIcon: Credential,
    buttonText: "Ver Credenciales",
  },
];
