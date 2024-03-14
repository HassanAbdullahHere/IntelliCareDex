import React, { Component } from 'react';
import { SafeAreaView, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { MainNavigator } from './src/services/navigation';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import './src/i18Next'
class App extends Component {

  render() {
    let persistor = persistStore(store)

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={{ flex: 1 }}>
            <MainNavigator />
          </SafeAreaView>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;