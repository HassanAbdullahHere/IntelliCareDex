import React, { useEffect, useState } from 'react';
import { SafeAreaView, LogBox, Modal, View, Text, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './src/redux/store';
import { persistStore } from 'redux-persist';
import { MainNavigator } from './src/services/navigation';
import messaging from '@react-native-firebase/messaging'; // Import messaging module


// Ignore any warning logs related to Firebase messaging
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Show popup notification
      setShowAlert(true);
    });

    // Clean up event listener when component unmounts
    return unsubscribe;
  }, []); // Ensure this effect runs only once

  // Initialize Redux persistor
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <MainNavigator />
          <Modal
            visible={showAlert}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAlert(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text style={{ color:'black',fontSize: 13, marginBottom: 10 }}>New Alert Received, visit Alert Screen to View</Text>
                <TouchableOpacity onPress={() => {
                  // Navigate to Alerts screen
                  setShowAlert(false); // Close the popup
                  // Navigate to the Alerts screen (replace 'Alerts' with your actual screen name)
                  // You should use your navigation library here (e.g., react-navigation)
                  
                }}>
                  <Text style={{ fontSize: 16, color: 'blue' }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
