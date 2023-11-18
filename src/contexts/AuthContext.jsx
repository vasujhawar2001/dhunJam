import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// actions
export const AUTH_ACTIONS = {
  LOGIN : 'login',
  LOGOUT: 'logout',
}

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case AUTH_ACTIONS.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN, payload: { user } });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//custom hook to handle context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
