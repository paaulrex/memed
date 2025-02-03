import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>M.E.M.E.D.</Text>
      <Text style={{ color: '#bbb', fontSize: 16, marginTop: 10 }}>Minimal Effort, Maximum Existential Dread</Text>

      <TouchableOpacity 
        onPress={() => router.push('/tasks')}
        style={{ marginTop: 20, backgroundColor: '#1e90ff', padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Start Adulting</Text>
      </TouchableOpacity>
    </View>
  );
}
