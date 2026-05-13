# Changelog


## 2026-05-12 — 5ec320a

feat: ongoing work

Files changed:
   .gitignore                               |  36 +++++
   README.md                                | 229 +++++++++++++++++++++++++++++++
   app/account/page.tsx                     | 128 +++++++++++++++++
   app/api/create-checkout-session/route.ts |  61 ++++++++
   app/api/create-portal-session/route.ts   |  34 +++++
   app/api/webhooks/route.ts                | 177 ++++++++++++++++++++++++
   app/auth/callback/route.ts               |  14 ++
   app/dashboard/page.tsx                   | 118 ++++++++++++++++
   app/globals.css                          |  27 ++++
   app/layout.tsx                           |  19 +++
   app/page.tsx                             | 143 +++++++++++++++++++
   app/pricing/page.tsx                     | 160 +++++++++++++++++++++
   app/signin/page.tsx                      | 136 ++++++++++++++++++
   app/signup/page.tsx                      | 147 ++++++++++++++++++++
   next.config.js                           |   8 ++
   package.json                             |  33 +++++
   postcss.config.js                        |   6 +
   supabase/schema.sql                      | 141 +++++++++++++++++++
   tailwind.config.ts                       |  19 +++
   tsconfig.json                            |  27 ++++
   types/stripe.ts                          |  46 +++++++
   types/supabase.ts                        | 221 +++++++++++++++++++++++++++++
   utils/stripe/client.ts                   |  12 ++
   utils/stripe/server.ts                   |   9 ++
   utils/supabase/client.ts                 |   7 +
   utils/supabase/server.ts                 |  33 +++++
   26 files changed, 1991 insertions(+)
