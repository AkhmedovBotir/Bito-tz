# Loyiha tushuntiruvi — nima uchun shunday qurilgan?

Bu hujjat **texnik topshiriq**dagi «Qoidalar → 2. Loyihani tushuntirish va dokumentatsiya» bandining birinchi talabini bajaradi: loyiha nega aynan shunday arxitektura va texnologiyalar bilan qurilgani.

---

## 1. Muammo va maqsad

Ichimliklar do‘koni egasi uchun mini-ERP kerak edi. Asosiy og‘riq nuqtalari:

1. Ombordagi qoldiq noaniq (dona va blok alohida ko‘rinmaydi).
2. Sof foyda ko‘rinmaydi (faqat oldi-sotdi emas — qarz, yo‘l kira ham bor).
3. Mahsulot qayerda turgani noma’lum (ombor / kichik ombor).

Tizim shu uchta muammoni yopishi uchun qurildi: **qoldiq + joylashuv + pul harakati + P&L**.

---

## 2. Nima uchun modular monolith?

### Tanlov

Backend ham, frontend ham **modular monolith** qilib qurildi — ya’ni bitta ilova, lekin ichida domenlar alohida modullarga bo‘lingan.

### Nega mikroservis emas?

- Loyiha kichik do‘kon uchun: bitta jamoa, bitta deploy, bitta baza yetarli.
- Mikroservislar tarmoq, monitoring, deploy murakkabligini oshiradi — bu bosqichda ortiqcha.
- Modular monolith keyinchalik kerak bo‘lsa, modulni alohida servisga ajratishga yaqinroq tuzilma beradi.

### Modul chegaralari (domenlar)

| Modul | Vazifa |
|--------|--------|
| `auth` | Do‘kon ro‘yxati, login, JWT |
| `products` | Mahsulot, dona/blok konvertatsiya |
| `warehouses` | Ombor, kichik ombor, stock |
| `purchases` | Xarid (kirim) — yaratish / bajarish |
| `sales` | Savdo (chiqim) — yaratish / bajarish |
| `inventory` | Inventarizatsiya / farqlar akti |
| `cash` | Kassa kirim-chiqim |
| `debts` | Mijoz va ta’minotchi qarzlari |
| `reports` | Qoldiq, savdo, P&L |

Har bir modul odatda: `model` → `service` → `controller` → `routes`.

Umumiy kod (`shared`): config, middleware, xato ishlov, birliklar (dona/blok).

---

## 3. Texnologiya tanlovi

### Backend: Node.js + Express + MongoDB

- **Node.js + Express** — tez API yozish, JavaScript ekotizimi, frontend bilan bir xil til.
- **MongoDB + Mongoose** — ombor/sub-ombor, hujjat qatorlari (lines) kabi ichki massivlar qulay; do‘kon bo‘yicha (`store`) filtrlash oddiy.
- **JWT + bcrypt** — do‘kon akkaunti himoyasi; har bir so‘rov `storeId` bilan cheklanadi (multi-tenant sodda model).

### Frontend: React + Vite + Tailwind + Framer Motion

- **React + Vite** — zamonaviy UI, tez ishlanadi.
- **Tailwind** — tez va izchil dizayn.
- **Framer Motion** — modal, sidebar, sahifa o‘tishlari uchun yengil animatsiya.
- **Modular UI** — `modules/*` (sahifalar), `shared/*` (layout, API, dialog, select).

### Nega alohida frontend va backend?

- UI va API mustaqil rivojlantiriladi.
- Keyinchalik mobil ilova yoki boshqa klient API’ni qayta ishlatishi mumkin.

---

## 4. Biznes qoidalari qanday kodga tushgan?

### 4.1. Dona va blok

- Omborda asosiy saqlash birligi: **dona** (`qtyPieces`).
- Mahsulotda: `unitsPerBlock` (masalan, 1 blok = 24 dona).
- UI va hisobotlarda: `dona` + `blok` avtomatik hisoblanadi (`shared/utils/units.js`).

