import React, { useState } from 'react';
import { ApolloProvider, useQuery } from './apollo-imports';
import { client } from './graphql/client';
import { isAuthenticated } from './utils/auth';
import { GET_ME_QUERY } from './graphql/operations';
import { Theory, User } from './types';
import Header from './components/Header';
import Login from './components/Login';
import TheoryList from './components/TheoryList';
import TheoryDetail from './components/TheoryDetail';
import CreateTheory from './components/CreateTheory';

type View = 'list' | 'detail' | 'create';

interface GetMeData {
  me: User | null;
}

function MainApp() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedTheory, setSelectedTheory] = useState<Theory | null>(null);

  const { data: userData } = useQuery<GetMeData>(GET_ME_QUERY, {
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
