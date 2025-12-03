import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const webmap = require('@/assets/html/map.html') // Adjusted path

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <Stack.Screen options={{ title: 'Sebaran Lokasi Kerusakan ', headerStyle: { backgroundColor: '#004A74' }, headerTintColor: '#FFD700' }} />
          <View style={styles.container}>
            <WebView
              style={styles.webview}
              source={webmap}
            />
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    
  },
  webview: {
    flex: 1,
    
  },
});
