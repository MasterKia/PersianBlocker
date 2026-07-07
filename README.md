# PersianBlocker

<p align="center">
  <strong>یک فهرست فیلتر فارسی برای مسدودسازی تبلیغ‌ها، ردیاب‌ها، مزاحمت‌ها و تهدیدهای رایج در وب فارسی</strong>
</p>

<p align="center">
  <a href="https://github.com/MasterKia/PersianBlocker/blob/main/LICENSE">
    <img alt="License: AGPL v3" src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg">
  </a>
  <a href="https://www.jsdelivr.com/package/gh/MasterKia/PersianBlocker">
    <img alt="jsDelivr" src="https://data.jsdelivr.com/v1/package/gh/MasterKia/PersianBlocker/badge">
  </a>
  <a href="https://github.com/MasterKia/PersianBlocker/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/MasterKia/PersianBlocker?style=social">
  </a>
</p>

> Sayyed Ali "Master" Kia، نویسنده و نگهدارنده اصلی PersianBlocker، درگذشته است. این پروژه یاد و کار او را زنده نگه می‌دارد: بازگرداندن اختیار به کاربر برای اینکه چه چیزی وارد مرورگرش بشود و چه چیزی نشود.

## معرفی

PersianBlocker مجموعه‌ای از فیلترهای سازگار با uBlock Origin، AdGuard و ابزارهای مشابه است که برای وب‌سایت‌های فارسی‌زبان و سرویس‌های پرکاربرد کاربران ایرانی، افغانستانی و تاجیکستانی نگهداری می‌شود.

این پروژه برای مسدودسازی این موارد طراحی شده است:

- تبلیغات نمایشی، پاپ‌آپ‌ها و شبکه‌های تبلیغاتی
- ردیاب‌ها و سامانه‌های تحلیل رفتار کاربر
- مزاحمت‌های بصری و عناصر آزاردهنده صفحه
- دامنه‌های بدافزار، فیشینگ و پیامک‌های ناخواسته
- فهرست‌های hosts و domains برای ابزارهای خارج از مرورگر

## نصب سریع

### uBlock Origin

اگر از uBlock Origin استفاده می‌کنید، روی لینک زیر بزنید و سپس گزینه Subscribe را انتخاب کنید:

[افزودن PersianBlocker به uBlock Origin](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlocker.txt&title=PersianBlocker)

اگر لینک بالا باز نشد:

1. داشبورد uBlock Origin را باز کنید.
2. به بخش `Filter lists` بروید.
3. بخش `Regions` را باز کنید.
4. گزینه `IRN: PersianBlocker` را فعال کنید.
5. روی `Update now` بزنید.

### AdGuard

در AdGuard به مسیر زیر بروید:

`Settings` -> `Filters` -> `Language-specific`

سپس فیلتر `Persian Blocker` را پیدا و فعال کنید.

### نصب دستی

اگر برنامه شما از نشانی خام فیلتر پشتیبانی می‌کند، این آدرس را وارد کنید:

```text
https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlocker.txt
```

## کدام فایل را انتخاب کنم؟

| فایل | کاربرد | لینک خام |
| --- | --- | --- |
| `PersianBlocker.txt` | فهرست اصلی برای uBlock Origin و AdGuard | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlocker.txt) |
| `PersianBlockerAds.txt` | فقط تبلیغات | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerAds.txt) |
| `PersianBlockerTrackers.txt` | فقط ردیاب‌ها | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerTrackers.txt) |
| `PersianBlockerAnnoyances.txt` | عناصر مزاحم و آزاردهنده | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerAnnoyances.txt) |
| `PersianBlockerMalware.txt` | دامنه‌ها و الگوهای مرتبط با بدافزار | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerMalware.txt) |
| `PersianBlockerPhishing.txt` | دامنه‌ها و الگوهای فیشینگ | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerPhishing.txt) |
| `PersianBlockerMobile.txt` | موارد مرتبط با وب و اپ‌های موبایل | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerMobile.txt) |
| `PersianBlockerHosts.txt` | نسخه مناسب برای hosts-based blockers | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerHosts.txt) |
| `PersianBlockerAds-Domains.txt` | دامنه‌های تبلیغاتی | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerAds-Domains.txt) |
| `PersianBlockerTrackers-Domains.txt` | دامنه‌های ردیابی | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerTrackers-Domains.txt) |
| `PersianBlockerCensor-Domains.txt` | دامنه‌های مرتبط با سانسور و اختلال | [raw](https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerCensor-Domains.txt) |

برای بیشتر کاربران، همان `PersianBlocker.txt` کافی است.

## توصیه‌های استفاده

- هم‌زمان چند افزونه مسدودساز تبلیغ را فعال نکنید؛ این کار می‌تواند باعث کندی، تداخل و خطای مسدودسازی شود.
- اگر مرورگر شما مسدودساز داخلی دارد، هنگام استفاده از uBlock Origin یا AdGuard تنظیمات آن را بررسی کنید.
- فهرست‌ها به‌صورت دوره‌ای به‌روزرسانی می‌شوند؛ در برنامه مسدودساز خود auto-update را روشن نگه دارید.
- برای بهترین سازگاری با uBlock Origin، استفاده از Firefox پیشنهاد می‌شود.

## گزارش مشکل

اگر تبلیغی نمایش داده می‌شود، سایتی خراب شده، یا دامنه‌ای اشتباه مسدود شده است، لطفا یک issue باز کنید:

[گزارش مشکل در GitHub Issues](https://github.com/MasterKia/PersianBlocker/issues)

برای گزارش دقیق‌تر، این موارد را بنویسید:

- نشانی صفحه‌ای که مشکل دارد
- نام مرورگر و افزونه مسدودساز
- فهرست‌هایی که فعال کرده‌اید
- توضیح کوتاه از رفتار مورد انتظار و رفتار فعلی
- در صورت امکان، تصویر یا نمونه فیلتر پیشنهادی

## مشارکت

مشارکت‌ها از راه pull request پذیرفته می‌شوند:

[ارسال Pull Request](https://github.com/MasterKia/PersianBlocker/pulls)

پیش از ارسال تغییر:

1. مطمئن شوید فیلتر تا حد ممکن محدود و دقیق است.
2. از مسدودسازی گسترده دامنه‌ها بدون دلیل روشن خودداری کنید.
3. اگر فیلتر برای یک سایت خاص است، نام سایت یا زمینه آن را در کنار فیلتر مشخص کنید.
4. در صورت امکان، فیلتر را با uBlock Origin یا AdGuard آزمایش کنید.

## توسعه محلی

این پروژه با `pnpm` و ابزارهای lint مخصوص فیلترهای AdGuard/uBlock نگهداری می‌شود.

```bash
pnpm install
pnpm lint
pnpm build
```

اسکریپت‌های اصلی:

| دستور | توضیح |
| --- | --- |
| `pnpm lint` | اجرای بررسی‌های فیلترها و Markdown |
| `pnpm lint:ab` | بررسی فیلترها با `aglint` |
| `pnpm lint:md` | بررسی فایل‌های Markdown |
| `pnpm build` | ساخت خروجی‌ها با اسکریپت پروژه |

## جامعه

- Telegram: [@PersianBlocker](https://telegram.dog/PersianBlocker)
- Matrix: [#PersianBlocker:matrix.org](https://matrix.to/#/#PersianBlocker:matrix.org)
- Discussions: [GitHub Discussions](https://github.com/MasterKia/PersianBlocker/discussions/49)

## مجوز

PersianBlocker تحت مجوز [GNU AGPLv3](https://github.com/MasterKia/PersianBlocker/blob/main/LICENSE) منتشر شده است.
