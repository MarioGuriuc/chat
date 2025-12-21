import React, { useState, useEffect } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import { client } from './graphql/client';
import { isAuthenticated } from './utils/auth';
import { GET_ME_QUERY } from './graphql/operations';
import { Theory } from './types';
import Header from './components/Header';
import Login from './components/Login';
import TheoryList from './components/TheoryList';
import TheoryDetail from './components/TheoryDetail';
import CreateTheory from './components/CreateTheory';

type View = 'list' | 'detail' | 'create';

function MainApp() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedTheory, setSelectedTheory] = useState<Theory | null>(null);

  const { data: userData } = useQuery(GET_ME_QUERY, {
    skip: !isAuth,
  });

  const handleLoginSuccess = () => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    setIsAuth(false);
    setCurrentView('list');
    setSelectedTheory(null);
  };

  const handleSelectTheory = (theory: Theory) => {
    setSelectedTheory(theory);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedTheory(null);
  };

  const handleCreateTheory = () => {
    setCurrentView('create');
  };

  const handleCreateSuccess = () => {
    setCurrentView('list');
  };

  if (!isAuth) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-conspiracy-dark">
      <Header
        isAuthenticated={isAuth}
        username={userData?.me?.username}
        onLogout={handleLogout}
      />
      
      {currentView === 'list' && (
        <TheoryList
          onSelectTheory={handleSelectTheory}
          onCreateTheory={handleCreateTheory}
        />
      )}
      
      {currentView === 'detail' && selectedTheory && (
        <TheoryDetail
          theoryId={selectedTheory.id}
          onBack={handleBack}
        />
      )}
      
      {currentView === 'create' && (
        <CreateTheory
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <MainApp />
    </ApolloProvider>
  );
}

export default App;
