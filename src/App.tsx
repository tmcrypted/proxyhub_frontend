import { useAuth } from './contexts/AuthContext'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

function App() {
  const { isAuthenticated, address, email, logout } = useAuth()

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Proxy Hub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Статус авторизации:</h3>
            <div className="p-3 bg-gray-100 rounded">
              <p><strong>Авторизован:</strong> {isAuthenticated ? 'Да' : 'Нет'}</p>
              {address && <p><strong>Адрес кошелька:</strong> {address}</p>}
              {email && <p><strong>Email:</strong> {email}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = '/profile'} 
                  className="w-full"
                >
                  Перейти в профиль
                </Button>
                <Button 
                  onClick={logout} 
                  variant="outline" 
                  className="w-full"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = '/auth'} 
                  className="w-full"
                >
                  Войти
                </Button>
                <Button 
                  onClick={() => window.location.href = '/register'} 
                  variant="outline" 
                  className="w-full"
                >
                  Зарегистрироваться
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
