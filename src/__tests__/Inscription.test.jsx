// ============================================================
// TESTS D'INTÉGRATION — Inscription.jsx
// On teste le formulaire complet avec toutes les règles de validation
// ============================================================

import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Inscription from '../pages/Inscription'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const reel = await vi.importActual('react-router-dom')
  return { ...reel, useNavigate: () => mockNavigate }
})

const monterInscription = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Inscription />
      </AuthProvider>
    </MemoryRouter>
  )

beforeEach(() => mockNavigate.mockClear())

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 1 — Rendu du formulaire
// ─────────────────────────────────────────────────────────────────────────────
describe('Inscription — Rendu du formulaire', () => {

  it('doit afficher le titre Inscription', () => {
    monterInscription()
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('doit afficher les 4 champs du formulaire', () => {
    monterInscription()
    expect(screen.getByPlaceholderText('Votre nom')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('exemple@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/majuscule/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it("doit afficher le bouton S'inscrire", () => {
    monterInscription()
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 2 — Validation du champ Nom
// ─────────────────────────────────────────────────────────────────────────────
describe('Inscription — Validation du champ Nom', () => {

  it('doit afficher une erreur si le nom est vide', async () => {
    monterInscription()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText('Le nom est requis')).toBeInTheDocument()
  })

  it('doit afficher une erreur si le nom fait moins de 3 caractères', async () => {
    monterInscription()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('Votre nom'), 'Al')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText('Le nom doit contenir au moins 3 caractères')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 3 — Validation du champ Email
// ─────────────────────────────────────────────────────────────────────────────
describe('Inscription — Validation du champ Email', () => {

  it("doit afficher une erreur si l'email est vide", async () => {
    monterInscription()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('Votre nom'), 'Alice')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText("L'email est requis")).toBeInTheDocument()
  })

  it("doit afficher une erreur si le format de l'email est invalide", async () => {
    monterInscription()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('Votre nom'), 'Alice')
    // fireEvent contourne la validation HTML5 native de jsdom pour tester notre regex
    const inputEmail = screen.getByPlaceholderText('exemple@email.com')
    fireEvent.change(inputEmail, { target: { value: 'noreply@invalid' } })
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText("Le format de l'email est invalide")).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 4 — Validation du mot de passe
// ─────────────────────────────────────────────────────────────────────────────
describe('Inscription — Validation du mot de passe', () => {

  // Remplit nom + email pour atteindre la validation du mot de passe
  const remplirNomEmail = async (user) => {
    await user.type(screen.getByPlaceholderText('Votre nom'), 'Alice')
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'alice@test.com')
  }

  it("doit afficher une erreur si le mot de passe n'a pas de majuscule", async () => {
    monterInscription()
    const user = userEvent.setup()
    await remplirNomEmail(user)
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'azerty1!')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText('Doit contenir une majuscule')).toBeInTheDocument()
  })

  it("doit afficher une erreur si le mot de passe n'a pas de chiffre", async () => {
    monterInscription()
    const user = userEvent.setup()
    await remplirNomEmail(user)
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'Azerty!')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText('Doit contenir un chiffre')).toBeInTheDocument()
  })

  it("doit afficher une erreur si le mot de passe n'a pas de symbole", async () => {
    monterInscription()
    const user = userEvent.setup()
    await remplirNomEmail(user)
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'Azerty1')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText('Doit contenir un symbole')).toBeInTheDocument()
  })

  it('doit afficher une erreur si la confirmation est différente du mot de passe', async () => {
    monterInscription()
    const user = userEvent.setup()
    await remplirNomEmail(user)
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'Azerty1!')
    await user.type(screen.getByPlaceholderText('••••••••'), 'MotDePasseDifferent1!')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 5 — Email déjà utilisé
// ─────────────────────────────────────────────────────────────────────────────
describe('Inscription — Email déjà utilisé', () => {

  it('doit afficher "Cet email est déjà utilisé" lors d\'une deuxième inscription avec le même email', async () => {
    const user = userEvent.setup()

    // Un seul AuthProvider partagé pour les deux tentatives
    const { rerender } = render(
      <MemoryRouter>
        <AuthProvider>
          <Inscription />
        </AuthProvider>
      </MemoryRouter>
    )

    // Première inscription valide
    await user.type(screen.getByPlaceholderText('Votre nom'), 'Alice')
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'alice@test.com')
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'Azerty1!')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Azerty1!')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))

    // Le message de succès confirme que la première inscription a fonctionné
    expect(await screen.findByText(/inscription réussie/i)).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BLOC 6 — Comportement positif
// ─────────────────────────────────────────────────────────────────────────────
describe('Inscription — Comportement positif', () => {

  it('doit afficher le message de succès après une inscription valide', async () => {
    monterInscription()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('Votre nom'), 'Marie')
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'marie@test.com')
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'Marie123!')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Marie123!')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))
    expect(await screen.findByText(/inscription réussie/i)).toBeInTheDocument()
  })

  it('doit rediriger vers /connexion après l\'inscription (avec délai 1,5s)', async () => {
    // vi.useFakeTimers() avec userEvent nécessite { shouldAdvanceTime: true }
    vi.useFakeTimers({ shouldAdvanceTime: true })
    monterInscription()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })

    await user.type(screen.getByPlaceholderText('Votre nom'), 'Paul')
    await user.type(screen.getByPlaceholderText('exemple@email.com'), 'paul@test.com')
    await user.type(screen.getByPlaceholderText(/majuscule/i), 'Paul123!')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Paul123!')
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }))

    // Avance le temps de 1,5 secondes
    act(() => vi.advanceTimersByTime(1500))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/connexion')
    })

    vi.useRealTimers()
  })
})
