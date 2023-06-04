import Route from '@ioc:Adonis/Core/Route'

import authRoutes from 'App/Modules/Auth/routes'
import coursesRoutes from 'App/Modules/Courses/routes'
import sectionsRoutes from 'App/Modules/Sections/routes'
import usersRoutes from 'App/Modules/Users/routes'
import videosRoutes from 'App/Modules/Videos/routes'

Route.group(async () => {
  authRoutes()
  usersRoutes()
  coursesRoutes()
  sectionsRoutes()
  videosRoutes()
}).prefix('api/v1')