**Nega donada saqlanadi?** Blok o‘lchami mahsulotdan mahsulotga farq qilishi mumkin; dona — yagona aniq o‘lchov. Blok faqat ko‘rsatish/kiritish uchun.

### 4.2. Yaratish va bajarish — ikki qadam

Xarid, savdo, inventarizatsiya:

1. **Qoralama (`draft`)** — hujjat ochiladi, ombor hali o‘zgarmaydi.
2. **Bajarish (`posted`)** — shunda stock, kassa va qarz yozuvlari yaratiladi.

**Nega?** Xato kiritishni tuzatish oson; ombor faqat tasdiqlanganda o‘zgaradi. Bajarilgan hujjatni o‘zgartirish/o‘chirish taqiqlangan — tarix buzilmasin.

### 4.3. Qarzlar

- Savdo: `paidAmount < total` → **mijoz qarzi** (`receivable`).
- Xarid: to‘liq to‘lanmasa → **ta’minotchi qarzi** (`payable`).
- Yo‘l kira va boshqa xarajatlar — to‘g‘ridan-to‘g‘ri **kassa chiqimi**.

### 4.4. P&L formulasi

```
Sof foyda = Tushumlar − Tannarx − Xarajatlar
```

- **Tushumlar** — bajarilgan savdolar jami.
- **Tannarx** — savdo paytidagi `cogsAmount` (dona × tannarx).
- **Xarajatlar** — kassadagi `transport` / `expense` / `other` chiqimlari.

Bu do‘kon egasiga «qancha sof qoldi?» savoliga to‘g‘ridan-to‘g‘ri javob beradi.

---

## 5. Frontend arxitekturasi

```
frontend/src/
├── app/           # router
├── modules/       # domen sahifalari (products, sales, ...)
└── shared/
    ├── api/       # fetch + JWT
    ├── layout/    # Sidebar, Navbar, AppShell
    ├── ui/        # Modal, Dialog, Select, Button...
    ├── hooks/
    └── lib/       # o‘zbekcha label’lar
```

### UI qarorlari

- **Hamburger + responsive sidebar** — planshetdan kichikda drawer, kattada doim ochiq.
- **CRUD modallarda** — sahifa toza qoladi, jadval asosiy ko‘rinish.
- **Custom Select + qidiruv** — ko‘p mahsulot/ombor bo‘lganda qulay.
- **Modal dialog** (`confirm` / `alert` / `prompt` o‘rniga) — bir xil UX, brauzer oynalariga bog‘liq emas.

---

## 6. Xavfsizlik va do‘kon konteksti

- Login/register → JWT.
- Himoyalangan API’lar `requireAuth` orqali.
- Barcha biznes ma’lumotlar `store` maydoni bilan bog‘langan — bir do‘kon boshqasining ma’lumotini ko‘rmaydi.
- Birinchi do‘kon: UI `/register` yoki `npm run create-store`.

---

## 7. Papka xaritasi (qisqa)

```
TZ ERP/
├── texnik_topshiriq.md          # asl topshiriq
├── prompts.txt                  # AI promptlari (Qoida 3)
├── README.md                    # ishga tushirish
├── docs/
│   ├── LOYIHA_TUSHUNTIRUVI.md   # shu fayl
│   └── FOYDALANUVCHI_QOLLANMASI.md
├── backend/
└── frontend/
```

---

## 8. Kelajakdagi kengaytirish (ixtiyoriy)

Hozirgi tuzilma quyidagilarga yo‘l ochadi:

- Qarzni qisman to‘lash oqimi.
- Bir hujjatda bir nechta qator (hozir asosan bitta qator UI orqali).
- Rollar (sotuvchi / egasi).
- Excel/PDF eksport.

Lekin asosiy topshiriq doirasidagi funksiyalar allaqachon modular qilib yopilgan.
