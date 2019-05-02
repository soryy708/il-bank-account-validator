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
'use strict';

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
    if(!isNonNegativeInteger(bankNumber)) {
        return false;
    }
    if(!isNonNegativeInteger(branchNumber)) {
        return false;
    }
    if(!isNonNegativeInteger(accountNumber)) {
        return false;
    }

    var SUPPORTED_BANKS = {
        YAHAV: 4, // Government workers
        POST: 9,
        LEUMI: 10,
        DISCOUNT: 11,
        HAPOALIM: 12,
        IGUD: 13,
        OTSAR_AHAYAL: 14,
        MERCANTILE: 17,
        MIZRAHI_TEFAHOT: 20,
        CITIBANK: 22,
        BEINLEUMI: 31,
        ARAVEI_ISRAELI: 34, // Merged with Leumi
        MASAD: 46,
        POALEI_AGUDAT_ISRAEL: 52 // merged with Beinleumi
    }

    if(bankNumber === SUPPORTED_BANKS.MIZRAHI_TEFAHOT) {
        if(branchNumber > 400) {
            branchNumber -= 400;
        }
    }

    var accountNumberDigits = numberDigitsToArr(accountNumber, 9);
    var branchNumberDigits  = numberDigitsToArr(branchNumber, 3);

    // Account number validation
    var sum = 0;
    var remainder = 0;
    switch(bankNumber) {
        case(SUPPORTED_BANKS.LEUMI):
        case(SUPPORTED_BANKS.IGUD):
        case(SUPPORTED_BANKS.ARAVEI_ISRAELI):
            sum =  scalarProduct(accountNumberDigits.slice(0, 8), [1, 10, 2, 3, 4, 5, 6, 7]);
            sum += scalarProduct(branchNumberDigits.slice(0, 4), [8, 9, 10]);
            remainder = sum % 100;
            return arrIncludes([90, 72, 70, 60, 20], remainder);

        case(SUPPORTED_BANKS.YAHAV):
        case(SUPPORTED_BANKS.MIZRAHI_TEFAHOT):
        case(SUPPORTED_BANKS.HAPOALIM):
            sum =  scalarProduct(accountNumberDigits.slice(0, 6), [1, 2, 3, 4, 5, 6]);
            sum += scalarProduct(branchNumberDigits.slice(0, 4), [7, 8, 9]);
            remainder = sum % 11;

            switch (bankNumber) {
                case (SUPPORTED_BANKS.YAHAV):
                    return arrIncludes([0, 2], remainder);
                case (SUPPORTED_BANKS.MIZRAHI_TEFAHOT):
                    return arrIncludes([0, 2, 4], remainder);
                case (SUPPORTED_BANKS.HAPOALIM):
                    return arrIncludes([0, 2, 4, 6], remainder);
            }
            return false;

        case(SUPPORTED_BANKS.DISCOUNT):
        case(SUPPORTED_BANKS.MERCANTILE):
        case(SUPPORTED_BANKS.BEINLEUMI):
        case(SUPPORTED_BANKS.POALEI_AGUDAT_ISRAEL):
            sum = scalarProduct(accountNumberDigits.slice(0, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            remainder = sum % 11;

            switch (bankNumber) {
                case(SUPPORTED_BANKS.DISCOUNT):
                case(SUPPORTED_BANKS.MERCANTILE):
                    return arrIncludes([0, 2, 4], remainder);
                
                case(SUPPORTED_BANKS.BEINLEUMI):
                case(SUPPORTED_BANKS.POALEI_AGUDAT_ISRAEL):
                    if(arrIncludes([0, 6], remainder)) {
                        return true;

                    } else {
                        sum = scalarProduct(accountNumberDigits.slice(0, 6), [1, 2, 3, 4, 5, 6]);
                        remainder = sum % 11;
                        return arrIncludes([0, 6], remainder);
                    }
            }
            return false;

        case(SUPPORTED_BANKS.POST):
            sum = scalarProduct(accountNumberDigits.slice(0, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            remainder = sum % 10;
            return remainder === 0;

        case(54): // Jerusalem
            return true; // wtf?

        case(SUPPORTED_BANKS.CITIBANK):
            sum = scalarProduct(accountNumberDigits.slice(1, 9), [2, 3, 4, 5, 6, 7, 2, 3]);
            return (11 - sum % 11) === accountNumberDigits[0];

        case(SUPPORTED_BANKS.OTSAR_AHAYAL):
        case(SUPPORTED_BANKS.MASAD):
            sum =  scalarProduct(accountNumberDigits.slice(0, 6), [1, 2, 3, 4, 5, 6]);
            sum += scalarProduct(branchNumberDigits.slice(0, 4), [7, 8, 9]);
            remainder = sum % 11;

            if(remainder === 0) {
                return true;
            }

            if(bankNumber === SUPPORTED_BANKS.MASAD) {
                if (remainder === 2 && arrIncludes([154, 166, 178, 181, 183, 191, 192, 503, 505, 507, 515, 516, 527, 539], branchNumber)) {
                    return true;
                }

                sum = scalarProduct(accountNumberDigits.slice(0, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
                remainder = sum % 11;
                
                if(remainder === 0) {
                    return true;

                } else {
                    sum = scalarProduct(accountNumberDigits.slice(0, 6), [1, 2, 3, 4, 5, 6]);
                    remainder = sum % 11;
                    return remainder === 0;
                }
            }
            if(bankNumber === SUPPORTED_BANKS.OTSAR_AHAYAL) {
                if (arrIncludes([0, 2], remainder) && arrIncludes([385, 384, 365, 347, 363, 362, 361], branchNumber)) {
                    return true;

                } else if(remainder === 4 && arrIncludes([363, 362, 361], branchNumber)) {
                    return true;

                } else {
                    sum = scalarProduct(accountNumberDigits.slice(0, 9), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    remainder = sum % 11;
                    if(remainder === 0) {
                        return true;
                    } else {
                        sum = scalarProduct(accountNumberDigits.slice(0, 6), [1, 2, 3, 4, 5, 6]);
                        remainder = sum % 11;
                        return remainder === 0;
                    }
                }
            }
            return false;
    }

    return false;

    /**
     * Calculates scalar product of two arrays of the same length.
     * https://en.wikipedia.org/wiki/Dot_product
     * @param {Array} arr1 
     * @param {Array} arr2 
     */
    function scalarProduct(arr1, arr2) {
        var product = 0;
        for (var i = 0; i < arr1.length && i < arr2.length; ++i) {
            product += arr1[i] * arr2[i];
        }
        return product;
    }

    /**
     * Check if `val` is an element of `arr` using strict compare by reference
     * A bit like arr.includes(val), but made in-house for legacy browser support
     * @param {Array} arr 
     * @param {*} val 
     */
    function arrIncludes(arr, val) {
        if (arr) {
            for (var i = 0; i < arr.length; ++i) {
                if (arr[i] === val) {
                    return true;
                }
            }
        }
        return false;
    }

    function numberDigitsToArr(num, length) {
        var digitsArray = [];
        for (var i = 0; i < length; ++i) {
            digitsArray.push(num % 10);
            num = Math.floor(num / 10);
        }
        return digitsArray;
    }

    function isNonNegativeInteger(num) {
        return num.constructor == Number && !isNaN(num) && num >= 0 && num == Math.floor(num);
    }
};

},{}]},{},[1])(1)
});
