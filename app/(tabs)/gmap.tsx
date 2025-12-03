import { db } from '@/api/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

export default function MapScreen() {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
        })();

        const reportsRef = ref(db, 'laporan_kerusakan/');

        const unsubscribe = onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedMarkers = Object.keys(data)
                    .map(key => {
                        const report = data[key];
                        if (!report.coordinates || typeof report.coordinates.latitude !== 'number' || typeof report.coordinates.longitude !== 'number') {
                            console.warn(`Invalid coordinates for report ${key}:`, report.coordinates);
                            return null;
                        }

                        return {
                            id: key,
                            ...report
                        };
                    })
                    .filter(Boolean); 

                setMarkers(parsedMarkers);
            } else {
                setMarkers([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading map data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                customMapStyle={darkMapStyle}
                initialRegion={{
                    latitude: -7.7956, 
                    longitude: 110.3695,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                zoomControlEnabled={true}
                onPress={(e) => router.push({pathname: '/forminputlocation', params: { latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude }})}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.coordinates.latitude, longitude: marker.coordinates.longitude }}
                        onPress={() => handleMarkerPress(marker)}
                    >
                        <FontAwesome name="warning" size={30} color="red" />
                    </Marker>
                ))}
            </MapView>
            {selectedMarker && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTextTitle}>Detail Laporan</Text>
                            <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Deskripsi:</Text> {selectedMarker.deskripsi}</Text>
                            <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Pelapor:</Text> {selectedMarker.namaPelapor}</Text>
                            <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Akurasi:</Text> {selectedMarker.accuration} meter</Text>
                            {selectedMarker.imageUrl && (
                                <Image source={{ uri: selectedMarker.imageUrl }} style={styles.image} />
                            )}
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    router.push({pathname: '/formeditlocation', params: { id: selectedMarker.id, deskripsi: selectedMarker.deskripsi, coordinates: JSON.stringify(selectedMarker.coordinates), accuration: selectedMarker.accuration, namaPelapor: selectedMarker.namaPelapor}})
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Lihat Detail</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Tutup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/explore')}>
                <FontAwesome name="plus" size={24} color="#004A74" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: 20,
        bottom: 20,
        backgroundColor: '#FFD700',
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#004A74",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#FFD700'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        width: 150
    },
    buttonClose: {
        backgroundColor: "#FFD700",
    },
    textStyle: {
        color: "#004A74",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTextTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 20,
        color: '#FFD700'
    },
    modalText: {
        marginBottom: 15,
        textAlign: "left",
        color: 'white'
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 15
    },
});
