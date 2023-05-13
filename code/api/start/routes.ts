import Route from '@ioc:Adonis/Core/Route'

import authRoutes from 'App/Modules/Auth/routes'

Route.group(async () => {
  authRoutes()
}).prefix('api/v1')
