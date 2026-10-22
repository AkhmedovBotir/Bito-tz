# Texnik topshiriq: Ichimliklar do'koni uchun mini-ERP

October 20, 2026

## Topshiriq

Ichimliklar sotadigan do'kon uchun kichik ERP tizimini qurish kerak. Tizim do'kon egasiga ombordagi tovarlarni, ularning qayerda turganini va biznesi qancha sof foyda keltirayotganini aniq ko'rsatishi lozim.

## Mijozning asosiy muammolari

### 1. Ombordagi qoldiq noaniq

Do'kon egasi omborida qancha tovar borligini aniq bilmaydi. Masalan, "Hozir nechta dona Cola bor?" va "Nechta blokda Cola bor?" degan savollarga javob bera olmaydi.

Tizim har bir mahsulot qoldig'ini ham dona, ham blok ko'rinishida aniq ko'rsatishi kerak.

### 2. Sof foyda ko'rinmaydi

Do'kon egasi sof foydasi qancha ekanini ko'ra olmaydi. Uning pul harakatlari faqat oldi-sotdi bilan cheklanmaydi:

* qarz berish;
* qarz olish;
* yo'l kira kabi xarajatlar.

U bu operatsiyalarning barchasini tizimga kiritadi. Tizim ularni hisobga olgan holda sof foydani to'g'ri hisoblab ko'rsatishi kerak.

### 3. Mahsulot qayerda turgani noma'lum

Do'kon egasi har bir mahsulotning omborda qayerda joylashganini ko'rib tura olishi kerak. Ya'ni qaysi mahsulot qaysi ombor yoki sub-omborda va qancha miqdorda turgani ko'rinishi lozim.

## Qo'shilishi kerak bo'lgan funksiyalar

### 1. Mahsulot yaratish

Foydalanuvchi tizimga yangi mahsulot qo'sha olishi kerak. Mahsulot ma'lumotlari uning qoldig'ini dona va blokda ko'rsatish imkonini berishi lozim.

### 2. Ombor yaratish (sub-omborlar bilan)

Foydalanuvchi ombor yarata olishi va uning ichida sub-omborlar yarata olishi kerak. Mahsulotlar shu omborlar va sub-omborlarda joylashadi — mahsulot joylashuvi aynan shu orqali ko'rinadi.

### 3. Savdo yaratish va bajarish

Foydalanuvchi savdo hujjatini yarata olishi va uni bajara olishi kerak. Yaratish va bajarish — ikki alohida amal. Savdo bajarilganda tovar ombordan chiqadi.

### 4. Xarid yaratish va bajarish

Foydalanuvchi xarid hujjatini yarata olishi va uni bajara olishi kerak. Yaratish va bajarish — ikki alohida amal. Xarid bajarilganda tovar omborga kiradi.

### 5. Inventarizatsiya

Foydalanuvchi ombordagi tovarlarni sanab, haqiqiy qoldiqni tizimga kirita olishi kerak. Tizimdagi qoldiq haqiqiy holatga moslashtiriladi.

### 6. Kassa: kirim va chiqim

Foydalanuvchi kassaga pul kirimi va kassadan pul chiqimini kirita olishi kerak. Qarz berish, qarz olish va yo'l kira kabi xarajatlar shu yerda kiritiladi.

## Qo'shilishi kerak bo'lgan hisobotlar

### 1. Mahsulotlar qoldig'i

* Har bir mahsulot qoldig'i **dona va blokda** ko'rsatiladi.
* Qoldiq **joylashuv bo'yicha** ham ko'rsatiladi: qaysi ombor va sub-omborda qancha turibdi.

### 2. Savdo hisobotlari

Amalga oshirilgan savdolar bo'yicha hisobotlar.

### 3. P&L hisoboti

Foyda va zarar hisoboti. U do'kon egasiga sof foydasi qanchaligini ko'rsatishi kerak.

## Qoidalar

### 1. AI'dan foydalanish

Istalgan tool'ni ishlatish mumkin. Topshiriq AI yordamida bajarilishi kerak.

### 2. Loyihani tushuntirish va dokumentatsiya

Ikki narsa talab qilinadi:

1. **Loyihani to'liq tushuntirish.** Loyiha nega aynan shunday qurilgani tushuntirilishi kerak.
2. **Foydalanuvchi uchun yozma dokumentatsiya.** Tizimdan qanday foydalanish yozma ravishda hujjatlashtirilishi kerak.

### 3. AI promptlari

AI'ga berilgan promptlar dokumentatsiyaning bir qismida to'liq yozilishi kerak.