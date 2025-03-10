# PersianBlocker


<div dir="rtl">

این لیست با هدف برگرداندن آزادی به کاربران ساخته شده؛ آزادیِ این‌که **_چه چیزی وارد مرورگرشان می‌شود و چه چیزی وارد نمی‌شود_**، و حمایت‌های شما انگیزه‌ای برای ادامه این مسیر خواهد بود.

</div>

XMR:

`4Ay6m5uCVMHgEHDYvv5LE89Xd34w8SGTWKHMJcXSDLsKB3ocQVkRQv5WRJN8w7Pef9WJFzWVrMy4PhaaWN46wM1WGnreyGd`

![Monero request](https://github.com/user-attachments/assets/daff3e3f-3bf9-4fb9-afca-186c88e16e8c)


<div dir="rtl">
  
سرانجام، یک لیست بهینه و گسترده برای مسدودسازی تبلیغ ها و ردیاب ها (Trackers) در سایت های پارسی زبان!

🔔 **گروه تلگرام**: [@PersianBlocker](https://t.me/PersianBlocker)

این لیست جزو لیست های پیش‌فرض افزونه **uBlock Origin** و **AdGuard** می‌باشد.

## برای حذف تبلیغات سافت98 کافیه آخرین پیام رو اینجا بخونید؛https://github.com/MasterKia/PersianBlocker/issues/40

***

لیست **PersianBlocker** از سایت ‌های تاجیکستانی به زبان پارسی (با الفبای سیرلیکی) و از سایت ‌های افغانستانی (به زبان پارسی دری و پشتو) پشتیبانی می‌کند.

> листи **PersianBlocker** аз сайтҳои тоҷикистонӣ ба забони порсӣ (бо алифбои тоҷикӣ) пуштибонӣ мекунад.

> د PersianBlocker لیست د افغان سایټونو ملاتړ کوي (په دري او پښتو کې).

***

### لیست PersianAnnoyances

برای پنهان کردن موارد آزاردهنده و رو مخی  در سایت های پارسی‌زبان

نشانی‌ لیست:

https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianAnnoyance.txt

***
### دکمه دانلود برنامه از کافه بازار (بدون نصب)


<details>
  <summary>اینجا کلیک کنید و فیلتری که نشون داده میشه رو در بخش My filters افزونه uBlock Origin استفاده کنید:</summary>
  
  ```adb
cafebazaar.ir##+js(rpnt, script, /window.__NUXT__=/, const main=function(button){const url=button.href;const pkg=new URL(url).searchParams.get('id');fetch("https://api.cafebazaar.ir/rest-v1/process/AppDownloadInfoRequest"\,{mode:"cors"\,method:"post"\,headers:{Accept:"application/json"\,"Content-type":"application/json"\,}\,body:JSON.stringify({properties:{language:2\,clientVersionCode:1100301\,androidClientInfo:{sdkVersion:22\,cpu:"x86\,armeabi-v7a\,armeabi"\,}\,clientVersion:"11.3.1"\,isKidsEnabled:false\,}\,singleRequest:{appDownloadInfoRequest:{downloadStatus:1\,packageName:pkg\,referrers:[]\,}\,}\,})\,}).then(response=>{if(response.ok&&response.status===200){return response.json()}}).then(data=>{if(!data.singleReply||!data.singleReply.appDownloadInfoReply){return};const token=data.singleReply.appDownloadInfoReply.token;const cdnPrefix=data.singleReply.appDownloadInfoReply.cdnPrefix[0];const packageSize=(data.singleReply.appDownloadInfoReply.packageSize/1024)/1024;const versionCode=data.singleReply.appDownloadInfoReply.versionCode||0;const downloadLink=`${cdnPrefix}apks/${token}.apk`;const newButton=document.createElement('a');newButton.className='AppInstallBtn newbtn';newButton.href=downloadLink;newButton.title=`نسخه:${versionCode}`;newButton.setAttribute('data-color'\,'primary');newButton.setAttribute('data-size'\,'lg');newButton.innerHTML=`⬇️دانلود(${packageSize.toFixed(2)}مگابایت)`;button.parentNode.insertBefore(newButton\,button.parentNode.childNodes[0]);button.parentNode.removeChild(button)}).catch(error=>{})};document.addEventListener('DOMContentLoaded'\,()=>{const isMobile=/Mobile|Android/i.test(navigator.userAgent);let buttonSelector='';if(isMobile){buttonSelector='div.DetailsPageHeader__mobile a.AppInstallBtn'}else{buttonSelector='div.DetailsPageHeader__desktop a.AppInstallBtn'};const button=document.querySelector(buttonSelector);if(button){main(button)};const targetNode=document.querySelector('body');const observer=new MutationObserver(function(mutationsList){const buttons=document.querySelector(buttonSelector);if(button&&button.href.includes('://details?id')){main(button)}});observer.observe(targetNode\,{childList:true\,subtree:true})});window.__NUXT__=)  
  ```

منبع:

https://chrome.google.com/webstore/detail/cafebazaar-apk-downloader/imnogedkmanognaahdphhfhgehlfgdoh
  
</details>


***

برای دیدن هر مورد، روی آن کلیک کنید 👇🏻 

<details>
  <summary dir="rtl"><h4>🖥 راه‌اندازی در کامپیوتر 🖥</h4></summary>
  
۱- افزونه مسدودساز **uBlock Origin** رو با کلیک روی یکی از لینک های زیر نصب کنید:
  
🌟 مرورگر پیشنهادی = فایرفاکس، [چون این افزونه در فایرفاکس بهتر کار می‌کنه](https://github.com/gorhill/uBlock/wiki/uBlock-Origin-works-best-on-Firefox).
  
- [برای فایرفاکس](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/): روی دکمه آبی رنگ _Add to Firefox_ بزنید.
- [برای گوگل کروم (کرومیوم)، ماکروسافت اِج، بریو، اپرا و ویوالدی](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm): روی دکمه آبی رنگ _Add to Chrome_ بزنید.
  
⚠️ به علت محدود بودن سازوکار افزونه‌ها در مرورگر سافاری، امکان نصب این افزونه وجود ندارد. اما می‌تونید از فایرفاکس استفاده کنید.

✅ اگه زبان مرورگر شما «پارسی (Persian)» باشه، افزونه به صورت خودکار لیست رو براتون فعّال می‌کنه و _نیازی به انجام مرحله‌های بعدی نخواهید داشت_.
  
۲- برای فعّال‌سازی لیست، [اینجا کلیک کنید](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlocker.txt&title=PersianBlocker) و در صفحه جدیدی که باز میشه بالا سمت راست گزینه «Subscribe (مشترک شدن)» رو بزنید تا لیست فعّال بشه.
  
- اگه روی لینک زدید و کار نکرد: در نوار بالا سمت راست مرورگر، روی آیکن قرمز رنگ **uBlock Origin** بزنید، روی دکمه چرخ‌دنده کلیک کنید و در صفحه باز شده به زبانه دوم «Filter lists (لیست فیلتر ها)» برید و بخش «Regions (مناطق)» رو باز کنید؛ اونجا تیکِ کنار لیست **IRN: PersianBlocker** رو بزنید و سپس بالای صفحه روی گزینه «Update now (بروزرسانی)» کلیک کنید تا لیست فعّال و بروز بشه.
  
✳️ این لیست با افزونه مسدودساز **AdGuard** هم سازگار است و برای فعّال‌سازی: در نوار بالا سمت راست مرورگر،‌ روی آیکن سبز رنگ **AdGuard** کلیک کنید و در بالا روی دکمه چرخ دنده بزنید، به بخش «Filters (فیلتر ها)» برید و روی گزینه «Language-Specific (مخصوص زبان)» بزنید، ازونجا لیست **Persian Blocker** رو پیدا کنید و تیک سمت راستش رو روشن کنید تا لیست فعّال بشه.

و پایان!
 
⚠️ اگر افزونه مسدودساز دیگه ای (مانند Adblock Plus) روی مرورگرتون دارید، حتماً غیرفعال یا حذفش کنید. چون داشتنِ چند افزونه مسدودساز به طور همزمان، باعث _تداخل_، _کاهش سرعت_ و _مسدودسازی اشتباه_ در سایت ها میشه. برخی مرورگر ها (مانند بریو و ویوالدی) _مسدودساز داخلی_ دارن، اونا رو هم حتماً خاموش کنید.

  
</details>

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در مرورگر فایرفاکس اندروید 📱</h4></summary>

۱- مرورگر فایرفاکس رو [از F-Droid](https://f-droid.org/en/packages/org.mozilla.fennec_fdroid) یا [از Google Play Store](https://play.google.com/store/apps/details?id=org.mozilla.firefox) نصب کنید.
  
۲- توی فایرفاکس؛ سمت راست پایین یا بالای صفحه، روی _سه نقطه_ بزنید و گزینه «Add-ons (افزونه ها)» رو انتخاب کنید و بعد روی «Add-ons manager (مدیریت افزونه ها)» بزنید.

۳- در صفحه جدید افزونه uBlock Origin رو پیدا کنید؛ روی علامت بعلاوه (+) سمت راستش کلیک کنید و گزینه «Add (افزودن)» رو بزنید تا افزونه نصب و فعّال بشه.

✅ اگه زبان مرورگر شما «پارسی (Persian)» باشه، افزونه به صورت خودکار لیست رو براتون فعّال می‌کنه و _نیازی به انجام مرحله‌های بعدی نخواهید داشت_.

۴- برای فعّال‌سازی لیست، [اینجا کلیک کنید](https://subscribe.adblockplus.org/?location=https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlocker.txt&title=PersianBlocker) و در صفحه جدیدی که باز میشه بالا سمت راست گزینه «Subscribe (مشترک شدن)» رو بزنید تا لیست فعّال بشه.

- اگه روی لینک زدید و کار نکرد: * توی فایرفاکس سمت راست پایین یا بالای صفحه روی _سه نقطه_ بزنید؛ گزینه «Add-ons (افزونه ها)» رو انتخاب کنید و سپس روی **uBlock Origin** کلیک کنید. در صفحه جدید گزینه «Settings (تنظیمات)» رو بزنید؛ روی دکمه چرخ دنده «Open the dashboard (باز کردن داشبورد)» کلیک کنید و در صفحه باز شده به زبانه دوم یعنی «Filter lists (لیست فیلتر ها)» برید. بخش «Regions (مناطق)» رو باز کنید و ازونجا تیکِ کنار لیست **IRN: PersianBlocker** رو بزنید و سپس بالای صفحه روی گزینه «Update now (بروزرسانی)» کلیک کنید تا لیست فعّال و بروز بشه.
  
و پایان!
  
✳️ این لیست با افزونه مسدودساز **AdGuard** هم سازگار است و برای فعّال‌سازی: وارد تنظیمات AdGuard بشید، به بخش «Filters (فیلتر ها)» برید و روی گزینه «Language-Specific (مخصوص زبان)» بزنید، ازونجا لیست **Persian Blocker** رو پیدا کنید و تیک سمت راستش رو روشن کنید تا لیست فعّال بشه.

  
</details>

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در مرورگر بریو اندروید 📱</h4></summary>
  
برای فعّالسازی لیست در مسدودساز داخلی مرورگر بریو،‌ به این مسیر برید (توی قسمت آدرس سایت ها واردش کنید):
  
`brave://adblock`
 
و [طبق این تصویر](https://user-images.githubusercontent.com/17685483/184549564-409bb6f9-2c00-45e6-b22f-a34c365ccfdc.png)، لیست **IRN: PersianBlocker** رو فعّال کنید.
  
</details>

<details>
    <summary dir="rtl"><h4>📱 راه‌اندازی در مرورگر ویوالدی اندروید 📱</h4></summary>
  
⚠️ مسدودساز داخلی مرورگر ویوالدی از فیلتر های جاوااسکریپتی و برخی موارد دیگه پشتیبانی نمی‌کنه. با این حال شما می‌تونید به صورت دستی، لیست رو اضافه کنید:
 
https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlocker.txt
  
لیست **PersianBlocker** بزودی به لیست های پیش‌فرض این مرورگر افزوده خواهد شد. 
  
</details>

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در مرورگر Cromite (Bromite سابق) اندروید 📱</h4></summary>
  
⚠️ مسدودساز داخلی مرورگر Cromite، از فیلتر های CSS (برای پنهان کردن تبلیغات) و از فیلتر های جاوااسکریپتی و برخی موارد دیگه پشتیبانی نمی‌کنه. با این حال شما می‌تونید [به کمک این آموزش](https://github.com/xarantolus/filtrite#using-your-own-filter-lists)، یک لیست سازگار با Cromite بسازید.
  
لیستی برپایه **PersianBlocker** که کاربر [Chromer030](https://github.com/Chromer030) برای Cromite درست کرده:

https://github.com/chromer030/filtrite/releases/latest/download/persian.dat
  
</details>

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در مرورگر کیوی اندروید 📱</h4></summary>

⚠️ مرورگر کیوی برای اندروید از افزونه‌ها پشتیبانی میکنه اما با افزونه های مسدودساز [به خوبی سازگار نیست و مشکلاتی داره](https://github.com/uBlockOrigin/uAssets/issues/11438#issuecomment-1019771072).

با این حال شما می‌تونید افزونه رو روی این مرورگر نصب کنید و سپس بخش «راه‌اندازی در فایرفاکس اندروید» از مرحله ۴ رو دنبال کنید.
 
</details>

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در مرورگر گوگل کروم (کرومیوم) و ماکروسافت اِج و اپرا اندروید 📱</h4></summary>

⚠️ به علت پشتیبانی نکردن کرومیوم اندروید از افزونه‌ها، امکان نصب افزونه مسدودساز در این مرورگر ها وجود ندارد و مرورگر فایرفاکس پیشنهاد می‌شود. اگر واقعاً به کرومیوم نیاز دارید، مرورگر کیوی اندروید از افزونه‌ها پشتیبانی می‌کند.  
  
</details>  

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در نرم‌افزار Rethink (Firewall+DNS) اندروید 📱</h4></summary>
 
به کمک این نرم‌افزار شما می‌تونید دسترسی اینترنت همه برنامه‌های گوشی (یا فقط برنامه هایی که می‌خوایید) رو قطع کنید و فقط به برنامه‌هایی که نیاز دارید دسترسی اینترنت بدید. علاوه بر این، می‌تونید تا حدی جلوی تبلیغات و ردیاب ها رو به کمک مسدودسازی DNS بگیرید.
  
۱- این نرم‌افزار رو [از F-Droid](https://f-droid.org/en/packages/com.celzero.bravedns) یا [از Google Play Store](https://play.google.com/store/apps/details?id=com.celzero.bravedns) نصب کنید.

۲- توی نرم‌افزار، بالا سمت چپ روی بخش DNS بزنید و گزینه RethinkDNS رو انتخاب کنید. توی صفحه بعد روی علامت مداد جلوی گزینه RDNS Plus کلیک کنید و بعد دکمه Edit رو بزنید. توی صفحه جدید زبونه Advanced رو باز کنید و این عبارت رو جستجو کنید: «Persian Blocker» و بعد تیک سمت راستش رو بزنید و پایین صفحه گزینه Apply رو انتخاب کنید تا لیست براتون فعّال بشه.
  
یا اینکه می‌تونید لیست جامع «OISD» که **PersianBlocker** هم شاملش میشه رو فعّال کنید تا تبلیغات و ردیاب‌ها در سایت های انگلیسی‌زبان هم مسدود بشه. 

</details>

<details>
  <summary dir="rtl"><h4>📱 راه‌اندازی در نرم‌افزار ادگارد اندروید 📱</h4></summary>

این نرم‌افزار همانند Rethink می‌باشد با این تفاوت که ناآزاد و انحصاری (Proprietary) است یعنی هیچ‌کس حق بررسی کد های برنامه (Source Code) و پیدا کردن مشکلات امنیتی را ندارد. بنابراین پیشنهاد می‌کنیم از برنامه‌ای ناآزاد که قرار است همه ترافیک اینترنت شما را زیرنظر داشته باشد دوری کنید و در عوض از نرم‌افزار Rethink که نرم‌افزاری آزاد است و همگان می‌توانند کد های برنامه را ببینند و آن را آزادانه با دیگران به اشتراک بگذارند استفاده کنید.
  
برای فعّال‌سازی لیست در ادگارد اندروید، نسخه جدید این نرم‌افزار (از ۳.۶.۵۱ به بعد) رو بریزید و به مسیر زیر برید و [طبق این تصویر](https://user-images.githubusercontent.com/17685483/192210391-ebd1619d-3cc2-4743-9494-7f8846f9361a.png)، لیست **Persian Blocker** رو فعّال کنید:
  
_Settings => Content Blocking => Filters => Language-Specific_  
  
</details>  

<details>
  <summary dir="rtl"><h4>🕳 راه‌اندازی در نرم‌افزار های Qv2ray و SagerNet و Shadowrocket و Clash 🕳</h4></summary>

از لیست Iran Hosted Domains که شامل لیست **PersianBlockerHosts** می‌شود و توسط جمعی از کاربران درست شده استفاده کنید:
  
https://github.com/MasterKia/iran-hosted-domains/blob/main/README.fa.md
  
https://github.com/MasterKia/iran-hosted-domains/releases/latest
  
</details>  

<details>
  <summary dir="rtl"><h4>🕳 راه‌اندازی در مسدودساز DNS (مانند AdGuard Home) 🕳</h4></summary>


از لیست **PersianBlockerHosts** (برگرفته از لیست PersianBlocker) استفاده کنید:

https://raw.githubusercontent.com/MasterKia/PersianBlocker/main/PersianBlockerHosts.txt  
  
</details>

<details>
  <summary dir="rtl"><h4>🕳 راه‌اندازی در مسدودساز HOSTS (مانند AdAway یا HostsMan) 🕳</h4></summary>

نسخه `127.0.0.1` (پیشنهادی):

https://raw.githubusercontent.com/MasterKia/PersianBlocker/refs/heads/main/hosts

نسخه `0.0.0.0` :

https://raw.githubusercontent.com/MasterKia/PersianBlocker/refs/heads/main/hosts-0


</details>

<details>
  <summary dir="rtl"><h4>🕳 مسدودسازی تبلیغات و ردیاب‌ها به کمک DNS 🕳</h4></summary>

مرورگر های گوگل کروم و فایرفاکس کامپیوتر و گوگل کروم اندروید از قابلیت DNS over HTTPS (DoH یا همان Secure DNS) پشتیبانی می‌کنند و اندروید هم از قابلیت DNS over TLS (DoT) پشتیبانی می‌کند که البته در ایران مسدود می‌باشد. به کمک این قابلیت شما می‌توانید کاری کنید که مرورگر و نرم‌افزار های دیگر گمان کنند که سایت های تبلیغات و ردیاب اصلاً وجود خارجی ندارند.
  
⚠️ به هیچ وجه از این قابلیت _در کنار_ افزونه‌های مسدودساز مانند uBlock Origin استفاده نکنید چون باعث تداخل و مسدودسازی اشتباه می‌شود.  
  
- آدرس DoH:

`https://sky.rethinkdns.com/1:EAACAA==`
  
- آدرس DoH (به همراه لیست جامع OISD Full که شامل **PersianBlockerHosts** هم می‌شود):  
  
`https://basic.rethinkdns.com/1:IAAgAA==`

- آدرس DoT:

`1-caaaeaa.max.rethinkdns.com`
  
- آدرس DoT (به همراه لیست جامع OISD Full که شامل **PersianBlockerHosts** هم می‌شود):  
  
`1-eaacaaa.max.rethinkdns.com`
  
- [آدرس DNS رمزگذاری نشده](https://kb.controld.com/en/3rd-party-filters) برای تنظیم روی مودم و روتر (به همراه لیست جامع OISD Full که شامل **PersianBlockerHosts** هم می‌شود):
  
`76.76.2.32`
  
`76.76.10.32`
  
برای افزودن لیست های دیگر و ساخت DNS دلخواه خودتان می‌توانید به سایت زیر بروید:
  
https://basic.rethinkdns.com
  
  
</details>

<details>
  <summary dir="rtl"><h4>⛓ راه‌اندازی در آیفون ⛓</h4></summary>
اپلیکیشن [Adguard adblock](https://apps.apple.com/us/app/adguard-adblock-privacy/id1047223162) را نصب کنید و از تب دوم (Protection) روی گزینه Safari protection بزنید. سپس گزینه Filters وبعد Language‪-‬specific بزنید و گزینه Persian Blocker را پیدا و فعال کنید. 
‫(‬درصورت خرید اپ امکان ست کردن Custom Filters هم وجود خواهد داشت ولی اگر فقط از این ریپو استفاده میکنید به آن نیاز پیدا نخواهید کرد.)
برای فعال‌سازی افزونه داخل مرورگر Safari مطابق آموزش خود ادگارد به اینجا بروید: 
Settings/Safari/Extensions
و همه گزینه‌های AdGuard را فعال کنید.

</details>

# 🤝 مشارکت
1- از [اینجا](https://github.com/signup) توی گیت‌هاب ثبت نام کنید.

2- از بخش [«Issues (مشکلات)»](https://github.com/MasterKia/PersianBlocker/issues/new) میتونید هرگونه مشکل با سایتی و یا پیشنهادی که دارید رو درمیون بذارید.

\* برای گزارش مشکل، فقط کافیه «نشانی سایت + عکس از سایت + توضیح درباره مشکل» رو بفرستید.
  
\* امکان فرستادن گزارش در گروه تلگرامی [@PersianBlocker](https://t.me/PersianBlocker) هم وجود دارد.

\* گفتگوی [«گزارش و درخواست بررسی ردیاب‌ها»](https://github.com/MasterKia/PersianBlocker/discussions/70)  
  

#  [![AGPL-3.0 License](https://img.shields.io/github/license/MasterKia/PersianBlocker)](https://www.gnu.org/licenses/agpl-3.0.en.html) لایسنس (پروانه)

لیست **PersianBlocker** یک لیست آزاد تحت پروانه AGPL نسخه 3 میباشد (AGPLv3)؛ یعنی شما به عنوان کاربر این _آزادی ها_ رو دارید:

1- آزادی استفاده از لیست به هر منظور و دلیل (برای انجام هر کاری)

2- آزادی مطالعه و تغییر لیست (برای انجام کار مدنظر شما)

3- آزادی به اشتراک گذاشتن لیست با دیگران

4- آزادی به اشتراک گذاشتن نسخه های تغییریافته لیست با دیگران

* [متن کامل پروانه AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html) ([ترجمه پارسی](https://lists.gnu.org/archive/html/www-fa-general/2013-02/msg00001.html)).

  
 # ❤️ گرامیداشت
 
 </div>
 
**PersianBlocker** (_AGPL-3.0 License_) 🤝 [Adblock-Iran](https://github.com/farrokhi/adblock-iran) (_BSD 2-Clause License_) + [uBOPa](https://github.com/nimasaj/uBOPa/) (_MIT License_) + [Adblock Farsi](https://github.com/SlashArash/adblockfa) (_Beerware License_) + [uBlock-Iran](https://github.com/mboveiri/ublock-iran) (_CC0-1.0 License_) + [Adblock Persian](https://ideone.com/K452p) + [Unwanted-Iranian](https://github.com/DRSDavidSoft/additional-hosts/blob/master/domains/blacklist/unwanted-iranian.txt) (_MIT License_) + [لیست هشدار وب‌آموز](https://webamoozcom.github.io/warning-list/) (_MIT License_)

<div dir="rtl">
  
پروژه هایی که از این لیست استفاده میکنند:

  
\- [افزونه uBlock Origin](https://github.com/gorhill/uBlock/blob/33b839fdd03f74689df3ee2b5c25a06435b350e0/assets/assets.json#L478-L491)

\- [افزونه AdGuard](https://github.com/AdguardTeam/FiltersRegistry/tree/101680b0dfd9059ad3fc3fcb71f5755c9ff1f87a/filters/ThirdParty/filter_235_PersianBlocker)

\- [مسدودساز داخلی مرورگر بریو](https://github.com/brave/adblock-resources/blob/61cf21b19a53b3a2c3f7ad286c433501b97c6ed7/filter_lists/regional.json#L189-L199)

\- ~~مسدودساز داخلی مرورگر ویوالدی~~ پیگیری شد اما به نتیجه‌ای نرسید

\- [مسدودساز داخلی مرورگر برومایت](https://github.com/chromer030/filtrite/releases/latest/download/persian.dat)

\- [نرم‌افزار Rethink اندروید (Firewall+DNS)](https://github.com/serverless-dns/blocklists/blob/b8492d00fabf8748dfc32710d632d4f983bdfd21/blocklistConfig.json#L1555-L1564)

\- [RethinkDNS](https://github.com/serverless-dns/blocklists/blob/b8492d00fabf8748dfc32710d632d4f983bdfd21/blocklistConfig.json#L1555-L1564)

\- [نرم‌افزار AdGuard Home (مسدودساز DNS)](https://github.com/AdguardTeam/HostlistsRegistry/tree/fbc630cce1b7fa551c9daaf0afc869998c8384d0/filters/regional/filter_19_IRN_PersianBlocker)

\- [AdGuard DNS](https://github.com/AdguardTeam/AdGuardSDNSFilter/blob/e699a76495ab12b72e93095e9f8df668da06e51a/configuration.json#L253-L259)

\- [لیست جامع OISD (در نسخه Full)](https://oisd.nl/includedlists/full)

\- ~~لیست جامع Energized Protection (در نسخه Regional) ([در دست پیگیری](https://github.com/EnergizedProtection/block/pull/926))~~

\- [لیست Iran Hosted Domains](https://github.com/MasterKia/iran-hosted-domains/blob/main/README.fa.md)

\- [سایت مرجع همه لیست ها (Filterlists.com)](https://filterlists.com/lists/persianblocker-official-regional-persianiranian-domains-and-cosmetic-blocklist)

\- [ابزار V2RayGen](https://github.com/SonyaCore/V2RayGen/tree/6dd75a68b25184009551a49182c211d451ee1549#block-list-sources)

\- [ابزار 3x-ui](https://github.com/MHSanaei/3x-ui/commit/b805bf62229ef4a1211b6bc1e7603c07b12b9653)

\- [ابزار x-ui](https://github.com/alireza0/x-ui/pull/478/commits/78171dd6a420a084a7d5ce805b25f2ae08db0044)

\- ابزار های [Iran-v2ray-rules](https://github.com/Chocolate4U/Iran-v2ray-rules) و [Iran-sing-box-rules](https://github.com/Chocolate4U/Iran-sing-box-rules) و [Iran-clash-rules](https://github.com/Chocolate4U/Iran-clash-rules) 

\- [ابزار V2RayAggregator](https://github.com/mahdibland/V2RayAggregator/commit/75e1ae0c58614525dc3fb97e476c4942797030ca)

  
</div>  

  
<p align="center">
  
<img src="https://user-images.githubusercontent.com/55192376/192527565-5ce4f488-622d-4c13-9b74-1025e615d5c1.svg" height="270" width="270">
  
  
</p>  

***

🄯 All Wrongs Reversed.

![](http://profile-counter.glitch.me/MasterKia/count.svg)

