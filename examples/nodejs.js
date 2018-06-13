"use strict";

var console = require('console');
var validator = require('../index');

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
