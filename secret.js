require("dotenv").config();


const port = process.env.PORT || 4000 ;

const mongoDB_url = process.env.localUrl ;

const secretKey = process.env.jwtActivationKey || 'muktarhossainAMULTRR' ;

const accessKey = process.env.jwtAccessKey || 'dfasdferwe4gqwrwe4fs' ;
const refreshKey = process.env.jwtRefreshKey || 'refreshTokenGenarate432';
const forgetPasswordKey = process.env.resetPasswordKey || 'resetPassswordkey4520'

const smtpUserEmail = process.env.SMTP_USERNAME || '' ;
const smtpUserPassword = process.env.SMTP_PASSWORD || '' ;
const clientURL = process.env.CLIENT_URL


|| ['png','jpeg'];

module.exports = {
    port,
    mongoDB_url,
    secretKey,
    smtpUserEmail,
    smtpUserPassword,
    clientURL ,
    accessKey,
    refreshKey,
    forgetPasswordKey,
}