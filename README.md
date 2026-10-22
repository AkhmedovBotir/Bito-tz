# Mini-ERP — Ichimliklar do'koni

Modular monolith: **backend** (Node.js + Express + MongoDB) va **frontend** (React + Tailwind + Framer Motion).

## Dokumentatsiya (Qoida 2)

| Hujjat | Tavsif |
|--------|--------|
| [docs/LOYIHA_TUSHUNTIRUVI.md](./docs/LOYIHA_TUSHUNTIRUVI.md) | Loyiha nega shunday qurilgani (arxitektura) |
| [docs/FOYDALANUVCHI_QOLLANMASI.md](./docs/FOYDALANUVCHI_QOLLANMASI.md) | Tizimdan qanday foydalanish |
| [prompts.txt](./prompts.txt) | AI promptlari (Qoida 3) |
| [texnik_topshiriq.md](./texnik_topshiriq.md) | Asl texnik topshiriq |

## Papka tuzilmasi

```
TZ ERP/
├── texnik_topshiriq.md
├── prompts.txt
├── docs/                    # tushuntirish + foydalanuvchi qo‘llanmasi
├── backend/                 # modular monolith API
│   └── src/
│       ├── modules/
│       ├── shared/
│       ├── app.js
│       └── server.js
└── frontend/                # modular monolith UI
    └── src/
        ├── modules/
        ├── shared/
        └── app/
```

## Ishga tushirish

### Backend
```bash
cd backend
npm install
# MongoDB ishlayotgan bo'lsin
cp .env.example .env   # kerak bo'lsa
npm run create-store   # birinchi do'kon (yoki UI /register)
npm run dev
```

`create-store` misol:
```bash
npm run create-store -- "Cola Market" "+998901112233" admin "secret123"
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

API: `http://localhost:5000`  
UI: `http://localhost:5173` → `/login` yoki `/register`

## Asosiy oqim
1. Mahsulot + Ombor/kichik ombor yaratish  
2. Xarid (qoralama → bajarish) → omborga kirim  
3. Savdo (qoralama → bajarish) → ombordan chiqim + qarz (agar to‘liq to‘lanmasa)  
4. Kassa: yo‘l kira chiqimi  
5. Inventarizatsiya: farqlar akti → omborni to‘g‘rilash  
6. Hisobotlar: qoldiq / savdo / P&L
