'use strict';

// The size of the digit list buffer
const BUFFER_SIZE = 256;  // bytes (one byte per digit)

// Index of the last element in the buffer
const MAX_INDEX = BUFFER_SIZE - 1;

class DigitList {
    constructor(val) {
        this.negative = false;
        this.radix = 10;
        // Digits are stored right-aligned in this buffer (little-endian)
        this._digits = new Uint8Array(BUFFER_SIZE);
        this.length = 1;

        // if (val.constructor === Array) {
        if (typeof val === 'object') {
            // Makes a DigitList from any enumerable entity of numerical values
            // this._digits = Uint8Array.from(val);
            val.forEach((e, i) => this._digits[MAX_INDEX - i] = e);
            this.length = val.length;

        } else if (typeof val === 'number') {
            // Converts a numerical value into a list of its digits
            let quotient = val,
                remainder;

            this.length = Math.floor(Math.log10(val)) + 1;
            // this._digits = new Uint8Array(n);

            while (quotient > 0) {
                let tmp = Math.floor(quotient / 10);
                remainder = quotient - 10 * tmp;
                this.digit(i++) = remainder;
                quotient = tmp;
            }
        }
    }

    // Returns the digit at index i (starting with 0 = least-significant digit)
    // e.g. digit list:  0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 4, 3, 8, 1, 0, 4
    //         indices: 15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
    digit(i) {
        // return this._digits[i];
        return this._digits[MAX_INDEX - i];
    }

    toString() {
        return this._digits.join('');
    }

    lshift(n) {
        let m = this._digits.length;
        this._digits.length += n;
        this._digits.fill(0, m);
    }

    static lshift(a, n) {
        let result = a._digits.slice();
        let m = result.length;
        result.length += n;
        result.fill(0, m);
        return new DigitList(result);
    }

    rshift(n) {
        DigitList.rshift(this, n);
    }

    static rshift(a, n) {
        a._digits.length = n;
    }

    static add(a, b) {
        var result = [];
        var m = a.length;
        var n = b.length;

        var max = Math.max(m, n);
        var carry = 0;

        for (var k = 1; k <= max; k++) {
            var ai = k <= m ? a[m - k] : 0;
            var bi = k <= n ? b[n - k] : 0;
            var sum = ai + bi + carry;
            if (sum >= 10) {
                carry = 1;
                result.unshift(sum - 10);
            } else {
                carry = 0;
                result.unshift(sum);
            }
        }

        return result;
    }

    // Subtract b from a
    static subtract(a, b) {
        var result = [];
        var m = a.length;
        var n = b.length;

        if (!leq(b, a)) {
            throw new Error("Negative digit lists not supported");
            return [];
        }

        var max = Math.max(m, n);
        var carry = 0;

        for (var k = 1; k <= max; k++) {
            var ai = k <= m ? a[m - k] : 0;
            var bi = k <= n ? b[n - k] : 0;
            var difference = ai - bi - carry;
            if (difference < 0) {
                carry = 1;
                result.unshift(difference + 10);
            } else {
                carry = 0;
                result.unshift(difference);
            }
        }

        return result;
    }

    static multiply(a, b) {
        if (a.length === 1 || b.length === 1)
            return new DigitList(a[0] * b[0]);

        // calculates the size of the numbers
        var m2 = Math.max(a.length, b.length) / 2;

        // split the digit sequences about the middle
        var high1 = a.slice(0, m2);
        var low1 = a.slice(m2);
        var high2 = b.slice(0, m2);
        var low2 = b.slice(m2);

        // 3 calls made to numbers approximately half the size
        var z0 = karatsuba(low1, low2);
        var z1 = karatsuba(add(low1, high1), add(low2, high2));
        var z2 = karatsuba(high1, high2);
        return add(
            add(
                lshift(z2, 2 * m2),
                lshift(subtract(subtract(z1, z2), z0), m2)
            ),
            z0
        );
    }

    static leq(a, b) {
        return (a.length < b.length)
            || (a.length === b.length && a.digit(0) < b.digit(0));
    }

    static eq(a, b) {
        var n = a.length;
        var m = b.length;
        if (n !== m) return false;
        var result = true;
        for (var i = 0; i < n; i++) {
            result = result && (a.digit(i) === b.digit(i));
        }
        return result;
    }
}


// Divide two integers (stored as a list the digits in base 10)
function divide(dividend, divisor) {
    // Long division method
    var quotient = [];

    var n1 = dividend.slice(0, divisor.length);
    while (leq(n1, divisor)) {

    }
}

// divide([1,2,3,4,5], [4,5])

// subtract([1,2,3,4,5], [4,6]) // [1,2,2,9,9]
// digitList(381);
karatsuba([1,2,5], [3,6])


// Operands containing rightmost digits at index 1
function multiply(a, b, base) {
    // Allocate space for result
    let p = a.length;
    let q = b.length;
    let product = [1..p + q];
    // for all digits in b
    for (let b_i = 1; b_i < q; b_i++) {
        carry = 0;
        // for all digits in a
        for (let a_i = 1; a_i < p; a_i++) {
            product[a_i + b_i - 1] += carry + a[ai] * b[bi];
            carry = product[ai + bi - 1] / base;
            product[a_i + b_i - 1] = product[ai + bi - 1] mod base;
        }
        // last digit comes from final carry
        product[b_i + p] += carry;
    }
    return product;
}
