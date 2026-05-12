import { useAuth } from '../context/AuthContext'
import './LivreCard.css'

// Composant carte de livre
// Affiche les informations d'un livre + bouton pour gérer les favoris
const LivreCard = ({ livre, modeFavori = false }) => {
  // useContext via le hook useAuth pour accéder aux favoris
  const { favoris, ajouterFavori, retirerFavori } = useAuth()
  
  // Vérifie si ce livre est déjà dans les favoris
  const estFavori = favoris.some((l) => l.id === livre.id)

  // Gère le clic sur le bouton (ajouter ou retirer selon le contexte)
  const gererClic = () => {
    if (modeFavori || estFavori) {
      retirerFavori(livre.id)
    } else {
      ajouterFavori(livre)
    }
  }

  return (
    <div className="livre-card">
      <img src={livre.image} alt={livre.titre} className="livre-image" />
      <div className="livre-info">
        <h3 className="livre-titre">{livre.titre}</h3>
        <p className="livre-auteur">{livre.auteur}</p>
        <p className="livre-description">{livre.description}</p>
        <div className="livre-bottom">
          <span className="livre-prix">{livre.prix}</span>
          <button
            className={`livre-btn ${estFavori || modeFavori ? 'btn-retirer' : 'btn-ajouter'}`}
            onClick={gererClic}
          >
            {modeFavori || estFavori ? '🗑️ Retirer' : '⭐ Favori'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LivreCard
