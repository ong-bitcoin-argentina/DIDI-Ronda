const mailing = require("../helpers/emails");
const tokens = require("../helpers/tokenGenerator");
const JWT = require("../helpers/jwt");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const SMS = require("../helpers/phones");

// MANAGERS
const external_auth = require("../managers/external_auth");
const user_manager = require("../managers/user");
const participant_manager = require("../managers/participant");

const { customError } = require("../helpers/errorHandler");

//LOGIN
exports.login = async (username, password) => {
    // Find user
    const user = await user_manager.byUsername(username);
    if (user === null) throw new customError("User not exists");

    // Check user password (NEEDS REFACTOR)
    if (user.password !== password) throw new customError("Wrong password");

    const jwtToken = JWT.sign({ username });

    const returnUser = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        verified: user.verified,
        phone: user.phone,
        token: user.token,
        jwtToken: jwtToken
    };

    return returnUser;
};

//REGISTER
exports.register = async (username, password, name, token) => {
    const userExists = await user_manager.byUsername(username);

    if (userExists !== null) throw new customError("That user already exists");

    const verifyToken = tokens.generate();

    const user = await user_manager.saveUser(
        username,
        password,
        name,
        token,
        verifyToken
    );

    if (user) {
        sendVerificationToken(username, verifyToken);
    }

    return user;
};
//REGISTER VERIFICATION TOKEN AND MAIL SENDING
sendVerificationToken = (username, token) => {
    mailing.sendMail(
        username,
        "La Ronda",
        `Tu codigo de verificacion es: ${token}`
    );

    return token;
};

//TOKEN VERIFICATION
exports.verify = async (username, token) => {
    const user = await user_manager.byUsername(username);

    const verified = user.verifyToken === token;

    if (verified) {
        user.verifyToken = null;
        await user.save();

        const token = JWT.sign({ username: username });

        const returnUser = {
            id: user._id,
            name: user.name,
            verified: user.verified,
            lastname: user.lastname,
            username: user.username,
            emailVerified: user.verifyToken === null,
            phone: user.phone,
            token: token
        };

        return { returnUser };

    }
    throw new customError("Invalid Token");
};

//FORGOT PASSWORD
exports.forgot = async username => {
    const token = tokens.generate();

    const user = await user_manager.byUsername(username);

    if (user === null) throw new customError("That user does not exists");

    user.forgotToken = token;

    await user.save();

    mailing.sendMail(
        username,
        "La Ronda",
        `Tu codigo para cambiar tu contraseña es: ${token}`
    );

    return { tokenSent: true };
};

//VERIFICATION
exports.forgotCode = async (username, token) => {
    const user = await user_manager.byUsername(username);

    if (user === null) return { valid: false };

    if (user.forgotToken == token) {
        return { valid: true };
    } else {
        return { valid: false };
    }
};

//ADD PHONE
exports.phone = async (username, phone, country) => {
    const user = await user_manager.byUsername(username);

    const number = phoneUtil.parseAndKeepRawInput(phone, country);

    const phoneNumber = phoneUtil.format(number, PNF.INTERNATIONAL);
    const userByPhone = await user_manager.byPhone(phoneNumber);
    if (userByPhone && userByPhone.verified)
        throw new customError("That phone already exists and it is verified", 409);

    if (user === null) throw new customError("That user does not exists");

    // Do not change the token if the user has already one
    if (!user.phoneToken) user.phoneToken = tokens.generate();

    SMS.sendVerificationCode(user.phoneToken, phoneNumber);

    await user.save();

    return { tokenSent: true };
};

//PHONE VERIFICATION
exports.phoneCode = async (username, phone, country, token) => {
    const number = phoneUtil.parseAndKeepRawInput(phone, country);

    const phoneNumber = phoneUtil.format(number, PNF.INTERNATIONAL);

    const user = await user_manager.byUsername(username);
    if (user === null) throw new customError("The user not exist");

    if (user.phoneToken == token) {
        const userPhone = await user_manager.byPhone(phoneNumber);

        // If userPhone exist and is verified, return error
        if (userPhone && userPhone.verified)
            throw new customError("That phone already exist and it is verified");

        if (userPhone) {
            const participants = await participant_manager.participantsOfUser(
                userPhone
            );

            participants.forEach(async p => {
                p.user = user._id;
                await participant_manager.save(p);
            });

            await user_manager.remove(userPhone);
        }

        user.phone = phoneNumber;
        user.phoneToken = null;
        user.verified = true;

        const jwtToken = JWT.sign({ username: username });

        const returnUser = {
            id: user._id,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            emailVerified: user.verifyToken === null,
            phone: user.phone,
            jwtToken: jwtToken
        };

        await user.save();

        return { valid: true, auth: returnUser };
    } else {
        throw new customError("Token is incorrect");
    }
};

//SETTING NEW PASSWORD
exports.forgotNewPassword = async (username, password, token) => {
    const user = await user_manager.byUsername(username);

    if (user === null) throw new customError("That user already exists");

    if (user.forgotToken == token) {
        user.password = password;
        user.forgotToken = null;

        user.save();

        return { changed: true };
    } else {
        return { changed: false };
    }
};
