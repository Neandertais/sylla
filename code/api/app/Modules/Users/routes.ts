import Route from '@ioc:Adonis/Core/Route'

export default function usersRoutes() {
  Route.group(() => {
    Route.resource("users", "UsersController")
      .paramFor("users", "username")
      .only(["index", "show", "update"])
      .middleware({ index: ["auth"], update: ["auth"] });
  }).namespace("App/Modules/Users");
}
