const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashString = async str => {
  try {
    const result = await bcrypt.hash(str, saltRounds);
    return { result };
  } catch (error) {
    return { error };
  }
};

/**
 * Is the first argument equal to the second? ()
 */
exports.compareString = async (unhashedString, hashedString) => {
  try {
    const result = await bcrypt.compare(unhashedString, hashedString);
    return { result };
  } catch (error) {
    return { error };
  }
};
