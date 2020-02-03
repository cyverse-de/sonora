/**
 * Application authentication strategy module.
 * @module authStrategy
 */

import * as config from "./configuration";

import OAuth2Strategy from "passport-oauth2";
import rp from "request-promise";

/**
 * Defines the authentication strategy used by passport.
 *
 * @type {passport.strategy}
 */
export const strategy = new OAuth2Strategy(
    {
        authorizationURL: config.oauth2AuthorizationURL,
        tokenURL: config.oauth2TokenURL,
        clientID: config.oauth2ClientID,
        clientSecret: config.oauth2ClientSecret,
        callbackURL: `${config.baseURL}/login`,
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile,
        });
    }
);

/**
 * Obtains the user profile using an access token from the OAuth provider.
 *
 * @param {string} accessToken
 * @param {function} done
 */
strategy.userProfile = function(accessToken, done) {
    const options = {
        uri: config.oauth2ProfileURL,
        qs: {
            access_token: accessToken,
        },
        json: true,
    };
    rp(options)
        .then((profile) => {
            done(null, profile);
        })
        .catch((err) => {
            done(`unable to obtain the user profile: ${err}`, null);
        });
};

/**
 * Serializes the user profile so that it can be stored in the session.
 *
 * @param {*} user
 * @param {function} done
 */
export const serializeUser = (user, done) => {
    done(null, JSON.stringify(user));
};

/**
 * Deserializes the user profile so that it can be retrieved from the session.
 *
 * @param {*} user
 * @param {function} done
 */
export const deserializeUser = (user, done) => {
    done(null, JSON.parse(user));
};

/**
 * Checks for the accessToken in the user object and returns a 401 if it's not present.
 */
export const authnTokenMiddleware = (req, res, next) => {
    const token = req?.user?.accessToken;

    if (!token) {
        res.status(401);
        return next("Authorization required.");
    }

    // Add the Authorization header to the request, that way the request can be piped
    // to an outgoing request without having to manually set the header.
    req.headers["Authorization"] = `Bearer ${req.user.accessToken}`;

    next();
};
