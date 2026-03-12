import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Alanı - Şimdilik sadece yazı ama çok zarif */}
        <Text style={styles.logoText}>Aura</Text>
        
        <Text style={styles.titleText}>Hoş Geldin</Text>
        <Text style={styles.subText}>Sadece numaranla, sade bir başlangıç yap.</Text>

        <TextInput
          style={styles.input}
          placeholder="Telefon Numaran"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TouchableOpacity style={styles.button} onPress={() => {/* SMS Fonksiyonu Buraya Gelecek */}}>
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Tam istediğin o ferah beyaz
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '200',
    letterSpacing: 4,
    marginBottom: 60,
    textAlign: 'center',
    color: '#333',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#000',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 10,
    fontSize: 18,
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
