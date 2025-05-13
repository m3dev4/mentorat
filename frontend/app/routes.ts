import { type RouteConfig, index, route } from "@react-router/dev/routes";

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
    {
        path: "pages",
        file: "routes/pages/layout.tsx",
        children: [
            {
                path: ":id/courses/my-courses/learning",
                file: "routes/pages/[id]/courses/my-courses/learning/learning.tsx",
            },
            {
                path: ":id/cart",
                file: "routes/pages/[id]/cart/cart.tsx",
            },
            {
                path: ":id/courses/whitelist",
                file: "routes/pages/[id]/courses/whitelist/whitelist.tsx",
            },
            {
                path: ":id/messages",
                file: "routes/pages/[id]/messages/messages.tsx",
            },
            {
                path: ":id/users/edit-profile",
                file: "routes/pages/[id]/users/edit-profile/editProfile.tsx",
            },
            {
                path: ":id/users/notifications",
                file: "routes/pages/[id]/users/notification/notif.tsx",
            },
            {
                path: ":id/users/purchases-history",
                file: "routes/pages/[id]/history/dashboard/history.tsx",
            },
            {
                path: ":id/users/payment-methods",
                file: "routes/pages/[id]/users/payment-methods/method.tsx",
            },
            {
                path: ":id/teaching/teach",
                file: "routes/pages/[id]/teaching/teach.tsx",
            },
        ],
    }
] satisfies RouteConfig;
