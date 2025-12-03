import { router } from 'expo-router';
import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { db } from '@/api/firebaseConfig';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

const LaporanKerusakanScreen = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const reportsRef = ref(db, 'laporan_kerusakan/');
        const unsubscribe = onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setReports(formattedData);
            } else {
                setReports([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleEdit = (item) => {
        router.push({
            pathname: '/formeditlocation',
            params: {
                id: item.id,
                deskripsi: item.deskripsi,
                coordinates: JSON.stringify(item.coordinates),
                accuration: item.accuration,
                namaPelapor: item.namaPelapor
            },
        });
    };

    const handleDelete = (id) => {
        Alert.alert(
            '🗑️ Hapus Laporan',
            'Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat diurungkan.',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                        const reportRef = ref(db, `laporan_kerusakan/${id}`);
                        remove(reportRef)
                            .then(() => Alert.alert('✅ Sukses', 'Laporan berhasil dihapus.'))
                            .catch((e) => Alert.alert('❌ Error', `Gagal menghapus laporan: ${e.message}`));
                    },
                },
            ]
        );
    };
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <FontAwesome5 name="exclamation-triangle" size={20} color="#FF6347" />
                <ThemedText type="subtitle" style={styles.cardTitle}>Laporan Kerusakan</ThemedText>
            </View>
            <View style={styles.cardContent}>
                <ThemedText style={styles.cardText}><Text style={styles.boldText}>Deskripsi:</Text> {item.deskripsi}</ThemedText>
                <ThemedText style={styles.cardText}><Text style={styles.boldText}>Pelapor:</Text> {item.namaPelapor}</ThemedText>
                <ThemedText style={styles.cardText}><Text style={styles.boldText}>Lokasi:</Text> ({item.coordinates.latitude}, {item.coordinates.longitude})</ThemedText>
                <ThemedText style={styles.cardText}><Text style={styles.boldText}>Akurasi:</Text> {item.accuration} meter</ThemedText>
                {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                )}
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={[styles.button, styles.editButton]}>
                    <FontAwesome5 name="edit" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.button, styles.deleteButton]}>
                    <FontAwesome5 name="trash" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Hapus</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaProvider>
            <ImageBackground
                source={require('@/assets/images/gsp.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.container} edges={['top']}>
                        <View style={styles.header}>
                            <ThemedText type='title' style={styles.headerTitle}>Daftar Laporan Kerusakan</ThemedText>
                        </View>
                        <FlatList
                            data={reports}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={<Text style={styles.emptyText}>Belum ada laporan kerusakan.</Text>}
                            contentContainerStyle={styles.listContainer}
                        />
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
    },
    header: {
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#fbfafc8b',
        borderRadius: 12,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#FFD700',
    },
    cardTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    cardContent: {
        padding: 15,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#FFF',
        lineHeight: 22,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#FFD700',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#FFD700',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#3498db',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#FFF',
    }
});

export default LaporanKerusakanScreen;