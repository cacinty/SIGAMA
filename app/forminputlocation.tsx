import { db } from '@/api/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { push, ref, serverTimestamp } from "firebase/database";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const FormInputLocation = () => {
    const params = useLocalSearchParams();
    const { latitude, longitude } = params;

    const [deskripsi, setDeskripsi] = useState('');
    const [namaPelapor, setNamaPelapor] = useState('');
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (latitude && longitude) {
            setLocation({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                accuracy: 'N/A'
            });
        }
    }, [latitude, longitude]);

    const pickImage = async () => {
        console.log("Requesting media library permissions...");
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            console.log("Permission not granted.");
            return;
        }
        console.log("Permission granted. Launching image library...");
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            console.log("Image picker result:", result);

            if (!result.canceled) {
                console.log("Setting image:", result.assets[0].uri);
                setImage(result.assets[0].uri);
            } else {
                console.log("Image picking was canceled.");
            }
        } catch (error) {
            console.error("Error launching image library:", error);
            Alert.alert('Error', 'Failed to open image library.');
        }
    };

    const getCoordinates = async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            setLoading(false);
            return;
        }

        try {
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                accuracy: currentLocation.coords.accuracy.toFixed(2),
            });
        } catch (error) {
            Alert.alert('Error', 'Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
      if (!deskripsi || !namaPelapor) {
          Alert.alert('⚠️ Peringatan', 'Deskripsi dan Nama Pelapor tidak boleh kosong.');
          return;
      }
      if (!location) {
          Alert.alert('⚠️ Peringatan', 'Silakan ambil lokasi terlebih dahulu.');
          return;
      }
  
      setIsSaving(true);
  
      const newReport = {
          deskripsi,
          namaPelapor,
          coordinates: {
              latitude: location.latitude,
              longitude: location.longitude,
          },
          accuration: location.accuracy,
          createdAt: serverTimestamp(),
          imageUrl: image,
      };
  
      push(ref(db, 'laporan_kerusakan/'), newReport)
          .then(() => {
              Alert.alert('✅ Sukses', 'Laporan berhasil disimpan.');
              router.back();
          })
          .catch((e) => {
              Alert.alert('❌ Error', `Gagal menyimpan laporan: ${e.message}`);
          })
          .finally(() => {
              setIsSaving(false);
          });
  };
  

    return (
        <SafeAreaProvider>
            <ImageBackground
                source={require('@/assets/images/gsp.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.container} edges={['top']}>
                        <Stack.Screen options={{ title: 'Lapor Kerusakan Baru', headerStyle: { backgroundColor: '#004A74' }, headerTintColor: '#FFD700' }} />
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View style={styles.formContainer}>
                                <ThemedText type="subtitle" style={styles.label}>Nama Pelapor</ThemedText>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Masukkan nama Anda"
                                    placeholderTextColor="#888"
                                    value={namaPelapor}
                                    onChangeText={setNamaPelapor}
                                />

                                <ThemedText type="subtitle" style={styles.label}>Deskripsi Kerusakan</ThemedText>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Jelaskan kerusakan yang Anda temukan"
                                    placeholderTextColor="#888"
                                    value={deskripsi}
                                    onChangeText={setDeskripsi}
                                    multiline
                                />

                                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                    <FontAwesome5 name="image" size={16} color="#004A74" style={styles.buttonIcon} />
                                    <Text style={styles.imageButtonText}>Pilih Gambar</Text>
                                </TouchableOpacity>

                                {image && (
                                    <Image source={{ uri: image }} style={styles.imagePreview} />
                                )}

                                <TouchableOpacity style={styles.locationButton} onPress={getCoordinates} disabled={loading}>
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <FontAwesome5 name="map-marker-alt" size={16} color="white" style={styles.buttonIcon} />
                                            <Text style={styles.buttonText}>Ambil Lokasi Saat Ini</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                {location && (
                                    <View style={styles.locationInfo}>
                                        <ThemedText style={styles.locationText}><Text style={styles.boldText}>Latitude:</Text> {location.latitude}</ThemedText>
                                        <ThemedText style={styles.locationText}><Text style={styles.boldText}>Longitude:</Text> {location.longitude}</ThemedText>
                                        <ThemedText style={styles.locationText}><Text style={styles.boldText}>Akurasi:</Text> {location.accuracy} {location.accuracy === 'N/A' ? '' : 'meter'}</ThemedText>
                                    </View>
                                )}

                                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <FontAwesome5 name="save" size={16} color="white" style={styles.buttonIcon} />
                                            <Text style={styles.buttonText}>Simpan Laporan</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    // ---------- Containers ----------
  container: { flex: 1 },
  scrollContent: { 
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fbfafc8b',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '95%',
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },

  // ---------- Texts ----------
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#FFD700' },
  locationText: { fontSize: 16, color: '#FFF', marginBottom: 5 },
  boldText: { fontWeight: 'bold', color: '#FFD700' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  imageButtonText: { color: '#004A74', fontSize: 16, fontWeight: 'bold' },

  // ---------- Inputs ----------
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
    color: '#333',
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  // ---------- Buttons ----------
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004A74',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004A74',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonIcon: { marginRight: 10 },

  // ---------- Location Info ----------
  locationInfo: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fbfafc8b',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },

  // ---------- Images ----------
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
});

export default FormInputLocation;
