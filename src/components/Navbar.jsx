import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

// Barre de navigation présente sur toutes les pages
// Utilise Link de react-router-dom pour la navigation côté client
const Navbar = () => {
  // useLocation permet de savoir sur quelle page on est (pour le style "actif")
  const location = useLocation()
  
  // useContext via le hook useAuth pour savoir si un utilisateur est connecté
  const { utilisateur, deconnecter, favoris } = useAuth()

  // Fonction utilitaire pour appliquer la classe "active"
  const estActif = (chemin) => location.pathname === chemin

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        📚 BiblioApp
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-link ${estActif('/') ? 'active' : ''}`}>
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/catalogue" className={`nav-link ${estActif('/catalogue') ? 'active' : ''}`}>
            Catalogue
          </Link>
        </li>
        <li>
          <Link to="/favoris" className={`nav-link ${estActif('/favoris') ? 'active' : ''}`}>
            Favoris ({favoris.length})
          </Link>
        </li>

        {/* Affichage conditionnel selon l'état de connexion */}
        {utilisateur ? (
          <>
            <li>
              <Link to="/profil" className={`nav-link ${estActif('/profil') ? 'active' : ''}`}>
                Profil
              </Link>
            </li>
            <li>
              <button className="nav-link logout-btn" onClick={deconnecter}>
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/connexion" className={`nav-link ${estActif('/connexion') ? 'active' : ''}`}>
                Connexion
              </Link>
            </li>
            <li>
              <Link to="/inscription" className={`nav-link ${estActif('/inscription') ? 'active' : ''}`}>
                Inscription
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
