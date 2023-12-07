// Importing necessary components from expo-router and react-native
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

// Importing Themed components for consistent styling
import { Text, View } from '../components/Themed';

// NotFoundScreen component for handling non-existent routes
export default function NotFoundScreen() {
  return (
    <>
      {/* Stack.Screen for configuring navigation options */}
      <Stack.Screen options={{ title: 'Oops!' }} />

      {/* View container with styling */}
      <View style={styles.container}>
        {/* Text component displaying the error message */}
        <Text style={styles.title}>This screen doesn't exist.</Text>

        {/* Link component for navigating back to the home screen */}
        <Link href="/" style={styles.link}>
          {/* Text within the link */}
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
