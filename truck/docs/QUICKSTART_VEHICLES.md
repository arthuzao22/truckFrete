# Vehicle Management - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Files Exist
```bash
# Check that all files were created
ls -l app/(dashboard)/veiculos/page.tsx
ls -l components/veiculos/
ls -l app/api/veiculos/[id]/route.ts
ls -l app/api/implementos/[id]/route.ts
```

### Step 2: Start Development Server
```bash
cd /home/runner/work/truckFrete/truckFrete/truck
npm run dev
```

### Step 3: Access the Page
```
1. Open browser: http://localhost:3000
2. Login with your credentials
3. Navigate to: /veiculos
```

## 📋 Quick Test Checklist

### ✅ Basic Flow
1. [ ] Page loads without errors
2. [ ] "Cadastrar Novo Veículo" button visible
3. [ ] Empty state shows if no vehicles
4. [ ] Click button opens modal

### ✅ Add Vehicle
1. [ ] Fill in all required fields:
   - Tipo: Cavalo Mecânico
   - Marca: Scania
   - Modelo: R450
   - Ano: 2023
   - Cor: Branco
   - Placa: ABC1D23
   - RENAVAM: 12345678901
   - Tração: 6x4
2. [ ] Click "Cadastrar Veículo"
3. [ ] Modal closes
4. [ ] Vehicle appears in grid

### ✅ Add Implemento
1. [ ] Click "Adicionar Implemento" on vehicle card
2. [ ] Fill in fields:
   - Estrutura: Semirreboque Simples
   - Aplicação: Baú
   - Placa: DEF4E56
   - RENAVAM: 98765432109
   - Eixos: 3
   - Peso: 30000 kg
   - Volume: 90 m³
3. [ ] Click "Cadastrar Implemento"
4. [ ] Implemento appears in list

### ✅ View Implementos
1. [ ] Click "Ver" to expand implementos
2. [ ] See implemento details
3. [ ] Click "Ocultar" to collapse

### ✅ Delete Implemento
1. [ ] Click trash icon on implemento
2. [ ] Confirm deletion
3. [ ] Implemento disappears from list

## 🐛 Common Issues & Solutions

### Issue: Page not loading
**Solution:**
```bash
# Check if auth is working
# Verify you're logged in
# Check console for errors
```

### Issue: "Não autenticado" error
**Solution:**
```bash
# Login again
# Check NEXTAUTH_SECRET in .env
# Verify middleware.ts is working
```

### Issue: "Placa já cadastrada"
**Solution:**
- Use a different plate number
- Each vehicle/implemento needs unique placa

### Issue: Modal not closing after submit
**Solution:**
- Check browser console for errors
- Verify API route is responding
- Check network tab for 200/201 responses

## 📁 File Structure Overview

```
truck/
├── app/
│   ├── (dashboard)/
│   │   └── veiculos/
│   │       └── page.tsx ← START HERE
│   └── api/
│       ├── veiculos/
│       │   ├── route.ts (existing)
│       │   └── [id]/route.ts (new)
│       └── implementos/
│           ├── route.ts (existing)
│           └── [id]/route.ts (new)
├── components/
│   ├── veiculos/
│   │   ├── VeiculosList.tsx
│   │   ├── VeiculoCard.tsx
│   │   ├── VeiculoFormModal.tsx
│   │   └── ImplementoFormModal.tsx
│   └── ui/
│       ├── Button.tsx (existing)
│       ├── Card.tsx (existing)
│       ├── Input.tsx (existing)
│       └── Select.tsx (new)
└── docs/
    ├── VEHICLE_MANAGEMENT.md
    ├── COMPONENT_TREE.md
    ├── VEHICLE_SYSTEM_SUMMARY.md
    └── QUICKSTART_VEHICLES.md ← YOU ARE HERE
```

## 🎯 Key URLs

| URL | Description |
|-----|-------------|
| `/veiculos` | Main vehicles page |
| `/api/veiculos` | List/create vehicles |
| `/api/veiculos/[id]` | Get/delete vehicle |
| `/api/implementos` | List/create implementos |
| `/api/implementos/[id]` | Get/delete implemento |

## 🔍 Debugging Tips

### Check API Response
```bash
# Test vehicle listing
curl http://localhost:3000/api/veiculos \
  -H "Cookie: your-session-cookie"

# Should return:
# {
#   "data": [...],
#   "pagination": { page: 1, limit: 10, total: X }
# }
```

### View Console Logs
```javascript
// Open browser DevTools (F12)
// Check Console tab for:
// - Error messages
// - Network requests
// - State updates
```

### Database Check
```bash
# Open Prisma Studio
npx prisma studio

# Navigate to:
# - Veiculo table
# - Implemento table
# Verify data is being saved
```

## 📊 Expected Behavior

### On Load
1. Shows loading spinner
2. Fetches vehicles from API
3. Renders grid or empty state
4. No console errors

### On Add Vehicle
1. Opens modal
2. Validates form fields
3. POSTs to API
4. Closes modal on success
5. Refreshes vehicle list
6. New vehicle appears

### On Add Implemento
1. Opens modal with veiculoId
2. Validates form fields
3. POSTs to API
4. Closes modal on success
5. Refreshes vehicle list
6. Implemento appears under correct vehicle

### On Delete Implemento
1. Shows confirmation dialog
2. DELETEs via API
3. Removes from UI
4. Refreshes vehicle list

## 🎨 Visual Indicators

| State | Indicator |
|-------|-----------|
| Loading | Spinning circle |
| Success | Item appears in list |
| Error | Red alert box |
| Empty | Placeholder with CTA |
| Hover | Shadow increase |
| Active | Blue highlight |

## ⚡ Performance Tips

1. **Pagination**: API supports `?page=1&limit=10`
2. **Soft Delete**: Data not actually deleted
3. **Server Components**: Main page pre-rendered
4. **Client Components**: Only modals and forms
5. **Optimistic Updates**: UI updates before API response

## 🔐 Security Notes

- All routes require authentication
- Users can only see their own vehicles
- Plate validation prevents duplicates
- Soft deletes preserve data integrity
- SQL injection prevented by Prisma

## 📞 Need Help?

1. **Check docs**: Read VEHICLE_MANAGEMENT.md
2. **View components**: See COMPONENT_TREE.md
3. **Review code**: All files have inline comments
4. **Test API**: Use Postman or curl
5. **Debug**: Check browser console and Network tab

## ✨ Next Steps

Once vehicle management is working:

1. **Test on mobile** - Verify responsive design
2. **Add photos** - Implement image upload
3. **Edit vehicles** - Create update functionality
4. **Search/filter** - Add vehicle search
5. **Export data** - PDF/Excel export
6. **Integration** - Connect to frete matching

---

🚛 **FreteConnect** - Vehicle Management System
Happy coding! 🎉
