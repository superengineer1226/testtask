import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import apolloClient from './apollo';
import { ApolloProvider } from '@apollo/client'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <ApolloProvider client={apolloClient}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </ApolloProvider>

);
