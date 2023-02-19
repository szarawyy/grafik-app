import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './features/auth/RequireAuth'
import PersistLogin from './features/auth/PersistLogin';
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import Schedule from './features/schedule/Schedule'
import LocationsList from './features/locations/LocationsList'
import AddLocation from './features/locations/AddLocation'
import EditLocation from './features/locations/EditLocation'
import TermsList from './features/terms/TermsList'
import UsersList from './features/users/UsersList'
import AddUser from './features/users/AddUser'
import AddOrder from './features/orders/AddOrder'
import ViewOrder from './features/orders/ViewOrder'
import EditOrder from './features/orders/EditOrder'
import Unauthorized from './features/auth/Unauthorized'

function App() {

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
      }
    }
  })

  return (
    <QueryClientProvider client={client}>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route path="unauthorized" element={<Unauthorized />} />

          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={['admin', 'editor', 'viewer', 'fitter']} />}>
              <Route path="dash" element={<DashLayout />}>

                <Route path="schedule" index element={<Schedule />} />
                <Route path="orders/:id" index element={<ViewOrder />} />

                <Route element={<RequireAuth allowedRoles={['admin', 'editor']} />}>
                  <Route index element={<Welcome />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={['admin', 'editor']} />}>
                  <Route path="orders/add" index element={<AddOrder />} />
                  <Route path="orders/edit/:id" index element={<EditOrder />} />
                  <Route path="locations" index element={<LocationsList />} />
                  <Route path="locations/add" index element={<AddLocation />} />
                  <Route path="locations/:id" index element={<EditLocation />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={['admin']} />}>
                  <Route path="terms" index element={<TermsList />} />
                  <Route path="users" index element={<UsersList />} />
                  <Route path="users/add" index element={<AddUser />} />
                </Route>

              </Route>{/* End Dash */}
            </Route>{/* End RequireAuth */}
          </Route>{/* End PersistLogin */}
        </Route>
      </Routes>
    </QueryClientProvider >
  )
}

export default App
