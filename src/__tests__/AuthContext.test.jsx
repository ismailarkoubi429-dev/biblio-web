// ============================================================
// TESTS UNITAIRES — AuthContext.jsx
// On teste les fonctions du contexte de manière ISOLÉE :
// inscrire(), connecter(), deconnecter(), ajouterFavori(), retirerFavori()
// ============================================================

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../context/AuthContext'

// ─── Composant utilitaire avec boutons dédiés ────────────────────────────────
// Chaque bouton correspond à une action → les mises à jour d'état React
// se propagent bien entre chaque clic (pas de problème de closure stale)
const TestInscrire = ({ email1 = 'alice@test.com', email2 = 'alice@test.com' }) => {
  const ctx = useAuth()
  return (
    <div>
      <button onClick={() => ctx.inscrire('Alice', email1, 'Azerty1!')}>inscrire1</button>
      <button onClick={() => ctx.inscrire('Bob', email2, 'Autre1!')}>inscrire2</button>
      <div data-testid="nb-inscrits">{ctx.utilisateur ? ctx.utilisateur.nom : 'aucun'}</div>
    </div>
  )
}

const TestConnecter = () => {
  const ctx = useAuth()
  return (
    <div>
      <button onClick={() => ctx.inscrire('Bob', 'bob@test.com', 'Secure1!')}>inscrire</button>
      <button onClick={() => ctx.connecter('bob@test.com', 'Secure1!')}>connecter-ok</button>
      <button onClick={() => ctx.connecter('bob@test.com', 'MauvaisMotDePasse')}>connecter-mauvais</button>
      <button onClick={() => ctx.connecter('inexistant@test.com', 'Azerty1!')}>connecter-inexistant</button>
      <button onClick={() => ctx.deconnecter()}>deconnecter</button>
      <div data-testid="user">{ctx.utilisateur ? ctx.utilisateur.nom : 'null'}</div>
    </div>
  )
}

