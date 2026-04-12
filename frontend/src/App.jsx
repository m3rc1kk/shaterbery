import AppRouter from './routes/AppRouter.jsx';
import { AuthProvider } from './auth/AuthProvider.jsx';
import { CityProvider } from './context/CityContext.jsx';

function App() {
    return (
        <CityProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </CityProvider>
    );
}

export default App;
