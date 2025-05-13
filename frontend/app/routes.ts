import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    {
        path: "auth",
        file: "routes/auth/layout.tsx",
        children: [
            {
                path: "login",
                file: "routes/auth/login/login.tsx",
            },
            {
                path: "register",
                file: "routes/auth/register/register.tsx",
            },
            {
                path: "verify-email/:token",
                file: "routes/auth/emailVerify/verify-email.tsx",
            },
        ],
    },
] satisfies RouteConfig;
