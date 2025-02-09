export interface MessageBackendInterface {
    sender_id: string,
    receiver_id?: string,
    body: string,
    chatId?: number,
}