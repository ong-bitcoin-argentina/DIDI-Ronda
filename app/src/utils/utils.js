import { addDays, addMonths, compareAsc } from "date-fns";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "../services/navigation";
import store from "../store/store";

export const monthArray = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SETIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

export const daysArray = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const roundStatusArray = {
  completed: "Completada",
  current: "Actual",
  draw: "Sorteo",
  pending: "Pendiente",
};

export const roundFrequencyArray = {
  d: "Diaria",
  s: "Semanal",
  q: "Quincenal",
  m: "Mensual",
};

export const roundFrequencyValueArray = {
  d: { d: 1 },
  s: { d: 7 },
  q: { d: 15 },
  m: { m: 1 },
};

export const addDate = (date, add) => {
  const dateObject = new Date(date);
  const frequency = Object.keys(add)[0];
  const value = add[frequency];

  const calculatedDate =
    frequency === "m"
      ? addMonths(dateObject, value)
      : addDays(dateObject, value);

  return calculatedDate;
};

export const getAuth = async () => {
  try {
    const auth = await AsyncStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    return null;
  }
};

export const setAuth = async auth => {
  const authObject = JSON.stringify(auth);
  const authVal = await AsyncStorage.setItem("auth", authObject);

  return authVal;
};

export const getToken = async () => {
  try {
    const auth = await AsyncStorage.getItem("auth");
    const user = auth ? JSON.parse(auth) : null;
    return user.jwtToken;
  } catch (error) {
    return null;
  }
};

export const logOut = async () => {
  try {
    await AsyncStorage.removeItem("auth");
    await AsyncStorage.removeItem("fcmToken");
    store.dispatch({ type: "LOGOUT" });
    NavigationService.navigate("Login");
    return true;
  } catch (error) {
    return false;
  }
};

export const amountFormat = amount => {
  const roundedAmount = Math.round(amount).toString();
  return roundedAmount.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

export const dateFormat = dateParam => {
  if (dateParam) {
    const dateObject = new Date(dateParam);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const monthFormat = month.toString().length === 1 ? `0${month}` : month;
    const year = dateObject.getFullYear();

    return `${day}/${monthFormat}/${year}`;
  }
  return null;
};

export const dateFormatShort = dateParam => {
  if (dateParam) {
    const dateObject = new Date(dateParam);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const monthFormat = month.toString().length === 1 ? `0${month}` : month;
    const year = `${dateObject.getFullYear().toString()[2]}${
      dateObject.getFullYear().toString()[3]
    }`;

    return `${day}/${monthFormat}/${year}`;
  }
  return null;
};

export const dateFormatString = date => {
  const dateObject = new Date(date);

  const dayName = daysArray[dateObject.getDay()].substr(0, 3);
  const formatedDayName = ucFirst(dayName);
  const dayNumber = dateObject.getDate();
  const monthName = ucFirst(monthArray[dateObject.getMonth()]);
  const yearNumber = dateObject.getFullYear();

  return `${formatedDayName}, ${dayNumber} de ${monthName} ${yearNumber}`;
};

export const availableNumberForRequest = (number, round, auth) => {
  const shift = round.shifts.find(s => s.number === number);

  if (shift.status !== "pending") return false;

  const asigned = shift.participant.length > 0;

  if (asigned) {
    const { id: userId } = auth;

    const participant = round.participants.find(p => p.user._id === userId);

    if (participant && shift.participant.includes(participant._id)) return true;
  }

  const requested = shift.requests.length > 0;
  return !asigned && !requested;
};

export const compareDates = (dateA, dateB) => {
  const dateAObj = new Date(dateA);
  const dateBObj = new Date(dateB);

  return compareAsc(
    new Date(dateAObj.getFullYear(), dateAObj.getMonth(), dateAObj.getDate()),
    new Date(dateBObj.getFullYear(), dateBObj.getMonth(), dateBObj.getDate())
  );
};

const ucFirst = string => {
  return string.charAt(0).toUpperCase() + string.toLocaleLowerCase().slice(1);
};

const validPhonePrefixes = ["+598", "+54"];

export const hasValidPhonePrefix = number => {
  if (
    (number &&
      number.length &&
      number.toString().includes(validPhonePrefixes[0])) ||
    number.toString().includes(validPhonePrefixes[1])
  )
    return true;
  return false;
};
