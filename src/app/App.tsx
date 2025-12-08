import styles from "./styles/styles.module.scss";
import { HomePage } from "../pages/HomePage";
import { Navbar } from "../shared/NavBar/ui";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import routesConfig from "./routesConfigDto.json";
import { DoctorListPage } from "../pages/DoctorListPage";
import { AppointmentListPage } from "../pages/AppointmentListPage";
import { AppointmentsProvider } from "./providers/AppointmentsProvider.tsx";
import { ProfilePage } from "../pages/ProfilePage";

interface RouteConfig {
  path: string;
  name: string;
  key: string;
  component: string;
}

function App() {
  const routes = routesConfig.routes as RouteConfig[];

  return (
    <AppointmentsProvider>
      <BrowserRouter>
        <div className={styles.app}>
          <Navbar />
          <main className={styles.appMain}>
            <Routes>
              {routes.map((route) => {
                let Component;
                switch (route.component) {
                  case "HomePage":
                    Component = HomePage;
                    break;
                  case "DoctorListPage":
                    Component = DoctorListPage;
                    break;
                  case "AppointmentListPage":
                    Component = AppointmentListPage;
                    break;
                  case "ProfilePage":
                    Component = ProfilePage;
                    break;
                  default:
                    Component = HomePage;
                }

                return (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={<Component />}
                  />
                );
              })}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppointmentsProvider>
  );
}

export default App;
