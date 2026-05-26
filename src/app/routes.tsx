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
      { path: "/",          loader: () => redirect("/v2") },
      { path: "/login",     Component: LoginPage    },
      { path: "/dashboard", Component: DashboardPage },
      { path: "/info",      Component: InfoPage     },
      { path: "/design",    Component: DesignPage   },
      { path: "/legal",     Component: LegalPage    },
      { path: "/order",     Component: OrderPage    },
      { path: "/checkout",  Component: CheckoutPage },
      { path: "*",          loader: () => redirect("/v2") },
    ],
  },
  {
    Component: AppShellV2,
    children: [
      { path: "/v2",             Component: LandingPage       },
      { path: "/v2/order",       Component: OrderContentsPage },
      { path: "/v2/design",      Component: DesignPageV2      },
      { path: "/v2/signup",      Component: SignUpPage        },
      { path: "/v2/compliance",  Component: CompliancePage    },
      { path: "/v2/confirm",     Component: ConfirmPage       },
    ],
  },
]);
