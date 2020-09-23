import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import AppContainer from './hooks';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#f4f4', flex: 1 }}>
    <AppContainer>
      <StatusBar barStyle="light-content" backgroundColor="#f4f4" />
      <Routes />
    </AppContainer>
  </View>
);

export default App;
