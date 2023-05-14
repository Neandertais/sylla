import Route from '@ioc:Adonis/Core/Route'

export default function usersRoutes() {
  Route.group(() => {
    Route.get('', 'UsersController.show')
      .middleware('auth')
      .namespace('App/Modules/Users')
      .prefix('user')

    Route.group(() => {
      Route.get('/:username', 'UsersController.find')
      Route.route('/:username', ['PATCH', 'PUT'], 'UsersController.update').middleware('auth')
    })
      .prefix('users')
      .where('username', /^[a-z0-9_]+$/)
  }).namespace('App/Modules/Users')
}
