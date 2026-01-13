import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'



// Mock Firebase modules
const mocks = vi.hoisted(() => {
  const state = { authStateCallback: null }
  return {
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, cb) => {
      // Store on our internal state object which is available in the closure
      state.authStateCallback = cb
      return () => {} 
    }),
    setDoc: vi.fn(),
    doc: vi.fn(),
    // Expose a way to get the callback
    getAuthStateCallback: () => state.authStateCallback
  }
})

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {},
  signInWithPopup: (...args) => mocks.signInWithPopup(...args),
  signOut: (...args) => mocks.signOut(...args),
  onAuthStateChanged: (...args) => mocks.onAuthStateChanged(...args),
  getAuth: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  doc: (...args) => mocks.doc(...args),
  setDoc: (...args) => mocks.setDoc(...args),
  serverTimestamp: () => 'timestamp',
  getFirestore: vi.fn(),
}))

vi.mock('../firebase', () => ({
  auth: {},
  db: {}
}))

describe('useAuth', () => {
  let auth

  beforeEach(() => {
    vi.clearAllMocks()
    auth = useAuth()
  })

  it('initializes with loading false and no error', () => {
    expect(auth.loading.value).toBe(false)
    expect(auth.error.value).toBe(null)
  })

  it('updates user state when onAuthStateChanged triggers', () => {
    const mockUser = { uid: '123', email: 'test@example.com' }
    
    // Manually trigger the callback we captured
    const callback = mocks.getAuthStateCallback()
    if (callback) {
        callback(mockUser)
    } else {
        throw new Error('onAuthStateChanged was not called')
    }
    
    expect(auth.user.value).toEqual(mockUser)
  })

  it('signInWithGoogle success flow', async () => {
    const mockUser = { 
        uid: '123', 
        displayName: 'Test User', 
        photoURL: 'http://pic.com', 
        email: 'test@example.com',
        metadata: { creationTime: 'now' }
    }
    mocks.signInWithPopup.mockResolvedValue({ user: mockUser })
    mocks.doc.mockReturnValue('userRef')

    await auth.signInWithGoogle()

    expect(auth.loading.value).toBe(false)
    expect(auth.error.value).toBe(null)
    expect(mocks.signInWithPopup).toHaveBeenCalled()
    expect(mocks.setDoc).toHaveBeenCalled() // Verifies DB sync attempted
  })

  it('signInWithGoogle failure flow', async () => {
    mocks.signInWithPopup.mockRejectedValue(new Error('Popup closed'))

    await auth.signInWithGoogle()

    expect(auth.loading.value).toBe(false)
    expect(auth.error.value).toBe('Popup closed')
  })

  it('signOut calls firebase signOut', async () => {
    await auth.signOut()
    expect(mocks.signOut).toHaveBeenCalled()
  })
})
