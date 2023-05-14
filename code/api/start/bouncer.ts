import Bouncer from '@ioc:Adonis/Addons/Bouncer'

import User from 'App/Models/User'

export const { actions } = Bouncer.define('updateUser', (user: User, updateUser: User) => {
  return user.username === updateUser.username
})

export const { policies } = Bouncer.registerPolicies({})
