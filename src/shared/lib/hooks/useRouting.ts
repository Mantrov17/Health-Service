import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routesConfig from "../../../app/routesConfigDto.json";

type Page = "home" | "booking" | "appointments" | "profile";

interface RouteConfig {
  path: string;
  name: string;
  key: Page;
  component: string;
}

export const useRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = routesConfig.routes as RouteConfig[];

  const currentPage = useMemo((): Page => {
    const route = routes.find((r) => r.path === location.pathname);
    return route?.key || "home";
  }, [location.pathname, routes]);

  const navigateTo = (page: Page) => {
    const route = routes.find((r) => r.key === page);
    if (route) {
      navigate(route.path);
    }
  };

  const getRouteByKey = (key: Page) => {
    return routes.find((r) => r.key === key);
  };

  return {
    currentPage,
    navigateTo,
    routes,
    getRouteByKey,
  };
};
