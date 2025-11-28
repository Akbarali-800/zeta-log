import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const initialState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp: (state, action) => {
      const { email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const userExists = users.find(u => u.email === email);
      if (userExists) {
        throw new Error('User already exists');
      }

      const newUser = {
        email,
        password,
        createdAt: new Date().toISOString(),
        biometricCredentials: null,
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const userWithoutPassword = { email, createdAt: newUser.createdAt };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      state.user = userWithoutPassword;
      state.isAuthenticated = true;
    },
    signIn: (state, action) => {
      const { email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const userWithoutPassword = { email: user.email, createdAt: user.createdAt };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      state.user = userWithoutPassword;
      state.isAuthenticated = true;
    },
    signInWithBiometric: (state, action) => {
      const { email } = action.payload;
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const user = users.find(u => u.email === email && u.biometricCredentials);
      if (!user) {
        throw new Error('Biometric credentials not found');
      }

      const userWithoutPassword = { email: user.email, createdAt: user.createdAt };
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      state.user = userWithoutPassword;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem('currentUser');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { signUp, signIn, signInWithBiometric, logout } = authSlice.actions;
export default authSlice.reducer;
