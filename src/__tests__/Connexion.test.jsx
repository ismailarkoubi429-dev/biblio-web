// ============================================================
// TESTS D'INTÉGRATION — Connexion.jsx
// On teste le formulaire complet : rendu, validation, soumission
// ============================================================

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Connexion from '../pages/Connexion'

// Mock de useNavigate pour intercepter les redirections sans vrai routeur
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const reel = await vi.importActual('react-router-dom')
  return { ...reel, useNavigate: () => mockNavigate }
})

const monterConnexion = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Connexion />
      </AuthProvider>
    </MemoryRouter>
  )

beforeEach(() => mockNavigate.mockClear())

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 1 — Rendu du formulaire
// ─────────────────────────────────────────────────────────────────────────────
describe('Connexion — Rendu du formulaire', () => {

  it('doit afficher le titre Connexion', () => {
    monterConnexion()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('doit afficher les champs email et mot de passe', () => {
    monterConnexion()
    expect(screen.getByPlaceholderText('exemple@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('doit afficher le bouton Se connecter', () => {
    monterConnexion()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 2 — Validation des champs
// ─────────────────────────────────────────────────────────────────────────────
describe('Connexion — Validation des champs', () => {

  it('doit afficher une erreur si l\'email est vide à la soumission', async () => {
    monterConnexion()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(await screen.findByText("L'email est requis")).toBeInTheDocument()
  })

  it('doit afficher une erreur si le format de l\'email est invalide', async () => {
    monterConnexion()
    const user = userEvent.setup()
    // fireEvent contourne la validation HTML5 native de jsdom pour tester notre regex
    const inputEmail = screen.getByPlaceholderText('exemple@email.com')
    fireEvent.change(inputEmail, { target: { value: 'noreply@invalid' } })
    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(await screen.findByText("Le format de l'email est invalide")).toBeInTheDocument()
  })

  it('doit afficher une erreur si le mot de passe est vide', async () => {
    monterConnexion()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(await screen.findByText('Le mot de passe est requis')).toBeInTheDocument()
  })

  it('doit afficher une erreur si le mot de passe fait moins de 6 caractères', async () => {
    monterConnexion()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'abc')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(await screen.findByText('Le mot de passe doit contenir au moins 6 caractères')).toBeInTheDocument()
  })

  it('doit afficher "Email ou mot de passe incorrect" avec de mauvais identifiants', async () => {
    monterConnexion()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'inconnu@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Azerty1!')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(
      await screen.findByText('Email ou mot de passe incorrect', {}, { timeout: 2000 })
    ).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 3 — Comportement positif
// ─────────────────────────────────────────────────────────────────────────────
describe('Connexion — Comportement positif', () => {

  it('doit pouvoir taper dans les deux champs', async () => {
    monterConnexion()
    const user = userEvent.setup()
    const inputEmail = screen.getByPlaceholderText('exemple@email.com')
    const inputMdp = screen.getByPlaceholderText('••••••••')
    await user.type(inputEmail, 'test@test.com')
    await user.type(inputMdp, 'MonMotDePasse1!')
    expect(inputEmail).toHaveValue('test@test.com')
    expect(inputMdp).toHaveValue('MonMotDePasse1!')
  })

  it('navigate ne doit pas être appelé avec des identifiants invalides', async () => {
    monterConnexion()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'mauvais@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Azerty1!')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))
    await waitFor(
      () => expect(mockNavigate).not.toHaveBeenCalledWith('/profil'),
      { timeout: 2000 }
    )
  })
})
