import LoginPage from "../auth/login"
import IndexPage from "../pages/ActkeysPage"
import UserPage from "../pages"

import DetailPage from "../pages/detail"
import DevicePage from "../pages/device"
import Documentation from '../pages/Documentation'
import AllAppPage from "../pages/allapps"
import RegisterPage from "../auth/register"
import DomainsPage from "../pages/DomainsPage"
import HomePage from "../pages"
import ActkeysPage from "../pages/ActkeysPage"
import UsersPage from "../pages/UsersPage"

const routeConfigs = [
    { path: "/auth/login", element: <LoginPage /> },
    { path: "/auth/register", element: <RegisterPage/> },
    { path: '/documentation/:name', element: <Documentation/>}
]

const PrivateRoute = [
    // { path: "/", element: <UserPage/> },
    { path: "/", element: <DomainsPage/> },
    { path: "/dusers/:id", element: <UsersPage/> },
    { path: "/dactkeys/:id", element: <ActkeysPage/> },
    { path: "/dash/:id", element: <ActkeysPage/> },
    { path: "/detail/:id", element: <DetailPage/> },
    { path: "/device/:id", element: <DevicePage/> },
    { path: "/allapp/:id", element: <AllAppPage/> }
]

export default {
    NormalRoutes : routeConfigs,
    PrivateRoutes : PrivateRoute
};