import AppRouter from './routes/AppRouter.jsx';
import { AuthProvider } from './auth/AuthProvider.jsx';

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;
