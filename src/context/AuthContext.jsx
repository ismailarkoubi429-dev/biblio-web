import { createContext, useContext, useState } from 'react'

// Création du contexte d'authentification
// Permet de partager l'état utilisateur et les favoris dans toute l'application
const AuthContext = createContext(null)

// Provider qui enveloppe l'application et fournit les valeurs du contexte
export const AuthProvider = ({ children }) => {
  // État de l'utilisateur connecté (null si déconnecté)
  const [utilisateur, setUtilisateur] = useState(null)
  
  // État de la liste des livres favoris (partagée entre catalogue et favoris)
  const [favoris, setFavoris] = useState([])
  
  // Liste des utilisateurs inscrits (simulée en mémoire, pas de backend)
  const [utilisateursInscrits, setUtilisateursInscrits] = useState([])

  // Fonction de connexion : vérifie l'email/mot de passe dans la liste des inscrits
  const connecter = (email, motDePasse) => {
    const userTrouve = utilisateursInscrits.find(
      (u) => u.email === email && u.motDePasse === motDePasse
    )
    if (userTrouve) {
      setUtilisateur(userTrouve)
      return true
    }
    return false
  }

  // Fonction d'inscription : ajoute un nouvel utilisateur
  const inscrire = (nom, email, motDePasse) => {
    // Vérifier si l'email existe déjà
    const dejaInscrit = utilisateursInscrits.find((u) => u.email === email)
    if (dejaInscrit) {
      return false
    }
    const nouvelUtilisateur = { nom, email, motDePasse }
    setUtilisateursInscrits((prev) => [...prev, nouvelUtilisateur])
    return true
  }

  // Fonction de déconnexion
  const deconnecter = () => {
    setUtilisateur(null)
  }

  // Ajouter un livre aux favoris (évite les doublons)
  const ajouterFavori = (livre) => {
    setFavoris((prev) => {
      if (prev.find((l) => l.id === livre.id)) {
        return prev
      }
      return [...prev, livre]
    })
  }

  // Retirer un livre des favoris
  const retirerFavori = (id) => {
    setFavoris((prev) => prev.filter((l) => l.id !== id))
  }

  // Valeurs exposées via le contexte
  const valeurs = {
    utilisateur,
    favoris,
    connecter,
    inscrire,
    deconnecter,
    ajouterFavori,
    retirerFavori,
  }

  return <AuthContext.Provider value={valeurs}>{children}</AuthContext.Provider>
}

// Hook personnalisé pour consommer le contexte plus facilement
// On utilise useContext pour récupérer les valeurs partagées
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}
