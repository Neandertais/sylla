import Route from '@ioc:Adonis/Core/Route'

import authRoutes from 'App/Modules/Auth/routes'
import coursesRoutes from 'App/Modules/Courses/routes'
import sectionsRoutes from 'App/Modules/Sections/routes'
import usersRoutes from 'App/Modules/Users/routes'

Route.group(async () => {
  authRoutes()
  usersRoutes()
  coursesRoutes()
  sectionsRoutes()
}).prefix('api/v1')
