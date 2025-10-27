# 🎯 VALORDLE - Valorant Wordle

Valorant profesyonel oyuncularının isimleriyle oynanan Wordle oyunu! Her gün yeni bir oyuncu adını tahmin et ve hedef tahtasına vur!

## 🎮 Oyun Nasıl Oynanır?

1. **Amaç**: Günün pro oyuncusu adını 6 denemede tahmin et
2. **Tahmin**: Her tahmin 5-6 harfli bir Valorant pro oyuncusunun adı olmalı (seçilen kelimeye göre)
3. **Geri Bildirim**: 
   - 🟩 **Yeşil (Headshot!)**: Harf doğru pozisyondadır
   - 🟨 **Sarı (Lit!)**: Harf kelimede var ama yanlış yerde
   - ⬛ **Gri (Miss!)**: Harf kelimede yok
4. **Bölge Seçimi**: 🗺️ Tuşu ile bölge değiştir (EMEA + Türkiye / NA)

## 📁 Proje Yapısı

```
valordle/
├── index.html              # Ana oyun arayüzü
├── styles.css              # Valorant temalı CSS
├── script.js               # Oyun mantığı (JavaScript)
├── i18n.js                 # Türkçe/İngilizce çeviri sistemi
├── font/
│   └── valorant.ttf        # Custom Valorant fontu
└── README.md               # Türkçe dokümantasyon (bu dosya)
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern web tarayıcı (Chrome, Firefox, Safari, Edge)

### Adımlar

1. **Dosyaları kopyala**
   ```bash
   C:\xampp\htdocs\valordle\
   ```

2. **XAMPP'i başlat**
   - XAMPP Control Panel'den Apache'yi başlat

3. **Tarayıcıda aç**
   ```
   http://localhost/
   ```

4. **Oyna!** 🎮

## 🎯 Özellikler

### ✅ Temel Özellikler
- 🎮 Günlük oyuncu adı sistemi (herkes aynı oyuncu adını alır)
- 6️⃣ 6 deneme hakkı
- 🌍 **Bölge Seçimi**: EMEA + Türkiye, NA (her bölgeın ayrı oyunu)
- 📏 **Dinamik Uzunluk**: 5-6 harfli kelimeler (kutucuk sayısı otomatik ayarlanır)
- 🌐 Türçe/İngilizce dil seçeneği
- 📋 Oyun durumu otomatik kaydedilir (bölge başı ayrı saklanır)
- 📱 Mobil ve masaüstü uyumlu (responsive)

### 🎨 Tasarım
- **Valorant Teması**: Resmi renk paletini kullanır
- **Custom Font**: `valorant.ttf` - Oyun tarzı yazı tipi
- **Animasyonlar**: Tile flip, key shine, modal slide-in
- **Glassmorphism**: Modern UI/UX tasarımı

### 🔤 Çoklu Dil Desteği
- 🇬🇧 **English** - Tam destekli
- 🇹🇷 **Türkçe** - Tam destekli
- Ayar otomatik kaydedilir

### 📤 Sosyal Medya Paylaşımı
Oyunun sonunda emoji grid ile sonuç paylaş:
```
VALORDLE #664
4/6

