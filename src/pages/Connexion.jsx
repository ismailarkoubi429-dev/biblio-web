import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Connexion.css'

// Page de connexion avec validation et focus automatique
const Connexion = () => {
  // useState : valeurs du formulaire et erreurs
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreurs, setErreurs] = useState({})
  const [enCours, setEnCours] = useState(false)
  
  // useRef : référence vers l'input email pour focus automatique
  const emailRef = useRef(null)
  
  // useContext via le hook useAuth pour la fonction de connexion
  const { connecter } = useAuth()
  
  // useNavigate : pour rediriger après connexion réussie
  const navigate = useNavigate()

  // useEffect : focus automatique sur le champ email au montage du composant
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus()
    }
  }, [])

  // Fonction de validation du formulaire
  const validerFormulaire = () => {
    const nouvellesErreurs = {}
    
    // Validation de l'email
    if (!email.trim()) {
      nouvellesErreurs.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nouvellesErreurs.email = "Le format de l'email est invalide"
    }
    
    // Validation du mot de passe
    if (!motDePasse) {
      nouvellesErreurs.motDePasse = 'Le mot de passe est requis'
    } else if (motDePasse.length < 6) {
      nouvellesErreurs.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    setErreurs(nouvellesErreurs)
    return Object.keys(nouvellesErreurs).length === 0
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    setEnCours(true)
    
    if (validerFormulaire()) {
      // Simule un délai de connexion
      setTimeout(() => {
        const succes = connecter(email, motDePasse)
        if (succes) {
          // Connexion réussie : on redirige vers le profil
          navigate('/profil')
        } else {
          setErreurs({ auth: 'Email ou mot de passe incorrect' })
        }
        setEnCours(false)
      }, 600)
    } else {
      setEnCours(false)
    }
  }

  return (
    <div className="connexion-container">
      <form className="connexion-form" onSubmit={handleSubmit}>
        <h2>🔐 Connexion</h2>
        
        {erreurs.auth && (
          <div className="erreur-globale">{erreurs.auth}</div>
        )}

        <div className="champ-groupe">
          <label>Email</label>
          <input
            ref={emailRef}
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={erreurs.email ? 'champ-erreur' : ''}
          />
          {erreurs.email && <span className="texte-erreur">{erreurs.email}</span>}
        </div>

        <div className="champ-groupe">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className={erreurs.motDePasse ? 'champ-erreur' : ''}
          />
          {erreurs.motDePasse && <span className="texte-erreur">{erreurs.motDePasse}</span>}
        </div>

        <button type="submit" className="bouton-connexion" disabled={enCours}>
          {enCours ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="lien-inscription">
          Pas encore de compte ? <Link to="/inscription">Inscrivez-vous</Link>
        </p>
      </form>
    </div>
  )
}

export default Connexion
