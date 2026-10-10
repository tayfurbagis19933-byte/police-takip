# Poliçe Takip: Kurulum (iPhone, bilgisayarsız)

Pakette: `index.html` (uygulama), `manifest.json`, `sw.js`, ikonlar, `supabase-kurulum.sql`.
Hepsi aynı klasörde durmalı. Dosyalar bir zip içinde gelirse Dosyalar uygulamasında zip'e dokun, klasör açılır.

## 1) Eski verini kurtar (varsa)
Eski uygulamanı hâlâ açabiliyorsan: Ayarlar > "Yedek indir" ile JSON yedeği al. Yeni uygulamada "Yedek yükle" ile geri koyarsın.
Önemli: Safari'de açılan sayfa ile Ana Ekrana eklenen uygulamanın verileri **ayrıdır**. Bu yüzden asıl çözüm 3. adımdaki buluttur.

## 2) Supabase (ücretsiz hesap, 5 dakika)
1. supabase.com > yeni hesap > "New project" (bölge: Frankfurt).
2. Sol menü **SQL Editor** > yeni sorgu > `supabase-kurulum.sql` içeriğini yapıştır > **Run**.
3. **Authentication > Providers > Email**: "Confirm email" kapalı olsun (kolaylık için).
4. **Project Settings > API**: "Project URL" ve "anon public" anahtarı kopyala.
5. Kendi hesabını uygulamada oluşturduktan sonra **Authentication > Sign In / Providers** bölümünden "Allow new users to sign up" seçeneğini kapat (başkası hesap açamasın).

## 3) Uygulamayı yayına al (ücretsiz, telefondan)
1. github.com'da hesap aç > yeni repo (Public) > "Add file > Upload files" ile paketteki tüm dosyaları yükle (`supabase-kurulum.sql` hariç tutabilirsin).
2. Repo > **Settings > Pages** > Branch: `main` / root > Save.
3. 1-2 dakika sonra `https://KULLANICIADIN.github.io/REPOADI/` adresi çalışır. Sayfa herkese açık olur ama içinde veri yoktur; veriler giriş yapınca Supabase'den gelir.

## 4) iPhone'a uygulama olarak ekle
Safari'de adresi aç > Paylaş > **Ana Ekrana Ekle**. Uygulamayı **bu ikondan** aç.
İlk açılışta Ayarlar > "Bulut yedekleme": proje adresi, anon anahtar, e-posta, şifre > **Hesap oluştur** (sonra Giriş yap). Eşitleme otomatik başlar.

## 5) Poliçeleri yükle
- Toplu yükleme: PDF veya fotoğrafları çoklu seç. Okunamayanlar **Kontrol** sekmesine düşer.
- Fotoğraftan okunan kayıtlar her zaman Kontrol'e düşer; rakamları belgeyle karşılaştır.
- Excel'de listen varsa "CSV olarak kaydet" > "Excel/CSV'den içe aktar".
- Yükleme sürerken uygulamayı açık tut.

## Bilmen gerekenler
- Supabase ücretsiz pakette belge depolama **1 GB**. 5.000 poliçe PDF'i ortalama 200 KB ise yaklaşık 1 GB eder; dolarsa Pro pakete (aylık 25 $) geçmek gerekir. Fotoğraflar yüklenirken otomatik küçültülür.
- Yükleme sırasında bilgi okuma (OCR) ilk seferde internetten küçük bir kütüphane indirir.
- Mevcut e-posta hatırlatma (Resend) ayarı bu pakette değişmedi.
