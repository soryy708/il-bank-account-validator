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
            return sum === 90 || sum === 72 || sum === 70 || sum === 60 || sum === 20;

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
                return sum === 0 || sum === 2;
            }
            if(bankNumber === SUPPORTED_BANKS.HAPOALIM) {
                return sum === 0 || sum === 2 || sum === 4 || sum === 6;
            }
            if(bankNumber === SUPPORTED_BANKS.MIZRAHI_TEFAHOT) {
                return sum === 0 || sum === 2 || sum === 4;
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
                return sum === 0 || sum === 2 || sum === 4;
            }
            if(bankNumber === SUPPORTED_BANKS.BEINLEUMI || bankNumber === SUPPORTED_BANKS.POALEI_AGUDAT_ISRAEL) {
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
                if(sum === 2 && (branchNumber === 154 || branchNumber === 166 || branchNumber === 178 || branchNumber === 181 || branchNumber === 183 || branchNumber === 191 || branchNumber === 192 || branchNumber === 503 || branchNumber === 505 || branchNumber === 507 || branchNumber === 515 || branchNumber === 516 || branchNumber === 527 || branchNumber === 539)) {
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
