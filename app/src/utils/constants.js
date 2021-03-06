import {
  monthNames,
  dayNamesShort,
  monthNamesShort,
  dayNames,
} from "./localization";

export const notificationsCodes = {
  errorSC: "register-user-failed",
};

export const LOCALE_CONFIG = {
  monthNames,
  monthNamesShort,
  dayNames,
  dayNamesShort,
};

export const ASSIGNMENT_MODES = {
  lottery: "lottery",
  manual: "manual",
};

export const ASSIGNMENT_MODES_NORMALIZED = {
  [ASSIGNMENT_MODES.lottery]: "Sorteo",
  [ASSIGNMENT_MODES.manual]: "Administrador",
};

export const ruffleRouletteColors = [
  "#417FD7",
  "#69A7FE",
  "#E03C7A",
  "#F97EAD",
  "#06CBB5",
  "#5CE6D6",
  "#6ECC62",
  "#92ED86",
  "#FFC500",
  "#FFDE6D",
  "#906ECD",
  "#B89AED",
];
