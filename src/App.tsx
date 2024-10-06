import { BrowserRouter, Route, Routes } from 'react-router-dom' // Importing routing components from React Router
import ModalProvider from './components/Modal' // Importing a custom Modal provider component
import Home from './pages/Home' // Importing the Home page component
import { Toaster } from 'react-hot-toast' // Importing the Toaster component for toast notifications
import User from './pages/User' // Importing the User page component

function App() {
  return (
    <BrowserRouter> {/* Wrapping the app in BrowserRouter to enable routing */}
      <ModalProvider> {/* Wrapping components with the ModalProvider to use modals across the app */}
        <Routes> {/* Defining a set of routes for the app */}
          <Route path='/' index element={<Home />} /> {/* Defining the route for the home page */}
        </Routes>
        <Routes> {/* Another set of routes for dynamic user pages */}
          <Route path='/:id' element={<User />} /> {/* Defining a dynamic route that captures an 'id' parameter */}
        </Routes>
      </ModalProvider>
      <Toaster position='top-center' /> {/* Adding a toast notification with 'top-center' positioning */}
    </BrowserRouter>
  )
}

export default App // Exporting the App component as the default export
