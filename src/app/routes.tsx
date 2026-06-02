import { createBrowserRouter, redirect } from "react-router";
import { AppShell }      from "./components/AppShell";
import { DesignPage }    from "./pages/DesignPage";
import { InfoPage }      from "./pages/InfoPage";
import { LegalPage }     from "./pages/LegalPage";
import { OrderPage }     from "./pages/OrderPage";
import { CheckoutPage }  from "./pages/CheckoutPage";
import { LoginPage }     from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AppShellV2 }        from "./components/AppShellV2";
import { LandingPage }       from "./pages/v2/LandingPage";
import { OrderContentsPage } from "./pages/v2/OrderContentsPage";
import { DesignPageV2 }      from "./pages/v2/DesignPageV2";
import { SignUpPage }        from "./pages/v2/SignUpPage";
import { CompliancePage }    from "./pages/v2/CompliancePage";
import { ConfirmPage }       from "./pages/v2/ConfirmPage";
import { DashboardPageV2 }   from "./pages/v2/DashboardPageV2";

export const STAGES = [
  { path: "info",     label: "Info"     },
  { path: "design",   label: "Design"   },
  { path: "legal",    label: "Legal"    },
  { path: "order",    label: "Order"    },
  { path: "checkout", label: "Checkout" },
] as const;

export type StagePath = typeof STAGES[number]["path"];

export const router = createBrowserRouter([
  {
    Component: AppShell,
    children: [
      { path: "/login",     Component: LoginPage    },
    ],
  },
  {
    path: "/v1",
    Component: AppShell,
    children: [
      { path: "/v1",          loader: () => redirect("/v1/info") },
      { path: "/v1/dashboard", Component: DashboardPage },
      { path: "/v1/info",     Component: InfoPage     },
      { path: "/v1/design",   Component: DesignPage   },
      { path: "/v1/legal",    Component: LegalPage    },
      { path: "/v1/order",    Component: OrderPage    },
      { path: "/v1/checkout", Component: CheckoutPage },
    ],
  },
  {
    Component: AppShellV2,
    children: [
      { path: "/",             Component: LandingPage       },
      { path: "/v2",           loader: () => redirect("/")  },
      { path: "/v2/*",          loader: () => redirect("/")  },
      { path: "/order",        Component: OrderContentsPage },
      { path: "/design",       Component: DesignPageV2      },
      { path: "/signup",       Component: SignUpPage        },
      { path: "/compliance",   Component: CompliancePage    },
      { path: "/confirm",      Component: ConfirmPage       },
      { path: "/dashboard",    Component: DashboardPageV2   },
      { path: "*",             loader: () => redirect("/")  },
    ],
  },
]);
