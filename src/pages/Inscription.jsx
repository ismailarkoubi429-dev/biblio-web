import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Inscription.css'

// Page d'inscription avec validation complète des champs
const Inscription = () => {
  // useState : données du formulaire regroupées dans un seul objet
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    confirmation: '',
  })
  
  // useState : erreurs de validation
  const [erreurs, setErreurs] = useState({})
  const [succes, setSucces] = useState(false)
  
  // useRef : référence vers le premier champ (nom) pour focus auto
  const nomRef = useRef(null)
  
  // useContext via le hook useAuth
  const { inscrire } = useAuth()
  const navigate = useNavigate()

  // useEffect : focus automatique sur le champ nom
  useEffect(() => {
    if (nomRef.current) {
      nomRef.current.focus()
    }
  }, [])

  // Fonction de mise à jour générique pour tous les champs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Validation détaillée du formulaire
  const validerFormulaire = () => {
    const nouvellesErreurs = {}
    
    // Validation du nom
    if (!formData.nom.trim()) {
      nouvellesErreurs.nom = 'Le nom est requis'
    } else if (formData.nom.trim().length < 3) {
      nouvellesErreurs.nom = 'Le nom doit contenir au moins 3 caractères'
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      nouvellesErreurs.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nouvellesErreurs.email = "Le format de l'email est invalide"
    }
    
    // Validation du mot de passe : 6 caractères + majuscule + chiffre + symbole
    if (!formData.motDePasse) {
      nouvellesErreurs.motDePasse = 'Le mot de passe est requis'
    } else if (formData.motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = 'Au moins 6 caractères'
    } else if (!/[A-Z]/.test(formData.motDePasse)) {
      nouvellesErreurs.motDePasse = 'Doit contenir une majuscule'
    } else if (!/\d/.test(formData.motDePasse)) {
      nouvellesErreurs.motDePasse = 'Doit contenir un chiffre'
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.motDePasse)) {
      nouvellesErreurs.motDePasse = 'Doit contenir un symbole'
    }
    
    // Validation de la confirmation
    if (!formData.confirmation) {
      nouvellesErreurs.confirmation = 'Veuillez confirmer le mot de passe'
    } else if (formData.confirmation !== formData.motDePasse) {
      nouvellesErreurs.confirmation = 'Les mots de passe ne correspondent pas'
    }
    
    setErreurs(nouvellesErreurs)
    return Object.keys(nouvellesErreurs).length === 0
  }

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    setSucces(false)
    
    if (validerFormulaire()) {
      const inscriptionOK = inscrire(formData.nom, formData.email, formData.motDePasse)
      if (inscriptionOK) {
        setSucces(true)
        // Réinitialisation du formulaire
        setFormData({ nom: '', email: '', motDePasse: '', confirmation: '' })
        // Redirection vers la connexion après 1,5s
        setTimeout(() => navigate('/connexion'), 1500)
      } else {
        setErreurs({ email: 'Cet email est déjà utilisé' })
      }
    }
  }

  return (
    <div className="inscription-container">
      <form className="inscription-form" onSubmit={handleSubmit}>
        <h2>✍️ Inscription</h2>
        
        {succes && (
          <div className="message-succes">
            Inscription réussie ! Redirection vers la connexion...
          </div>
        )}

        <div className="champ-groupe">
          <label>Nom</label>
          <input
            ref={nomRef}
            type="text"
            name="nom"
            placeholder="Votre nom"
            value={formData.nom}
            onChange={handleChange}
            className={erreurs.nom ? 'champ-erreur' : ''}
          />
          {erreurs.nom && <span className="texte-erreur">{erreurs.nom}</span>}
        </div>

        <div className="champ-groupe">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
            className={erreurs.email ? 'champ-erreur' : ''}
          />
          {erreurs.email && <span className="texte-erreur">{erreurs.email}</span>}
        </div>

        <div className="champ-groupe">
          <label>Mot de passe</label>
          <input
            type="password"
            name="motDePasse"
            placeholder="6+ car., 1 majuscule, 1 chiffre, 1 symbole"
            value={formData.motDePasse}
            onChange={handleChange}
            className={erreurs.motDePasse ? 'champ-erreur' : ''}
          />
          {erreurs.motDePasse && <span className="texte-erreur">{erreurs.motDePasse}</span>}
        </div>

        <div className="champ-groupe">
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmation"
            placeholder="••••••••"
            value={formData.confirmation}
            onChange={handleChange}
            className={erreurs.confirmation ? 'champ-erreur' : ''}
          />
          {erreurs.confirmation && <span className="texte-erreur">{erreurs.confirmation}</span>}
        </div>

        <button type="submit" className="bouton-inscription">
          S'inscrire
        </button>

        <p className="lien-connexion">
          Déjà un compte ? <Link to="/connexion">Connectez-vous</Link>
        </p>
      </form>
    </div>
  )
}

export default Inscription
