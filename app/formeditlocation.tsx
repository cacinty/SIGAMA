import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ref, update } from "firebase/database";
import { db } from '@/api/firebaseConfig';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

const EditLaporanScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, deskripsi: initialDeskripsi, coordinates: initialCoordinates, accuration: initialAccuration, namaPelapor: initialNamaPelapor } = params;

    const [deskripsi, setDeskripsi] = useState(initialDeskripsi);
    const [namaPelapor, setNamaPelapor] = useState(initialNamaPelapor);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialCoordinates) {
            try {
                const coords = JSON.parse(initialCoordinates);
                setLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    accuracy: initialAccuration
                });
            } catch (e) {
                // Fallback for non-JSON string
                const [latitude, longitude] = initialCoordinates.split(',');
                setLocation({
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    accuracy: initialAccuration
                });
            }
        }
    }, [initialCoordinates, initialAccuration]);

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

    const handleUpdate = () => {
        if (!deskripsi || !namaPelapor) {
            Alert.alert('⚠️ Peringatan', 'Deskripsi dan Nama Pelapor tidak boleh kosong.');
            return;
        }
        if (!location) {
            Alert.alert('⚠️ Peringatan', 'Lokasi tidak boleh kosong.');
            return;
        }

        setIsSaving(true);
        const reportRef = ref(db, `laporan_kerusakan/${id}`);
        update(reportRef, {
            deskripsi,
            namaPelapor,
            coordinates: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            accuration: location.accuracy,
        }).then(() => {
            Alert.alert('✅ Sukses', 'Laporan berhasil diperbarui.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        }).catch((e) => {
            Alert.alert("❌ Error", `Gagal memperbarui laporan: ${e.message}`);
        }).finally(() => {
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
                        <Stack.Screen options={{ title: 'Edit Laporan Kerusakan', headerStyle: { backgroundColor: '#004A74' }, headerTintColor: '#FFD700' }} />
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

                            <TouchableOpacity style={styles.locationButton} onPress={getCoordinates} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <FontAwesome5 name="map-marker-alt" size={16} color="white" style={styles.buttonIcon} />
                                        <Text style={styles.buttonText}>Ambil Lokasi Baru</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {location && (
                                <View style={styles.locationInfo}>
                                    <ThemedText style={styles.locationText}><Text style={styles.boldText}>Latitude:</Text> {location.latitude}</ThemedText>
                                    <ThemedText style={styles.locationText}><Text style={styles.boldText}>Longitude:</Text> {location.longitude}</ThemedText>
                                    <ThemedText style={styles.locationText}><Text style={styles.boldText}>Akurasi:</Text> {location.accuracy} meter</ThemedText>
                                </View>
                            )}

                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={isSaving}>
                                {isSaving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <FontAwesome5 name="save" size={16} color="white" style={styles.buttonIcon} />
                                        <Text style={styles.buttonText}>Simpan Perubahan</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
    },
    formContainer: {
        padding: 20,
        backgroundColor: '#fbfafc8b',
        borderRadius: 10,
        margin: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#FFD700',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
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
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationInfo: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#fbfafc8b',
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    locationText: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#FFD700',
    }
});

export default EditLaporanScreen;
