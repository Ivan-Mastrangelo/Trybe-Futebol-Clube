export default interface ILogin {
  user: {
    id: number
    username: string
    role: string
    email: string
  },
  token: string
}
