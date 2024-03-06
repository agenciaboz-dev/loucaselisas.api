export let env: "dev" | "prod" = "dev"

export const setProd = () => {
    env = "prod"
}
