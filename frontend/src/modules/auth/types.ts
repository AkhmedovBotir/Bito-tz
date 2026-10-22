export type StoreUser = {
  id: string
  name: string
  phone: string
  username: string
  createdAt?: string
}

export type AuthPayload = {
  token: string
  store: StoreUser
}
