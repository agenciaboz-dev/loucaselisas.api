export let env: "dev" | "prod" = "dev"
export const website_url = "https://painel.loucaseco.com.br"

export const setProd = () => {
    env = "prod"
}
