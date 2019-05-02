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
    switch(bankNumber) {
        case(SUPPORTED_BANKS.LEUMI):
        case(SUPPORTED_BANKS.IGUD):
        case(SUPPORTED_BANKS.ARAVEI_ISRAELI):
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
            return arrIncludes([90, 72, 70, 60, 20], sum);

        case(SUPPORTED_BANKS.MIZRAHI_TEFAHOT):
        case(SUPPORTED_BANKS.YAHAV):
        case(SUPPORTED_BANKS.HAPOALIM):
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
            if(bankNumber === SUPPORTED_BANKS.YAHAV) {
                return arrIncludes([0, 2], sum);
            }
            if(bankNumber === SUPPORTED_BANKS.HAPOALIM) {
                return arrIncludes([0, 2, 4, 6], sum);
            }
            if(bankNumber === SUPPORTED_BANKS.MIZRAHI_TEFAHOT) {
                return arrIncludes([0, 2, 4], sum);
            }
            return false;

        case(SUPPORTED_BANKS.DISCOUNT):
        case(SUPPORTED_BANKS.MERCANTILE):
        case(SUPPORTED_BANKS.BEINLEUMI):
        case(SUPPORTED_BANKS.POALEI_AGUDAT_ISRAEL):
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

            if(bankNumber === SUPPORTED_BANKS.DISCOUNT || bankNumber === SUPPORTED_BANKS.MERCANTILE) {
                return arrIncludes([0, 2, 4], sum);
            }
            if(bankNumber === SUPPORTED_BANKS.BEINLEUMI || bankNumber === SUPPORTED_BANKS.POALEI_AGUDAT_ISRAEL) {
                if(arrIncludes([0, 6], sum)) {
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
                    return arrIncludes([0, 6], sum);
                }
            }
            return false;

        case(SUPPORTED_BANKS.POST):
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

        case(SUPPORTED_BANKS.CITIBANK):
            sum += accountNumberDigits[1] * 2;
            sum += accountNumberDigits[2] * 3;
            sum += accountNumberDigits[3] * 4;
            sum += accountNumberDigits[4] * 5;
            sum += accountNumberDigits[5] * 6;
            sum += accountNumberDigits[6] * 7;
            sum += accountNumberDigits[7] * 2;
            sum += accountNumberDigits[8] * 3;
            return (11 - sum % 11) === accountNumberDigits[0];

        case(SUPPORTED_BANKS.OTSAR_AHAYAL):
        case(SUPPORTED_BANKS.MASAD):
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

            if(bankNumber === SUPPORTED_BANKS.MASAD) {
                if (sum === 2 && arrIncludes([154, 166, 178, 181, 183, 191, 192, 503, 505, 507, 515, 516, 527, 539], branchNumber)) {
                    return true;
                }

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
            if(bankNumber === SUPPORTED_BANKS.OTSAR_AHAYAL) {
                if (arrIncludes([0, 2], sum) && arrIncludes([385, 384, 365, 347, 363, 362, 361], branchNumber)) {
                    return true;
                } else if(sum === 4 && arrIncludes([363, 362, 361], branchNumber)) {
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
