
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
# SIGAMA

🔵🚀 NAMA PRODUK
SIGAMA — Sistem Pelaporan Kerusakan Berbasis Lokasi UGM
Aplikasi Pelaporan Kerusakan Berbasis Lokasi untuk Kampus UGM.

📝📌 DESKRIPSI PRODUK
SIGAMA adalah aplikasi pelaporan kerusakan fasilitas kampus yang memudahkan mahasiswa, dosen, dan tenaga kependidikan untuk mengirim laporan berbasis lokasi secara cepat.

📍 Aplikasi ini memanfaatkan GPS untuk mendapatkan koordinat otomatis.

📷 Mendukung upload foto kerusakan.

🔥 Data laporan disimpan menggunakan Firebase Realtime Database & Storage.

🗺️ Semua laporan ditampilkan pada peta interaktif menggunakan Leaflet dan Google Maps, sehingga pengelola kampus dapat memantau kerusakan secara efisien dalam satu tampilan.



⚙️ Komponen Pembangun Produk
 1. Aplikasi Mobile
    
      📦 React Native + Expo
      
      📍 Expo Location → pengambilan GPS otomatis
      
      📷 Expo Image Picker → upload foto
      
      🔥 Firebase SDK → koneksi data laporan
      
      🗺️ Google Maps SDK (via react-native-maps)

 3. Web Monitoring
    
      🌐 HTML, CSS, JavaScript
      
      🗺️ Leaflet.js → visualisasi titik laporan
      
      🔥 Firebase JS SDK → mengambil & menghapus data
      
      🗾 Google Maps JavaScript API

5. Backend & Database
   
      🔥 Firebase Realtime Database → menyimpan laporan




📝📌 Sumber Data

      📝 Input pengguna:
      
      Deskripsi kerusakan
      
      Nama pelapor
      
      Foto kerusakan

🔥 Firebase Realtime Database → sumber utama data peta

📷Dokumentasi Kompenen Fitur SIGAMA




https://github.com/user-attachments/assets/9fdb50fd-ab9a-4baa-ab3b-e6b61c903b7b




