import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/User/auth_controller')

export default function (router:any) {
    //user auth routes
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.group(() => {
        router.post('/me', [AuthController, 'me'])
        router.delete('/logout', [AuthController, 'logout'])
    }).use(middleware.auth())
    //end auth router
    router.get('/test', [AuthController, 'test'])
}


