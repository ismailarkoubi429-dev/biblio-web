import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LivreCard from '../components/LivreCard'
import './Favoris.css'

// Page Favoris : affiche tous les livres ajoutés aux favoris
// Utilise useContext via le hook useAuth pour récupérer la liste partagée
const Favoris = () => {
  // useContext : on accède aux favoris partagés via le contexte d'authentification
  const { favoris } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="favoris-container">
      <h1 className="favoris-titre">⭐ Mes Favoris</h1>
      <p className="favoris-compteur">
        Vous avez {favoris.length} livre{favoris.length > 1 ? 's' : ''} en favori{favoris.length > 1 ? 's' : ''}
      </p>

      {favoris.length === 0 ? (
        <div className="favoris-vide">
          <p>Aucun livre en favori pour l'instant.</p>
          <button className="btn-aller-catalogue" onClick={() => navigate('/catalogue')}>
            Découvrir le catalogue
          </button>
        </div>
      ) : (
        <div className="favoris-grille">
          {favoris.map((livre) => (
            <LivreCard key={livre.id} livre={livre} modeFavori={true} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favoris
