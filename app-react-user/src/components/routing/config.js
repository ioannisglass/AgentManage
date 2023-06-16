import LoginPage from "../auth/login"
import IndexPage from "../pages/actkey"
import UserPage from "../pages"

import DetailPage from "../pages/detail"
import DevicePage from "../pages/device"
import Documentation from '../pages/Documentation'
import AllAppPage from "../pages/allapps"

const routeConfigs = [
    { path: "/auth/login", element: <LoginPage /> },
    { path: "/auth/register", element: null },
    { path: '/documentation/:name', element: <Documentation/>}
]

const PrivateRoute = [
    { path: "/", element: <UserPage/> },
    { path: "/dash/:id", element: <IndexPage/> },
    { path: "/detail/:id", element: <DetailPage/> },
    { path: "/device/:id", element: <DevicePage/> },
    { path: "/allapp/:id", element: <AllAppPage/> }
]

export default {
    NormalRoutes : routeConfigs,
    PrivateRoutes : PrivateRoute
};