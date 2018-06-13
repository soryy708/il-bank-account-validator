"use strict";

module.exports = function(bankNumber, branchNumber, accountNumber) {
    // Input validation:
    if(bankNumber.constructor === String) {
        bankNumber = Number(bankNumber);
    }
    if(bankNumber.constructor !== Number || isNaN(bankNumber) || (bankNumber.constructor === Number && bankNumber <= 0 || bankNumber != Math.floor(bankNumber))) {
        return false;
    }
    if(branchNumber.constructor === String) {
        branchNumber = Number(branchNumber);
    }
    if(branchNumber.constructor !== Number || isNaN(branchNumber) || (branchNumber.constructor === Number && branchNumber <= 0 || branchNumber != Math.floor(branchNumber))) {
        return false;
    }
    if(accountNumber.constructor === String) {
        accountNumber = Number(accountNumber);
    }
    if(accountNumber.constructor !== Number || isNaN(accountNumber) || (accountNumber.constructor === Number && accountNumber <= 0 || accountNumber != Math.floor(accountNumber))) {
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

    if(bankNumber === 20) { // Mizrahi Tfahot special case
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
        case(10):
        case(13):
        case(34):
            sum += accountNumberDigits[0] * 2;
            sum += accountNumberDigits[1] * 3;
            sum += accountNumberDigits[2] * 4;
            sum += accountNumberDigits[3] * 5;
            sum += accountNumberDigits[4] * 6;
            sum += accountNumberDigits[5] * 7;
            sum += accountNumberDigits[0];
            sum += accountNumberDigits[1];
            sum += branchNumberDigits[0] * 8;
            sum += branchNumberDigits[1] * 9;
            sum += branchNumberDigits[2] * 10;
            sum %= 100;
            return sum === 90 || sum === 72 || sum === 70 || sum === 60 || sum === 20;

        case(20):
        case(4):
        case(12):
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
            if(bankNumber === 4) {
                return sum === 0 || sum === 2;
            }
            if(bankNumber === 12) {
                return sum === 0 || sum === 2 || sum === 4 || sum === 6;
            }
            if(bankNumber === 20) {
                return sum === 0 || sum === 2 || sum === 4;
            }
            return false;

        case(11):
        case(17):
        case(31):
        case(52):
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

            if(bankNumber === 11 || bankNumber === 17) {
                return sum === 0 || sum === 2 || sum === 4;
            }
            if(bankNumber === 31 || bankNumber === 52) {
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

        case(9):
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

        case(54):
            return true; // wtf?

        case(22):
            sum += accountNumberDigits[0] * 2;
            sum += accountNumberDigits[1] * 3;
            sum += accountNumberDigits[2] * 4;
            sum += accountNumberDigits[3] * 5;
            sum += accountNumberDigits[4] * 6;
            sum += accountNumberDigits[5] * 7;
            sum += accountNumberDigits[6] * 2;
            sum += accountNumberDigits[7] * 3;
            return (11 - sum % 11) === accountNumberDigits[8];

        case(14):
        case(46):
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

            if(bankNumber === 46) {
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
            if(bankNumber === 14) {
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