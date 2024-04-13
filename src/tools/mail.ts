import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

const transporter = nodemailer.createTransport({
    host: "agencyboz.com",
    port: 587,
    secure: false,
    auth: {
        user: "casaludica@agencyboz.com",
        pass: "E-EnLa^4!uc9K9fA",
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
})

export const sendMail = async (destination: string[], subject: string, text?: string, html?: string, attachments?: Mail.Attachment[]) => {
    const mailOptions: Mail.Options = {
        from: "Loucas e Lisas <ead@loucaselisas.com.br>",
        to: destination,
        subject,
        html,
        text,
        attachments,
    }

    try {
        const response = await transporter.sendMail(mailOptions)
        return response
    } catch (error) {
        console.log("error sending mail")
        console.log({ destination })
        console.log(error)
    }
}
