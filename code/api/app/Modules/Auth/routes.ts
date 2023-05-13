import Route from '@ioc:Adonis/Core/Route'

export default function authRoutes() {
  Route.group(() => {
    Route.post('/signup', 'AuthController.signup')
    Route.post('/signin', 'AuthController.signin')
    Route.post('/logout', 'AuthController.logout').middleware('auth')
  })
    .namespace('App/Modules/Auth')
    .prefix('auth')
}
