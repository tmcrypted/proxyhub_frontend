import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root-route";
import { BuyForm } from "../../pages/Buy/Buy";

export const buyRoute = BuyForm(rootRoute); 