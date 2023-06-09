import Route from "@ioc:Adonis/Core/Route";

export default function authenticationRouter() {
  Route.group(() => {
    Route.post("signup", "AuthenticationController.signUp");
    Route.post("login", "AuthenticationController.signIn");
    Route.post("used", "AuthenticationController.alreadyUsed");
    Route.post("logout", "AuthenticationController.logOut").middleware("auth");
  })
    .namespace("App/Modules/Authentication")
    .prefix("auth");
}