const TestFavoris = () => {
  const ctx = useAuth()
  const livre1 = { id: '1', titre: 'Le Petit Prince' }
  const livre2 = { id: '2', titre: '1984' }
  return (
    <div>
      <button onClick={() => ctx.ajouterFavori(livre1)}>ajouter1</button>
      <button onClick={() => ctx.ajouterFavori(livre2)}>ajouter2</button>
      <button onClick={() => ctx.ajouterFavori(livre1)}>ajouter1-doublon</button>
      <button onClick={() => ctx.retirerFavori('1')}>retirer1</button>
      <div data-testid="nb-favoris">{ctx.favoris.length}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 1 — Tests de la fonction inscrire()
// ─────────────────────────────────────────────────────────────────────────────
describe('inscrire() — Tests unitaires', () => {

  it('doit retourner true lors de la première inscription', async () => {
    let r1
    const Wrapper = () => {
      const ctx = useAuth()
      return <button onClick={() => { r1 = ctx.inscrire('Alice', 'alice@test.com', 'Azerty1!') }}>go</button>
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    await userEvent.click(screen.getByText('go'))
    expect(r1).toBe(true)
  })

  it('doit retourner false si l\'email est déjà utilisé', async () => {
    let r2
    const Wrapper = () => {
      const ctx = useAuth()
      return (
        <>
          <button onClick={() => ctx.inscrire('Alice', 'alice@test.com', 'Azerty1!')}>inscrire1</button>
          <button onClick={() => { r2 = ctx.inscrire('Bob', 'alice@test.com', 'Autre1!') }}>inscrire2</button>
        </>
      )
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    // Premier clic → Alice est inscrite (état mis à jour)
    await userEvent.click(screen.getByText('inscrire1'))
    // Deuxième clic → Bob tente le même email → doit retourner false
    await userEvent.click(screen.getByText('inscrire2'))
    expect(r2).toBe(false)
  })

  it('l\'utilisateur est null avant toute connexion', async () => {
    const Wrapper = () => {
      const ctx = useAuth()
      return <div data-testid="u">{ctx.utilisateur ? 'connecte' : 'null'}</div>
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    expect(screen.getByTestId('u')).toHaveTextContent('null')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 2 — Tests de la fonction connecter()
// ─────────────────────────────────────────────────────────────────────────────
describe('connecter() — Tests unitaires', () => {

  it('doit retourner true avec des identifiants valides (après inscription)', async () => {
    let resultat
    const Wrapper = () => {
      const ctx = useAuth()
      return (
        <>
          <button onClick={() => ctx.inscrire('Bob', 'bob@test.com', 'Secure1!')}>inscrire</button>
          <button onClick={() => { resultat = ctx.connecter('bob@test.com', 'Secure1!') }}>connecter</button>
        </>
      )
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    await userEvent.click(screen.getByText('inscrire'))
    await userEvent.click(screen.getByText('connecter'))
    expect(resultat).toBe(true)
  })

  it('doit retourner false avec un mauvais mot de passe', async () => {
    let resultat
    const Wrapper = () => {
      const ctx = useAuth()
      return (
        <>
          <button onClick={() => ctx.inscrire('Bob', 'bob@test.com', 'Secure1!')}>inscrire</button>
          <button onClick={() => { resultat = ctx.connecter('bob@test.com', 'MauvaisMotDePasse') }}>connecter-mauvais</button>
        </>
      )
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    await userEvent.click(screen.getByText('inscrire'))
    await userEvent.click(screen.getByText('connecter-mauvais'))
    expect(resultat).toBe(false)
  })

  it('doit retourner false avec un email inexistant', async () => {
    let resultat
    const Wrapper = () => {
      const ctx = useAuth()
      return <button onClick={() => { resultat = ctx.connecter('inexistant@test.com', 'Azerty1!') }}>go</button>
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    await userEvent.click(screen.getByText('go'))
    expect(resultat).toBe(false)
  })

  it('l\'utilisateur est null avant toute connexion', async () => {
    const Wrapper = () => {
      const ctx = useAuth()
      return <div data-testid="u">{ctx.utilisateur ? ctx.utilisateur.nom : 'null'}</div>
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    expect(screen.getByTestId('u')).toHaveTextContent('null')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 3 — Tests de la fonction deconnecter()
// ─────────────────────────────────────────────────────────────────────────────
describe('deconnecter() — Tests unitaires', () => {

  it('doit remettre l\'utilisateur à null après déconnexion', async () => {
    const Wrapper = () => {
      const ctx = useAuth()
      return (
        <>
          <button onClick={() => ctx.inscrire('Dave', 'dave@test.com', 'Test1!')}>inscrire</button>
          <button onClick={() => ctx.connecter('dave@test.com', 'Test1!')}>connecter</button>
          <button onClick={() => ctx.deconnecter()}>deconnecter</button>
          <div data-testid="user">{ctx.utilisateur ? ctx.utilisateur.nom : 'null'}</div>
        </>
      )
    }
    render(<AuthProvider><Wrapper /></AuthProvider>)
    await userEvent.click(screen.getByText('inscrire'))
    await userEvent.click(screen.getByText('connecter'))
    await userEvent.click(screen.getByText('deconnecter'))
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 4 — Tests de ajouterFavori() et retirerFavori()
// ─────────────────────────────────────────────────────────────────────────────
describe('ajouterFavori() et retirerFavori() — Tests unitaires', () => {

  it('doit ajouter un livre et augmenter la liste des favoris', async () => {
    render(<AuthProvider><TestFavoris /></AuthProvider>)
    await userEvent.click(screen.getByText('ajouter1'))
    expect(screen.getByTestId('nb-favoris')).toHaveTextContent('1')
  })

  it('doit refuser les doublons (même livre ajouté deux fois)', async () => {
    render(<AuthProvider><TestFavoris /></AuthProvider>)
    await userEvent.click(screen.getByText('ajouter1'))
    await userEvent.click(screen.getByText('ajouter1-doublon'))
    expect(screen.getByTestId('nb-favoris')).toHaveTextContent('1')
  })

  it('doit retirer un livre et diminuer la liste', async () => {
    render(<AuthProvider><TestFavoris /></AuthProvider>)
    await userEvent.click(screen.getByText('ajouter1'))
    await userEvent.click(screen.getByText('ajouter2'))
    await userEvent.click(screen.getByText('retirer1'))
    expect(screen.getByTestId('nb-favoris')).toHaveTextContent('1')
  })
})
