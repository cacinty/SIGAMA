import { Image } from 'expo-image';
import { StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('@/assets/images/balairung.jpg')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
        <ThemedText style={styles.mainTitle}>SiGaMa</ThemedText>
        <ThemedText style={styles.subTitle}>Sistem Laporan Gadjah Mada</ThemedText>

        <Image
          source={require('@/assets/images/simaster.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <ThemedText style={styles.tagline}>
          "Laporkan setiap kerusakan di sekitar Anda untuk lingkungan UGM yang lebih baik"
        </ThemedText>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/explore')}
          >
            <ThemedText style={styles.primaryButtonText}>Buat Laporan Baru</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/mapwebview')}
          >
            <ThemedText style={styles.secondaryButtonText}>Lihat Titik Kerusakan</ThemedText>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#004A74', // Dark Blue
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },
  mainTitle: {
    fontSize: 33,
    fontWeight: 'bold',
    textAlign: 'center',
     marginTop: 20, // Adjusted margin
    color: '#FFD700', // Yellow
    fontFamily: Fonts.serif,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 7, height: 7 },
    textShadowRadius: 8,
    letterSpacing: 2,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#004A74', // White
    fontFamily: Fonts.serif,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 20, // Adjusted margin
  },
  logo: {
    width: 170, // Slightly increased
    height: 170, // Slightly increased
    marginBottom: 35, // Adjusted margin
    marginTop: 20, // Adjusted margin
    borderRadius: 80, // Made circular
    borderWidth: 3,
    borderColor: '#FFD700', // Yellow border
    shadowColor: '#000', // Added shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Android shadow
  },
  tagline: {
    fontSize: 15, // Increased font size
    textAlign: 'center',
    marginBottom: 40, // Increased margin
    marginTop: 40, // Added margin to move tagline down
    color: '#004A74', // White
    paddingHorizontal: 25, // Adjusted padding
    lineHeight: 24, // Added line height
    fontFamily: Fonts.serif,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, // Adjusted top margin
  },
  button: {
    width: '90%',
    paddingVertical: 18, // Increased padding
    borderRadius: 12, // Increased border radius
    alignItems: 'center',
    marginBottom: 15, // Increased margin
    // Added shadow for buttons
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  primaryButton: {
    backgroundColor: '#FFD700', // Yellow
  },
  primaryButtonText: {
    color: '#004A74', // Dark Blue
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
  },
  secondaryButton: {
    borderWidth: 2, // Increased border width
    borderColor: '#FFD700', // Yellow
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle transparent background
  },
  secondaryButtonText: {
    color: '#FFD700', // Yellow
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(251, 247, 247, 0.55)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
