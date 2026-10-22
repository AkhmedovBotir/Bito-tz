# Foydalanuvchi qo‘llanmasi — Ichimliklar do‘koni Mini-ERP

Bu hujjat do‘kon egasi yoki operator uchun: tizimdan qanday foydalanish bosqichma-bosqich tushuntiriladi.

---

## 1. Tizimga kirish

### 1.1. Yangi do‘kon ochish

1. Brauzerda frontend manzilini oching (odatda `http://localhost:5173`).
2. **Ro‘yxatdan o‘tish** sahifasiga o‘ting.
3. To‘ldiring:
   - Do‘kon nomi  
   - Telefon  
   - Login  
   - Parol  
4. **Ro‘yxatdan o‘tish** tugmasini bosing.

> Alternativa (texnik): backend papkasida  
> `npm run create-store -- "Do‘kon nomi" "+99890..." login "parol"`

### 1.2. Mavjud hisob bilan kirish

1. **Kirish** sahifasida login va parolni kiriting.
2. **Kirish** tugmasini bosing.
3. Boshqaruv paneli ochiladi.

### 1.3. Chiqish

Yuqori o‘ngdagi **chiqish** (ikonka) tugmasini bosing.

---

## 2. Interfeys qisqacha

| Qism | Vazifa |
|------|--------|
| **Sidebar (chap menyu)** | Bo‘limlarga o‘tish. Katta ekranda doim ochiq; planshet/telefonda hamburger orqali ochiladi. |
| **Navbar (yuqori panel)** | Do‘kon nomi, telefon, login; chiqish tugmasi. |
| **Asosiy maydon** | Jadvallar, hisobotlar, tugmalar. |
| **Modal oynalar** | Qo‘shish, tahrirlash, ko‘rish, o‘chirishni tasdiqlash. |

**Amallar** ustunidagi ikonkalar:

- Ko‘z — ko‘rish  
- Qalam — tahrirlash  
- Belgilash — bajarish / tasdiqlash  
- Axlat quti — o‘chirish  

O‘chirishda brauzer emas, **tizim modal oynasi** chiqadi.

---

## 3. Tavsiya etiladigan ish tartibi (birinchi kun)

1. Mahsulotlar qo‘shing.  
2. Ombor va kichik ombor yarating.  
3. Xarid hujjatini oching va **bajaring** (omborga kirim).  
4. Kerak bo‘lsa savdo qiling va **bajaring**.  
5. Yo‘l kira kabi xarajatni kassaga yozing.  
6. Hisobotlarda qoldiq va sof foydani tekshiring.

---

## 4. Mahsulotlar

**Menyu → Mahsulotlar**

### Yangi mahsulot

1. **+ Yangi mahsulot**  
2. To‘ldiring:
   - Nomi (masalan, Cola)  
   - 1 blokda nechta dona (masalan, 24)  
   - Sotuv narxi (1 dona)  
   - Tannarx (1 dona)  
3. Pastidagi **Hisoblash misoli** orqali blok ↔ dona tushunishingiz mumkin.  
4. **Qo‘shish**.

### Tahrirlash / o‘chirish / ko‘rish

Jadvaldagi **Amallar** ikonkalaridan foydalaning.

> Tizim ichida qoldiq **dona**da saqlanadi. Blok faqat qulay kiritish va ko‘rsatish uchun.

---

## 5. Omborlar

**Menyu → Omborlar**

### Asosiy ombor

1. **+ Yangi ombor**  
2. Nom kiriting (masalan, «Asosiy ombor»).  
3. Avtomatik birinchi kichik ombor: **Asosiy zona**.

### Kichik ombor

1. **+ Kichik ombor**  
2. Qaysi asosiy omborga tegishli ekanini tanlang.  
3. Nom bering (masalan, «A steллаж», «Sovuq xona»).

Ombor va kichik omborni tahrirlash/o‘chirish kartochkadagi ikonkalar orqali.

> Savdo va xaridda mahsulot **qaysi ombor + qaysi kichik ombor**da ekanini ko‘rsatish majburiy — shu orqali joylashuv aniq bo‘ladi.

---

## 6. Xarid (kirim)

**Menyu → Xarid (kirim)**

Mol ta’minotchidan kelganda:

1. **+ Yangi xarid**  
2. Ta’minotchi nomi.  
3. Hozir to‘langan summa (agar qisman — qolgani qarz bo‘ladi).  
4. Mahsulot, ombor, kichik ombor.  
5. Miqdor: **blok** va/yoki **dona**.  
6. 1 dona tannarxi.  
7. **Qoralama sifatida saqlash**.

### Bajarish (muhim!)

Jadvalda qoralama yonidagi **bajarish** (belgi) ikonkasini bosing.

