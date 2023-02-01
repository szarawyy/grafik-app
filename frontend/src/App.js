import RequireAuth from './components/RequireAuth'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import TermsList from './features/terms/TermsList'
import UsersList from './features/users/UsersList'
import Schedule from './features/schedule/Schedule'
import OrdersList from './features/orders/OrdersList'
import AddOrder from './features/orders/AddOrder'
import ViewOrder from './features/orders/ViewOrder'
import EditOrder from './features/orders/EditOrder'
import LocationsList from './features/locations/LocationsList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PersistLogin from './components/PersistLogin';


function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={['admin', 'editor', 'viewer', 'fitter']} />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route path="schedule">
                  <Route index element={<Schedule />} />
                </Route>

                <Route path="orders/:id">
                    <Route index element={<ViewOrder />} />
                  </Route>

                <Route element={<RequireAuth allowedRoles={[ 'admin', 'editor', 'viewer']} />}>
                  <Route path="terms">
                    <Route index element={<TermsList />} />
                  </Route>

                  <Route path="users">
                    <Route index element={<UsersList />} />
                  </Route>

                  <Route path="orders">
                    <Route index element={<OrdersList />} />
                  </Route>

                  <Route path="orders/add">
                    <Route index element={<AddOrder />} />
                  </Route>

                  <Route path="orders/edit/:id">
                    <Route index element={<EditOrder />} />
                  </Route>

                  <Route path="locations">
                    <Route index element={<LocationsList />} />
                  </Route>
                </Route>
              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;