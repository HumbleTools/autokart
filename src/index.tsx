import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { LoaderProvider } from './contexts/LoaderContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </LoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
