בודק תקינות מספר חשבון בנק ישראלי
=

בודק התקינות למספרי חשבונות בנקים ישראליים מספק כלי וולידציה עבור מספרי חשבון השייכים לבנקים ישראליים.
ניתן להשתמש בו כדי לעדכן את ממשק המשתמש בהתאמה לערכים שהמשתמש מקליד.
מדובר בספריית JavaScript.

ניתן להשתמש בו גם בצד הלקוח כמודול שעבר browserification, וגם בצד השרת כמודול NodeJS.

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

בדפדפן עם תגיות `<script>`:

```html
<script src="path/to/il-bank-account-validator.js"></script>
<script>
  if (bankAccountValidation(bankNumber, branchNumber, accountNumber)) {
    renderFullyValidAccountNumber();
  } else if (!accountValidation.isPotentiallyValid) {
    renderInvalidAccountNumber();
  }
</script>
```

הקובץ הנדרש נמצא בתקיית 'build'. יש גם גרסא שעברה מיניפיקציה.
