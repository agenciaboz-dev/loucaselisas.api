const normalize = (string: string) =>
    string
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")


export default normalize
