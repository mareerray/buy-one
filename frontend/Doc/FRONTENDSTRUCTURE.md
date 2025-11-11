Angular Project Structure (Mirroring Your React App)

```
quirk-cotton-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── about/
│   │   │   │   ├── about.component.ts
│   │   │   │   ├── about.component.html
│   │   │   │   └── about.component.css
│   │   │   ├── auth/
│   │   │   │   ├── sign-in/
│   │   │   │   │   ├── sign-in.component.ts
│   │   │   │   │   ├── sign-in.component.html
│   │   │   │   │   └── sign-in.component.css
│   │   │   │   └── sign-up/
│   │   │   │       ├── sign-up.component.ts
│   │   │   │       ├── sign-up.component.html
│   │   │   │       └── sign-up.component.css
│   │   │   ├── categories/
│   │   │   │   └── category-explorer/
│   │   │   ├── hero/
│   │   │   │   └── hero/
│   │   │   ├── layout/
│   │   │   │   ├── navigation/
│   │   │   │   ├── footer/
│   │   │   │   └── logo/
│   │   │   ├── products/
│   │   │   │   ├── product-card/
│   │   │   │   ├── product-detail/
│   │   │   │   └── product-listing/
│   │   │   └── seller/
│   │   │       ├── media-management/
│   │   │       ├── product-management/
│   │   │       ├── seller-dashboard/
│   │   │       ├── seller-profile/
│   │   │       ├── seller-storefront/
│   │   │       └── sellers-browse/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── seller.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── product.model.ts
│   │   │   └── seller.model.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── seller.guard.ts
│   │   ├── data/
│   │   │   └── mock-users.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app-routing.module.ts
│   ├── assets/
│   └── styles.css
└── angular.json
```