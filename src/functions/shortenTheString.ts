export const shortenTheString = (string: string, length: number) => (
   string.length > length ? `${string.split("").slice(0, length).join("")}...` : string
)