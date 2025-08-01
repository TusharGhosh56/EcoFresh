import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

interface UserData {
  id: number
  email: string
  firstName: string
  lastName: string
  loginTime: string
}

interface AuthWrapperProps {
  onAuthSuccess: (userData: UserData) => void
}

export default function AuthWrapper({ onAuthSuccess }: AuthWrapperProps) {
  const [isLogin, setIsLogin] = useState(true)

  // Mock user database - in a real app, this would be handled by your backend
  const mockUsers = [
    {
      email: 'demo@ecofresh.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      id: 1
    }
  ]

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Check credentials against mock database
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Store user data in localStorage (in a real app, use secure tokens)
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('ecofresh_user', JSON.stringify(userData))
      localStorage.setItem('ecofresh_token', 'mock_token_' + Date.now())
      
      onAuthSuccess(userData)
      return true
    }
    
    return false
  }

  const handleSignup = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email)
    
    if (existingUser) {
      return false
    }
    
    // Create new user
    const newUser = {
      ...userData,
      id: mockUsers.length + 1
    }
    
    // In a real app, this would be sent to your backend
    mockUsers.push(newUser)
    
    // Store user data
    const userSession = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem('ecofresh_user', JSON.stringify(userSession))
    localStorage.setItem('ecofresh_token', 'mock_token_' + Date.now())
    
    onAuthSuccess(userSession)
    return true
  }

  return (
    <>
      {isLogin ? (
        <Login 
          onLogin={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <Signup 
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </>
  )
}
