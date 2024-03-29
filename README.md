Israeli Bank Account Validator
=

Israeli Bank Account Validator provides validation utilities for Israeli bank account numbers. You can use it to present appropriate UI to your user as they type.
This is a JavaScript module.

It can be used both on the front end (if browserified or imported as [JS Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)), and on the back end as a NodeJS module.

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

In the browser JS-Modules and `<script>` tags:

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

If you need to support browsers that don't support JS-Modules (like Internet Explorer, Safari iOS <10.3), you can instead use a bundler like [Webpack](https://webpack.js.org/).
