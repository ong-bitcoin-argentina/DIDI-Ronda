import { passwordChecker, passwordErrors } from "../../src/utils/password";
import { getHoursAndMinutes } from "../../src/utils/dates";

const correctPassword = "6YsMn09sll231Ax";
const noMayusPassword = correctPassword.toLowerCase();
const noNumberPassword = "YsmqweqweNweweweweadfaf";
const noLengthPassword = "7yYxe";

describe("Tests for password checker", () => {
  test("should pass correct password", () => {
    const result = passwordChecker(correctPassword, correctPassword);
    expect(result).toBe(false);
  });

  test("should not allow password without uppercase", () => {
    const result = passwordChecker(noMayusPassword, noMayusPassword);
    expect(result).toBe(passwordErrors.NO_MAYUS);
  });

  test("should not allow password without numbers", () => {
    const result = passwordChecker(noNumberPassword, noNumberPassword);
    expect(result).toBe(passwordErrors.NO_NUMBER);
  });

  test("should not allow password without the needed length", () => {
    const result = passwordChecker(noLengthPassword, noLengthPassword);
    expect(result).toBe(passwordErrors.MIN_LENGTH);
  });

  test("should not allow non matching passwords", () => {
    const result = passwordChecker(correctPassword, `${correctPassword}XXX`);
    expect(result).toBe(passwordErrors.NO_MATCH);
  });
});

describe("Tests for date formatters", () => {
  test("should return a proper string for time", () => {
    const date = new Date(1595343720);
    const time = getHoursAndMinutes(date);
    const expectedTime = "8:09";
    expect(time).toBe(expectedTime);
  });
});
