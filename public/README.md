# public/

Бүх public assets энд оршино — зургууд, favicon г.м.

## Hero image

Hero-н гол зургийг **`hero.png`** нэрээр энэ folder-д хадгал.

- Рекомендция: PNG formattай, transparent background
- Хэмжээ: ~1200×1400px
- Сайтын яг тэр composition-той (model + бараа) бол хамгийн зөв

Хэрэв `hero.png` байхгүй бол Hero component автоматаар Unsplash fallback ашиглана.

## Reviewer portraits (сонголтын)

Customer reviews хэсэгт өөрийн customer-уудын зураг ашиглах бол:
- `reviewer-1.jpg`, `reviewer-2.jpg`, ... нэрээр хадгал
- Дараа нь `components/CustomerReviews.tsx` дээр URL-уудыг солих
