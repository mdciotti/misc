var util = require('util'),
	colors = require('./colors');

var curry = (function () {
  
  var slice = Array.prototype.slice;
 
  var makeFn = function (fn, arity, reverse, prevArgs) {
    return function () {
      var newArgs = slice.call(arguments, 0),
          args    = prevArgs.concat(newArgs);
      if (args.length < arity) {
        return makeFn(fn, arity, reverse, args);
      } else {
        return fn.apply(null, reverse ? args.reverse() : args);
      }
    };
  };
 
  return function (fn, arity, reverse) {
    if (typeof arity === "undefined") {
      arity = fn.length;
    }
    return makeFn(fn, arity, reverse, []);
  };
 
}).call(null);
 
Function.prototype.c = function (arity, reverse) {
  return curry(this, arity, reverse);
};

Object.defineProperty(Function.prototype, 'curry', {
	get: function () {
		return curry(this);
	}
});

var h = curry(function (a, b, c) {
	return a*a + b*b + c*c;
});

// h = curry (a, b, c) -> a*a + b*b + c*c

var ex2 = h;

console.log("ex2(1)(2)(3) =>".green, ex2(1)(2)(3));
console.log("ex2(1, 2, 3) =>".green, ex2(1, 2, 3));
console.log("ex2(1, 2)(3) =>".green, ex2(1, 2)(3));
console.log("ex2(1)(2, 3) =>".green, ex2(1)(2, 3));
