בודק תקינות מספר חשבון בנק ישראלי
=

בודק התקינות למספרי חשבונות בנקים ישראליים מספק כלי וולידציה עבור מספרי חשבון השייכים לבנקים ישראליים.
ניתן להשתמש בו כדי לעדכן את ממשק המשתמש בהתאמה לערכים שהמשתמש מקליד.
מדובר בספריית JavaScript.

ניתן להשתמש בו גם בצד הלקוח (כמודול שעבר browserification, או להשתמש ב [JS Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)), וגם בצד השרת כמודול NodeJS.

התקנה
-

ניתן להתקין את il-bank-account-validator באמצעות npm.

```sh
npm install il-bank-account-validator
```

דוגמה
-

NodeJS:

```js
var validator = require('il-bank-account-validator');

// TODO: Set to your real info
var bank = 0;
var branch = 0;
var account = 0;

console.log("My details are:", bank, branch, account);
console.log("Am I valid?");
if(validator(bank, branch, account)) {
    console.log("Yes!");
} else {
    console.log("No!");
}
```

בדפדפן עם JS-Modules  ותגיות `<script>`:

```html
<script type="module">
  import bankAccountValidation from 'il-bank-account-validator';

  if (bankAccountValidation(bankNumber, branchNumber, accountNumber)) {
    renderFullyValidAccountNumber();
  } else if (!accountValidation.isPotentiallyValid) {
    renderInvalidAccountNumber();
  }
</script>
```

אם עליך לתמוך בדפדפנים שלא תומכים ב JS-Modules (כגון Internet Explorer, Safari iOS <10.3), אפשר להשתמש ב bundler כמו [Webpack](https://webpack.js.org/).
