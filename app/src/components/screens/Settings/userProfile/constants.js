import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
});

const aidiName = "ai·di";
const rondaName = "Ronda";

export const aboutAidi = [
  [
    {
      style: styles.bold,
      text: aidiName,
    },
    {
      style: {},
      text:
        " es una solución tecnológica de identidad digital descentralizada mediante modelos de Blockchain desarrollada en el marco del",
    },
    {
      style: styles.bold,
      text: " Proyecto DIDI, Identidad Digital para la inclusión.",
    },
  ],
  [
    {
      style: {},
      text: "A través de la app ",
    },
    {
      style: styles.bold,
      text: aidiName,
    },
    {
      style: {},
      text:
        ", podrás construir una identidad digital que certifique y valide datos sociales, cívicos y económicos, por medio de credenciales verificables emitidas por terceros (instituciones o individuos) con información que acredita que sos portadora o portador de ciertos atributos que tienen que ver con tu identidad.",
    },
  ],
  [
    {
      style: styles.bold,
      text: aidiName,
    },
    {
      style: {},
      text:
        " utiliza el protocolo de credenciales verificables de la identidad digital auto soberana (SSI) cuyos estándares fueron definidos por World Wide Web Consortium (W3C), de manera que el usuario pueda resguardar su información de forma privada asegurando los requisitos de privacidad, control, portabilidad a su vez que garantiza integridad de los datos y autenticidad de emisor.",
    },
  ],
];

export const aboutRonda = [
  [
    {
      style: styles.bold,
      text: rondaName,
    },
    {
      style: {},
      text:
        " es una aplicación de Proyecto DIDI creada para jugar rondas, vaquitas, juntas o pasanakus de forma rápida, fácil y segura.",
    },
  ],
  [
    {
      style: {},
      text:
        "Podés crear rondas con quién vos quieras, por el monto y el tiempo que elijan y hacer un seguimiento de cada ronda, los turnos y días de pago.",
    },
  ],
  [
    {
      style: {},
      text:
        "Además tu participación queda registrada en la app a través de credenciales que validan tu capacidad de pago y tu reputación de buen pagador o pagadora. Al utilizar la tecnología ",
    },
    {
      style: styles.bold,
      text: "blockchain",
    },
    {
      style: {},
      text: ", todos los datos y registros almacenados son privados y seguros.",
    },
  ],
];
