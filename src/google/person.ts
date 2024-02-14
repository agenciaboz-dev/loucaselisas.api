import { people_v1 } from "@googleapis/people"
import { OAuth2Client } from "google-auth-library"
import { Socket } from "socket.io"
import { User } from "@prisma/client"
import { People } from "../types/google/People"

const getPerson = (socket: Socket, accessToken: string) => {
    const oAuth2Client = new OAuth2Client()
    oAuth2Client.setCredentials({
        access_token: accessToken,
        // refresh_token: 'YOUR_REFRESH_TOKEN'
    })

    const people = new people_v1.People({
        auth: oAuth2Client,
    })

    console.log(people)

    return new Promise<People>((resolve, reject) => {
        people.people.get(
            {
                resourceName: "people/me",
                personFields: "metadata,names,emailAddresses,photos,biographies,birthdays,genders,locales",
            },
            (error, response) => {
                if (error) {
                    reject(error)
                    return
                }

                const person = response?.data

                if (person) {
                    const personData: People = {
                        googleId: person.resourceName,
                        name: person.names ? person.names[0].displayName : null,
                        emails: person.emailAddresses?.filter((item) => !!item?.value).map((item) => item.value!),
                        photo: person.photos ? person.photos[0].url : null,
                        birthday: person.birthdays ? person.birthdays[0].date : null,
                        phone: person.phoneNumbers ? person.phoneNumbers[0].value : null,
                    }

                    resolve(personData)
                } else {
                    reject(new Error("No data returned from Google People API"))
                }
            }
        )
    })
}

const link = (socket: Socket, user: User) => {
    // save google id into user data
}

export default { getPerson, link }
