import Route from '@ioc:Adonis/Core/Route'

import authRoutes from 'App/Modules/Auth/routes'
import usersRoutes from 'App/Modules/Users/routes'

Route.group(async () => {
  authRoutes()
  usersRoutes()
}).prefix('api/v1')
