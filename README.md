Israeli Bank Account Validator
=

Israeli Bank Account Validator provides validation utilities for Israeli bank account numbers. You can use it to present appropriate UI to your user as they type.

It can be used both on the front side as a browserified module, and on the back side as a NodeJS module.

Installation
-

You can install il-bank-account-validator through npm.

```sh
npm install il-bank-account-validator
```

Example
-

In Node:

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

In the browser with `<script>` tags:

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
