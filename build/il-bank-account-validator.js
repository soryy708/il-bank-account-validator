(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bankAccountValidation = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* Unsupported and legacy banks:
 * ?? - Pepper Pay
 * 1 - Euro Trade
 * 2 - Poalei Agudat Israel
 * 6 - Adanim (merged with Mizrahi Tefahot)
 * 7 - Bank Lepituah Ataasiya
 * 8 - Poalim / Asfanot
 * 19 - Bank Ahaklaut Leisrael
 * 23 - HSBC
 * 24 - Poalim
 * 25 - BNP Paribas
 * 26 - Yobank (merged with 31)
 * 27 - Barclays Bank PLC​
 * 28 - Poalim
 * 30 - Bank Lemishar
 * 33 - Discount
 * 37 - Of Jordan
 * 38 - Commercial Bank of Palestine
 * 39 - SBI State Bank of India
 * 43 - Jordan National Bank PLC Aman
 * 48 - Otsar Ahayal / Aoved Aleumi
 * 49 - Arav Bank
 * 50 - Bank Clearing Center
 * 59 - Automatic Bank Services
 * 65 - Hasah Kupot Hisahon Lehinuh
 * 66 - Kahir Aman
 * 67 - Arab Land
 * 68 - Bank Dexia 
 * 71 - Commercial Jordan
 * 73 - Arav Islamic
 * 74 - British Bank of Middle East
 * 76 - Palestine Investments
 * 77 - Leumi Mashkantaot
 * 82 - אל-קודס לפיתוח והשקעות
 * 83 - Union Bank
 * 84 - האוזינג
 * 89 - Palestine
 * 90 - Discount Mashkantaot
 * 93 - ג'ורדן כווית
 * 99 - Bank Israel
 */
"use strict";

module.exports = function(bankNumber, branchNumber, accountNumber) {
    // Input validation:
    if(bankNumber.constructor === String) {
        bankNumber = Number(bankNumber);
    }
    if(branchNumber.constructor === String) {
        branchNumber = Number(branchNumber);
    }
    if(accountNumber.constructor === String) {
        accountNumber = Number(accountNumber);
    }
    if(bankNumber.constructor !== Number || isNaN(bankNumber) || bankNumber < 0 || bankNumber != Math.floor(bankNumber)) {
        return false;
    }
    if(branchNumber.constructor !== Number || isNaN(branchNumber) || branchNumber < 0 || branchNumber != Math.floor(branchNumber)) {
        return false;
    }
    if(accountNumber.constructor !== Number || isNaN(accountNumber) || accountNumber < 0 || accountNumber != Math.floor(accountNumber)) {
        return false;
    }

    /* Specs say nothing about length. Why is this here?
    // Account number length validation
    var requiredLength = 0;
    switch(bankNumber) {
        case(4):
        case(12):
        case(20):
            requiredLength = 6;
            break;
        case(10):
        case(13):
        case(34):
            requiredLength = 8;
            break;
        case(9):
        case(11):
        case(14):
        case(17):
        case(22):
        case(31):
        case(46):
        case(52):
        case(54):
            requiredLength = 9;
            break;
        default:
            return false;
    }
    if(accountNumber.toString().length != requiredLength) {
        return false;
    }
    */

    if(bankNumber === 20) { // Mizrahi Tefahot special case
        if(branchNumber > 400) {
            branchNumber -= 400;
        }
    }

    var i;

    // Extract digits out of accountNumber
    var accountNumberDigits = new Array();
    for(i = 0; i < 9; i++) { // Length is always 9, the rest are padded
        accountNumberDigits.push(accountNumber % 10);
        accountNumber = Math.floor(accountNumber / 10);
    }

    // Extract digits out of branchNumber
    var branchNumberCpy = branchNumber;
    var branchNumberDigits = new Array();
    for(i = 0; i < 3; i++) {
        branchNumberDigits.push(branchNumberCpy % 10);
        branchNumberCpy = Math.floor(branchNumberCpy / 10);
    }

    // Account number validation
    var sum = 0;
    switch(bankNumber) {
        case(10): // Luemi
        case(13): // Igud
        case(34): // Aravei Israeli merged with 10
            sum += accountNumberDigits[0];
            sum += accountNumberDigits[1] * 10;
            sum += accountNumberDigits[2] * 2;
            sum += accountNumberDigits[3] * 3;
            sum += accountNumberDigits[4] * 4;
            sum += accountNumberDigits[5] * 5;
            sum += accountNumberDigits[6] * 6;
            sum += accountNumberDigits[7] * 7;
            sum += branchNumberDigits[0] * 8;
            sum += branchNumberDigits[1] * 9;
            sum += branchNumberDigits[2] * 10;
            sum %= 100;
            return sum === 90 || sum === 72 || sum === 70 || sum === 60 || sum === 20;

        case(20): // Mizrahi Tefahot
        case(4): // Yahav (ovdey medina)
        case(12): // Hapoalim
            sum += accountNumberDigits[0] * 1;
            sum += accountNumberDigits[1] * 2;
            sum += accountNumberDigits[2] * 3;
            sum += accountNumberDigits[3] * 4;
            sum += accountNumberDigits[4] * 5;
            sum += accountNumberDigits[5] * 6;
            sum += branchNumberDigits[0] * 7;
            sum += branchNumberDigits[1] * 8;
            sum += branchNumberDigits[2] * 9;
            sum %= 11;
            if(bankNumber === 4) { // Yahav (ovdey medina)
                return sum === 0 || sum === 2;
            }
            if(bankNumber === 12) { // Hapoalim
                return sum === 0 || sum === 2 || sum === 4 || sum === 6;
            }
            if(bankNumber === 20) { // Mizrahi Tefahot
                return sum === 0 || sum === 2 || sum === 4;
            }
            return false;

        case(11): // Discount
        case(17): // Mercantile Discount
        case(31): // Beinleumi
        case(52): // Poalei Agudat Israel, merged with 31
            sum += accountNumberDigits[0] * 1;
            sum += accountNumberDigits[1] * 2;
            sum += accountNumberDigits[2] * 3;
            sum += accountNumberDigits[3] * 4;
            sum += accountNumberDigits[4] * 5;
            sum += accountNumberDigits[5] * 6;
            sum += accountNumberDigits[6] * 7;
            sum += accountNumberDigits[7] * 8;
            sum += accountNumberDigits[8] * 9;
            sum %= 11;

            if(bankNumber === 11 || bankNumber === 17) { // Discount or Mercantile
                return sum === 0 || sum === 2 || sum === 4;
            }
            if(bankNumber === 31 || bankNumber === 52) { // Beinleumi
                if(sum === 0 || sum === 6) {
                    return true;
                } else {
                    sum = 0;
                    sum += accountNumberDigits[0] * 1;
                    sum += accountNumberDigits[1] * 2;
                    sum += accountNumberDigits[2] * 3;
                    sum += accountNumberDigits[3] * 4;
                    sum += accountNumberDigits[4] * 5;
                    sum += accountNumberDigits[5] * 6;
                    sum %= 11;
                    return sum === 0 || sum === 6;
                }
            }
            return false;

        case(9): // Post Bank
            sum += accountNumberDigits[0] * 1;
            sum += accountNumberDigits[1] * 2;
            sum += accountNumberDigits[2] * 3;
            sum += accountNumberDigits[3] * 4;
            sum += accountNumberDigits[4] * 5;
            sum += accountNumberDigits[5] * 6;
            sum += accountNumberDigits[6] * 7;
            sum += accountNumberDigits[7] * 8;
            sum += accountNumberDigits[8] * 9;
            sum %= 10;
            return sum === 0;

        case(54): // Jerusalem
            return true; // wtf?

        case(22): // Citibank NA
            sum += accountNumberDigits[0] * 2;
            sum += accountNumberDigits[1] * 3;
            sum += accountNumberDigits[2] * 4;
            sum += accountNumberDigits[3] * 5;
            sum += accountNumberDigits[4] * 6;
            sum += accountNumberDigits[5] * 7;
            sum += accountNumberDigits[6] * 2;
            sum += accountNumberDigits[7] * 3;
            return (11 - sum % 11) === accountNumberDigits[8];

        case(14): // Otsar Ahayal
        case(46): // Masad
            sum += accountNumberDigits[0] * 1;
            sum += accountNumberDigits[1] * 2;
            sum += accountNumberDigits[2] * 3;
            sum += accountNumberDigits[3] * 4;
            sum += accountNumberDigits[4] * 5;
            sum += accountNumberDigits[5] * 6;
            sum += branchNumberDigits[0] * 7;
            sum += branchNumberDigits[1] * 8;
            sum += branchNumberDigits[2] * 9;
            sum %= 11;

            if(sum === 0) {
                return true;
            }

            if(bankNumber === 46) { // Masad
                if(sum === 2) {
                    return branchNumber === 154 || branchNumber === 166 || branchNumber === 178 || branchNumber === 181 || branchNumber === 183 || branchNumber === 191 || branchNumber === 192 || branchNumber === 503 || branchNumber === 505 || branchNumber === 507 || branchNumber === 515 || branchNumber === 516 || branchNumber === 527 || branchNumber === 539
    
                } else {
                    sum = 0;
                    sum += accountNumberDigits[0] * 1;
                    sum += accountNumberDigits[1] * 2;
                    sum += accountNumberDigits[2] * 3;
                    sum += accountNumberDigits[3] * 4;
                    sum += accountNumberDigits[4] * 5;
                    sum += accountNumberDigits[5] * 6;
                    sum += accountNumberDigits[6] * 7;
                    sum += accountNumberDigits[7] * 8;
                    sum += accountNumberDigits[8] * 9;
                    sum %= 11;
                    if(sum === 0) {
                        return true;
    
                    } else {
                        sum = 0;
                        sum += accountNumberDigits[0] * 1;
                        sum += accountNumberDigits[1] * 2;
                        sum += accountNumberDigits[2] * 3;
                        sum += accountNumberDigits[3] * 4;
                        sum += accountNumberDigits[4] * 5;
                        sum += accountNumberDigits[5] * 6;
                        sum %= 11;
                        return sum === 0;
                    }
                }
            }
            if(bankNumber === 14) { // Otsar Ahayal
                if((sum === 0 || sum === 2) && (branchNumber === 385 || branchNumber === 384 || branchNumber === 365 || branchNumber === 347 || branchNumber === 363 || branchNumber === 362 || branchNumber === 361)) {
                    return true;
                } else if(sum === 4 && (branchNumber === 363 || branchNumber === 362 || branchNumber === 361)) {
                    return true;
                } else {
                    sum = 0;
                    sum += accountNumberDigits[0] * 1;
                    sum += accountNumberDigits[1] * 2;
                    sum += accountNumberDigits[2] * 3;
                    sum += accountNumberDigits[3] * 4;
                    sum += accountNumberDigits[4] * 5;
                    sum += accountNumberDigits[5] * 6;
                    sum += accountNumberDigits[6] * 7;
                    sum += accountNumberDigits[7] * 8;
                    sum += accountNumberDigits[8] * 9;
                    sum %= 11;
                    if(sum === 0) {
                        return true;
                    } else {
                        sum = 0;
                        sum += accountNumberDigits[0] * 1;
                        sum += accountNumberDigits[1] * 2;
                        sum += accountNumberDigits[2] * 3;
                        sum += accountNumberDigits[3] * 4;
                        sum += accountNumberDigits[4] * 5;
                        sum += accountNumberDigits[5] * 6;
                        sum %= 11;
                        return sum === 0;
                    }
                }
            }

    }

    return false;
};

},{}]},{},[1])(1)
});
