import { upsertUser } from '../repositories/user.repository.js'

export const getOrCreateUser = async ({ sub, email, name, picture }) => {
  if (!sub) throw new Error('Token inválido: no contiene sub')

  const user = await upsertUser({
    auth0Id: sub,
    email,
    name,
    picture
  })

  return user
}
