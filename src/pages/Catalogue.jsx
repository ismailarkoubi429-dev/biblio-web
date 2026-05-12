import { useState, useEffect } from 'react'
import LivreCard from '../components/LivreCard'
import { livres as livresData } from '../data/livres'
import './Catalogue.css'

// Page catalogue : affiche tous les livres avec une barre de recherche
const Catalogue = () => {
  // useState : liste complète des livres chargés
  const [livres, setLivres] = useState([])
  
  // useState : texte de recherche
  const [recherche, setRecherche] = useState('')
  
  // useState : état de chargement
  const [chargement, setChargement] = useState(true)

  // useEffect : simule un chargement asynchrone des livres au montage du composant
  useEffect(() => {
    // On simule un appel API avec un setTimeout
    const timer = setTimeout(() => {
      setLivres(livresData)
      setChargement(false)
    }, 500)

    // Nettoyage : on annule le timer si le composant est démonté
    return () => clearTimeout(timer)
  }, [])

  // Filtre les livres selon la recherche (par titre ou auteur)
  const livresFiltres = livres.filter(
    (livre) =>
      livre.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="catalogue-container">
      <h1 className="catalogue-titre">📖 Catalogue des livres</h1>
      <p className="catalogue-sousTitre">
        Découvrez notre sélection et ajoutez vos préférés aux favoris
      </p>

      {/* Barre de recherche */}
      <input
        type="text"
        className="catalogue-recherche"
        placeholder="🔍 Rechercher par titre ou auteur..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      {/* Affichage selon l'état */}
      {chargement ? (
        <p className="catalogue-message">Chargement des livres...</p>
      ) : livresFiltres.length === 0 ? (
        <p className="catalogue-message">Aucun livre ne correspond à votre recherche.</p>
      ) : (
        <div className="catalogue-grille">
          {livresFiltres.map((livre) => (
            <LivreCard key={livre.id} livre={livre} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Catalogue
