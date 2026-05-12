import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Accueil from './pages/Accueil'
import Catalogue from './pages/Catalogue'
import Favoris from './pages/Favoris'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Profil from './pages/Profil'
import './App.css'

// Composant principal de l'application
// On enveloppe toute l'app dans AuthProvider pour partager l'état utilisateur via useContext
// BrowserRouter active la navigation côté client (React Router DOM v6)
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          {/* Barre de navigation présente sur toutes les pages */}
          <Navbar />
          <main className="main-content">
            {/* Définition des routes de l'application */}
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/favoris" element={<Favoris />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/profil" element={<Profil />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
