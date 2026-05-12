import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profil.css'

// Page Profil : affiche les informations de l'utilisateur connecté
// Démontre clairement l'utilisation de useContext
const Profil = () => {
  // useContext via le hook useAuth : récupère utilisateur, favoris, deconnecter
  const { utilisateur, favoris, deconnecter } = useAuth()
  const navigate = useNavigate()

  // useEffect : si l'utilisateur n'est pas connecté, redirection vers connexion
  useEffect(() => {
    if (!utilisateur) {
      navigate('/connexion')
    }
  }, [utilisateur, navigate])

  // Gestion de la déconnexion
  const handleDeconnexion = () => {
    deconnecter()
    navigate('/')
  }

  // Si pas d'utilisateur, on n'affiche rien (en attendant la redirection)
  if (!utilisateur) {
    return null
  }

  return (
    <div className="profil-container">
      <div className="profil-avatar">
        {utilisateur.nom.charAt(0).toUpperCase()}
      </div>
      <h1 className="profil-titre">Bonjour, {utilisateur.nom} ! 👋</h1>
      <p className="profil-email">{utilisateur.email}</p>
      
      <div className="profil-stats">
        <div className="stat-carte">
          <div className="stat-nombre">{favoris.length}</div>
          <div className="stat-label">Livre{favoris.length > 1 ? 's' : ''} en favori{favoris.length > 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="profil-actions">
        <button className="btn-catalogue" onClick={() => navigate('/catalogue')}>
          📖 Voir le catalogue
        </button>
        <button className="btn-favoris" onClick={() => navigate('/favoris')}>
          ⭐ Mes favoris
        </button>
        <button className="btn-deconnexion" onClick={handleDeconnexion}>
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default Profil