**Faqat shundan keyin** ombordagi son ortadi.  
Agar to‘liq to‘lanmagan bo‘lsa — **Qarzlar**da ta’minotchi qarzi paydo bo‘ladi.  
To‘langan qism — kassadan chiqim sifatida yoziladi.

> Bajarilgan xaridni o‘zgartirish/o‘chirish mumkin emas. Xato bo‘lsa — qoralama holatida tuzating yoki o‘chiring.

---

## 7. Savdo (chiqim)

**Menyu → Savdo (chiqim)**

1. **+ Yangi savdo**  
2. Mijoz nomi.  
3. Hozir olingan pul.  
4. Mahsulot, ombor, kichik ombor, miqdor, narx.  
5. Qoralama sifatida saqlang.  
6. **Bajarish**.

Natija:

- Ombordan miqdor kamayadi.  
- To‘langan pul — kassa kirimi.  
- To‘lanmagan qism — **mijoz qarzi**.

---

## 8. Inventarizatsiya

**Menyu → Inventarizatsiya**

Vaqti-vaqti bilan haqiqiy qoldiqni sanash uchun:

1. **+ Farqlar akti**  
2. Mahsulot va joylashuvni tanlang.  
3. Sanalgan blok/dona ni kiriting.  
4. Akt yaratiladi: tizimdagi son, sanalgan son, **farq**.  
5. Tekshirib, **Tasdiqlash** — ombor haqiqiy songa moslashtiriladi.

---

## 9. Kassa

**Menyu → Kassa**

Bu yerda:

- Savdo/xariddan avtomatik yozuvlar.  
- Qo‘lda: yo‘l kira, boshqa xarajat, qarz undirish/to‘lash.

### Yangi pul harakati

1. **+ Pul harakati**  
2. Tur: **Kirim** yoki **Chiqim**.  
3. Kategoriya (masalan, Yo‘l kira).  
4. Summa va izoh.  
5. **Kiritish**.

Yuqorida **joriy kassa qoldig‘i** ko‘rinadi.

---

## 10. Qarzlar

**Menyu → Qarzlar**

- **Mijoz qarzi** — savdodan qolgan.  
- **Ta’minotchi qarzi** — xariddan qolgan.

Ro‘yxatni kuzatib boring; to‘lovlarni kassa orqali yozishingiz mumkin.

---

## 11. Hisobotlar

### 11.1. Qoldiq hisoboti

Har bir mahsulot uchun:

- Summa / dona / blok  
- Qaysi ombor va kichik omborda  

Format misoli: `120 000 so‘m / 48 dona (2 blok)`

### 11.2. Savdo hisoboti

- Kunlik savdo soni va summasi.  
- Eng ko‘p sotilgan mahsulotlar.

### 11.3. Foyda va zarar (P&L)

```
Tushumlar − Tannarx − Xarajatlar = Sof foyda
```

Shuningdek ochiq mijoz va ta’minotchi qarzlari ko‘rsatiladi.

---

## 12. Boshqaruv paneli

**Menyu → Bosh sahifa**

Qisqa kartochkalar: tushumlar, tannarx, xarajatlar, sof foyda.  
Batafsil uchun tegishli hisobotga o‘ting.

---

## 13. Tez-tez uchraydigan savollar

**Savdo bajardim, lekin ombor kamaymadi?**  
Hujjat hali **qoralama** bo‘lishi mumkin. **Bajarish**ni bosing.

**«Omborda yetarli mahsulot yo‘q» xatosi?**  
Avval xaridni bajaring yoki to‘g‘ri ombor/kichik omborni tanlang.

**Blok noto‘g‘ri chiqyapti?**  
Mahsulotdagi «1 blokda nechta dona» ni tekshiring.

**Bajarilgan hujjatni o‘chira olmayapman?**  
Bu ataylab: ombor/kassa tarixi buzilmasligi uchun. Faqat qoralamalarni o‘chirish mumkin.

**Select ochilganda nima qilaman?**  
Yuqoridagi qidiruv maydoniga yozib, mahsulot/omborni tez toping.

---

## 14. Texnik ishga tushirish (qisqa)

Agar siz tizimni o‘zingiz ishga tushirsangiz:

1. MongoDB ishlasin.  
2. `backend` → `npm install` → `npm run dev`  
3. `frontend` → `npm install` → `npm run dev`  
4. Brauzerda `http://localhost:5173`

Batafsil: loyiha ildizidagi `README.md`.

---

## 15. Qo‘shimcha hujjatlar

| Fayl | Mazmun |
|------|--------|
| `docs/LOYIHA_TUSHUNTIRUVI.md` | Nega shunday qurilgani (arxitektura) |
| `prompts.txt` | AI’ga berilgan barcha promptlar |
| `texnik_topshiriq.md` | Asl texnik topshiriq |
