import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Button } from 'react-native';

const FormInput = () => {
    const [nama, setNama] = useState('');
    const [nim, setNim] = useState('');
    const [kelas, setKelas] = useState('');

    const handleSave = () => {
        console.log('Data tersimpan:', { nama, nim, kelas });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Form Input' }} />

            <Text style={styles.inputTitle}>Nama</Text>
            <TextInput
                style={styles.input}
                placeholder="Isi Nama Anda Disini"
                value={nama}
                onChangeText={setNama}
            />
            <Text style={styles.inputTitle}>NIM</Text>
            <TextInput
                style={styles.input}
                placeholder="Isi NIM Anda Disini"
                value={nim}
                onChangeText={setNim}
                keyboardType="numeric"
            />
            <Text style={styles.inputTitle}>Kelas</Text>
            <TextInput
                style={styles.input}
                placeholder="Isi Kelas Anda Disini"
                value={kelas}
                onChangeText={setKelas}
            />

            <View style={styles.buttonContainer}>
                <Button title="SAVE" color="#f6009cff" onPress={handleSave} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffb5e4ff',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    input: {
        height: 40,
        borderColor: '#f6009cff',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 10,
        backgroundColor: '#ffffffff',
    },
    buttonContainer: {
        backgroundColor: '#f6009cff',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inputTitle: {
        marginLeft: 4,
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
});

export default FormInput;
