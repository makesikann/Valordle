# 🎯 VALORDLE - Valorant Wordle

Valorant profesyonel oyuncularının isimleriyle oynanan Wordle oyunu! Her gün yeni bir oyuncu adını tahmin et ve hedef tahtasına vur!

## 🎮 Oyun Nasıl Oynanır?

1. **Amaç**: Haftanın oyuncusu adını 6 denemede tahmin et
2. **Tahmin**: Her tahmin 5 harfli bir Valorant pro oyuncusunun adı olmalı
3. **Geri Bildirim**: 
   - 🟩 **Yeşil (Headshot!)**: Harf doğru pozisyondadır
   - 🟨 **Sarı (Lit!)**: Harf kelimede var ama yanlış yerde
   - ⬛ **Gri (Miss!)**: Harf kelimede yok

## 📁 Proje Yapısı

```
valordle/
├── index.html              # Ana oyun arayüzü
├── styles.css              # Valorant temalı CSS
├── script.js               # Oyun mantığı (JavaScript)
├── i18n.js                 # Türkçe/İngilizce çeviri sistemi
├── api_players.php         # PHP API - Oyuncu isimleri
├── font/
│   └── valorant.ttf        # Custom Valorant fontu
├── data/
│   └── players.json        # Valorant pro oyuncuları (30+)
└── README.md               # Türkçe dokümantasyon (bu dosya)
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- XAMPP veya benzeri PHP sunucusu (Apache)
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
   http://localhost/valordle/
   ```

4. **Oyna!** 🎮

## 🎯 Özellikler

### ✅ Temel Özellikler
- 🎮 Günlük oyuncu adı sistemi (herkes aynı oyuncu adını alır)
- 6️⃣ 6 deneme hakkı
- 🌐 Türkçe/İngilizce dil seçeneği
- 💾 Oyun durumu otomatik kaydedilir
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

### Backend
- **PHP**: Lightweight API
- **JSON**: Veri depolama
- **CORS**: Cross-origin istekler

### API Endpoints
```
GET /api_players.php?action=player-names     # Tüm oyuncu adları
GET /api_players.php?action=daily-player-word # Günün oyuncusu
```

## 📝 Oyuncu Listesi Yönetimi

### Yeni Oyuncu Ekleme
1. `data/players.json` dosyasını açın
2. Yeni oyuncu ekleyin (5 harfli isim):
```json
{
  "team": "Takım Adı",
  "player_name": "NICKNAME",
  "real_name": "Gerçek Ad",
  "region": "Bölge"
}
```
3. Dosyayı kaydedin
4. Sayfayı yenileyin

### Kelime Listesi Düzenleme
- Alternatif kelimeler: `data/words.json`
- Format: 5 harfli, büyük harfle yazılı

## 🎓 Nasıl Çalışır?

### Günlük Kelime Hesaplaması
```javascript
dayNumber = 2024-01-01 den bugüne gün sayısı
wordIndex = dayNumber % oyuncu_listesi_uzunluğu
günün_oyuncusu = oyuncu_listesi[wordIndex]
```

### Tahmin Kontrolü
1. Girilen kelime 5 harf olmalı
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
- `http://localhost/valordle/` URL'i kontrol et
- Tarayıcı konsolunu aç (F12) ve hataları kontrol et

### Kelimeler yüklenmiyorsa
- `data/players.json` dosyasının var olduğunu kontrol et
- JSON format geçerli mi kontrol et (`https://jsonlint.com`)
- API call: `http://localhost/valordle/api_players.php?action=player-names`

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

## 🤝 Katkı

Yeni oyuncuları veya önerileri şu dosyaya ekleyebilirsiniz:
- `data/players.json` - Oyuncu listesi

## 📄 Lisans

MIT - Özgürce kullanabilirsiniz


## 🔗 Hızlı Linkler

- 🌐 [Oyunu Oyna](http://localhost/valordle/)
- 🎯 [API Docs](./api_players.php)
- 🎨 [Stil Dosyası](./styles.css)

---

**GG! Valorant dünyasında Wordle oyna ve profesyonel oyuncuları tanı!** 🎯🔥

Soru veya öneri için: GitHub Issues

**Son Güncelleme**: 2025-10-26