⬛🟩⬛⬛⬛
⬛🟩🟨⬛⬛
🟩🟩⬛🟩⬛
🟩🟩🟩🟩🟩
```

## 📊 Veri Kaynağı

### Oyuncu İsimleri (30+ Pro Oyuncu)
Veritabanı, Valorant esports sahnesinden gerçek pro oyuncuları içerir:

**Örnek Oyuncular**: RIENS, LOITA, ASPAS, VALYN, ETHAN, SKUBA, PETRA, TRENT, KARON, FOXY9 ve daha fazlası...

Oyuncular ülkelere göre organize edilir:
- 🇹🇷 Türkiye
- 🇺🇸 Amerika
- 🇪🇺 Avrupa  
- 🇧🇷 Brezilya
- 🇰🇷 Güney Kore
- 🇸🇬 Singapur

## 🛠️ Teknik Detaylar

### Frontend
- **HTML5**: Semantik yapı
- **CSS3**: Grid, Flexbox, Gradients, Animasyonlar
- **JavaScript**: Vanilla JS, modular yapı


## 📝 Oyuncu Listesi Yönetimi

### Yeni Oyuncu Ekleme
Oyuncu listesi doğrudan `script.js` içinde `REGION_PLAYERS` objesinde tutulur:

```javascript
const REGION_PLAYERS = {
    emea: ['QRAXS', 'CLOUD', 'RUXIC', 'RIENS', ..., 'REDGAR', 'TREBOL'],
    na: ['ASUNA', 'CRYO_', 'DICEY', 'FROSTY', ..., 'DEMON1', 'ETHAN_']
};
```

**5 ve 6 harfli oyuncular ekleyebilirsiniz:**
- 5 harfli: `'RIENS'`, `'VALYN'`
- 6 harfli: `'REDGAR'`, `'TREBOL'`

1. `script.js` dosyasını açın
2. İlgili bölgeye oyuncu adı ekleyin
3. Dosyayı kaydedin
4. Sayfayı yenileyin

## 🎓 Nasıl Çalışır?

### Günlük Kelime Hesaplaması
```javascript
dayNumber = 2025-10-27 den bugüne gün sayısı
seededRandom(dayNumber) = Pseudo-random sayı (deterministik)
wordIndex = seededRandom(dayNumber) * oyuncu_listesi_uzunluğu
gününn_oyuncusu = oyuncu_listesi[wordIndex]
```

### Dinamik Uzunluk
- Seçilen oyuncu adı 5 harfli ise: 5 kutucuk göster
- Seçilen oyuncu adı 6 harfli ise: 6 kutucuk göster
- `wordLength` otomatik olarak `getDailyWord()` tarafından ayarlanır

### Tahmin Kontrolü
1. Girilen kelime `wordLength` kadar harf olmalı
2. Oyuncu listesinde bulunmalı
3. Sonuç renkleri atanır (yeşil/sarı/gri)

### Kaybetme Koşulu
- 6 tahmin bittiğinde ve kelime bulunmadığında

## 🔒 Güvenlik

- **Şifresiz**: Oyuncu yönetimi doğrudan dosya düzenleme yoluyla
- **localStorage**: Oyun durumu tarayıcıda saklanır (dış ağ yok)
- **CORS**: API açıktır (geliştirme amaçlı)

## 🐛 Sorun Giderme

### Oyun yüklenmiyorsa
- Apache'nin çalıştığını kontrol et
- `http://localhost/` URL'i kontrol et
- Tarayıcı konsolunu aç (F12) ve hataları kontrol et


### Dil değişmiyor
- localStorage temizle: DevTools > Application > Clear
- Sayfayı yenile

## 📱 Responsive Tasarım

- **Desktop**: Full-size tiles ve keyboard
- **Tablet**: Medium boyutlar
- **Mobil**: Optimize edilmiş (32px keys, 45px tiles)

## 🎮 Oyun İpuçları

1. **Başlamak**: Yaygın harfleri içeren kelimelerle başla
2. **Strateji**: Sarı harf konumlarını serbest test et
3. **Zaman Planlaması**: Kahvaltıda oyna, günde 1 kez sınırlaması var

## 📈 İstatistikler

- **Toplam Oyuncu**: 30+
- **Oyun Süresi**: 5-10 dakika
- **Günlük Tekrar**: Evet (1x/gün)
- **Dil Seçeneği**: 2 (Türkçe + İngilizce)

## 📄 Lisans

MIT - Özgürce kullanabilirsiniz

**GG! Valorant dünyasında Wordle oyna ve profesyonel oyuncuları tanı!** 🎯🔥

Soru veya öneri için: GitHub Issues

**Son Güncelleme**: 2025-10-26
