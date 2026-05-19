import { createBrowserRouter, redirect } from "react-router";
import { AppShell }      from "./components/AppShell";
import { DesignPage }    from "./pages/DesignPage";
import { InfoPage }      from "./pages/InfoPage";
import { LegalPage }     from "./pages/LegalPage";
import { OrderPage }     from "./pages/OrderPage";
import { CheckoutPage }  from "./pages/CheckoutPage";
import { LoginPage }     from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

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
      { path: "/",          Component: LoginPage    },
      { path: "/login",     Component: LoginPage    },
      { path: "/dashboard", Component: DashboardPage },
      { path: "/info",      Component: InfoPage     },
      { path: "/design",    Component: DesignPage   },
      { path: "/legal",     Component: LegalPage    },
      { path: "/order",     Component: OrderPage    },
      { path: "/checkout",  Component: CheckoutPage },
      { path: "*",          loader: () => redirect("/") },
    ],
  },
]);
