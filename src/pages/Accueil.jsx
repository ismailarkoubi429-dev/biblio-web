import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Accueil.css'

// Page d'accueil de l'application
const Accueil = () => {
  // Hook useNavigate pour rediriger l'utilisateur
  const navigate = useNavigate()
  
  // useContext pour récupérer l'utilisateur connecté (s'il existe)
  const { utilisateur } = useAuth()

  return (
    <div className="accueil-container">
      <h1 className="accueil-titre">📚 Bienvenue sur BiblioApp</h1>
      <p className="accueil-sousTitre">
        {utilisateur 
          ? `Ravi de vous revoir, ${utilisateur.nom} !` 
          : 'Votre bibliothèque en ligne préférée'}
      </p>
      <p className="accueil-texte">
        Découvrez notre collection de livres, ajoutez vos préférés à vos favoris
        et construisez votre bibliothèque personnelle.
      </p>
      <div className="accueil-boutons">
        <button className="btn-principal" onClick={() => navigate('/catalogue')}>
          Explorer le catalogue
        </button>
        {!utilisateur && (
          <button className="btn-secondaire" onClick={() => navigate('/inscription')}>
            Créer un compte
          </button>
        )}
      </div>
    </div>
  )
}

export default Accueil
