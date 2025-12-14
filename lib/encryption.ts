import Cryptr from "cryptr"

const encryptionKey = process.env.ENCRYPTION_KEY || "default_secret_key"
const cryptr = new Cryptr(encryptionKey)
export const encrypt = (data: string): string => {
    return cryptr.encrypt(data)
}
export const decrypt = (encryptedData: string): string => {
    return cryptr.decrypt(encryptedData)
}