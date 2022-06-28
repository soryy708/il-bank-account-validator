'use strict';

const validator = require('../index');
const negativeData = require('./negativeData.json');
const positiveData = require('./positiveData.json');
const weirdData    = require('./weirdData.json');
const assert = require('assert');

function testCase(testData, expectation) {
    it(`validator(${testData.bankNumber}, ${testData.branchNumber}, ${testData.accountNumber}) === ${expectation}`, function() {
        const result = validator(testData.bankNumber, testData.branchNumber, testData.accountNumber);
        assert.strictEqual(result, expectation);
    });
}

// Feed good inputs, expect to get true
describe('Happy flow', function() {
    for (let data of positiveData) {
        testCase(data, true);
    }
});

// Feed bad inputs, expect to get false
describe('Negative flow', function() {
    for (let data of negativeData) {
        testCase(data, false);
    }
});

// Feed weird inputs, expect to get sane results
describe('Adversary flow', function() {
    for (let data of weirdData) {
        testCase(data, data.expectation);
    }
});
