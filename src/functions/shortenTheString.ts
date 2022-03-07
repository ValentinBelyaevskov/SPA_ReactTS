export const shortenTheString = (message: string, length: number) => (
   message.length > length ? `${message.split("").slice(0, length).join("")}...` : message
)