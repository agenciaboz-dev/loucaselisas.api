import { google } from "googleapis"

export const getGoogleClient = () =>
    new google.auth.OAuth2(
        "258639917596-glojms88bv4mr3cbdsk0t66vs839t6ju.apps.googleusercontent.com", // client id
        "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", // client secret
        "https://app.agenciaboz.com.br" // redirect uri
    )
