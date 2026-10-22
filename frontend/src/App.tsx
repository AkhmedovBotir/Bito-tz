import { AuthProvider } from '@/modules/auth/AuthContext'
import { DialogProvider } from '@/shared/ui/DialogProvider'
import { AppRouter } from './app/router'

function App() {
  return (
    <AuthProvider>
      <DialogProvider>
        <AppRouter />
      </DialogProvider>
    </AuthProvider>
  )
}

export default App
