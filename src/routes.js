import { Index } from './views/index'
import { Home } from './views/home'
import { Board } from './views/board'
import { LoginSignup } from './views/login-signup'
import { UserWork } from './views/user-work'


export default [
    {
        path: '',
        component: <Index />,
    },
    {
        path: '/home',
        component: <Home />,
    },
    {
        path: '/board/:boardId',
        component: <Board />,
    },
    {
        path: '/login',
        component: <LoginSignup />,
    },
    {
        path: '/my-work',
        component: <UserWork />,
    },
    // {
    //     path: '/profile',
    //     component: <UserProfile />,
    //     children: [
    //         {
    //             path: '/profile/settings',
    //             component: <UserSettings />,
    //         },
    //         {
    //             path: '/profile/signup',
    //             component: <UserSignup />,
    //         },
    //         {
    //             path: '/profile/login',
    //             component: <UserLogin />,
    //         },
    //     ]
    // },
]