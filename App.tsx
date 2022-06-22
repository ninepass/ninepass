import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import PassList from './pages/passList';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routers from './pages/routers';


export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Routers />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
