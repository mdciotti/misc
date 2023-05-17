var data = [1, 2, 3, 4, 5];

function x2(x) { return 2 * x; }

data.map(x2);
// >> [2, 4, 6, 8, 10]

function odd(x) { return x % 2 == 1; }

data.filter(odd);
// >> [1, 3, 5]

data.filter(odd).map(x2);
// >> [2, 6, 10]

data.map(x2).filter(odd);
// >> []

function sum(total, x) { return total + x; }

data.reduce(sum);
// >> 15


// COLLECTIONS

var people_schema = {
	name: String,
	age: Number
};

var people = [
	{ name: "Max", age: 21 },
	{ name: "Sumaiya", age: 19 },
	{ name: "Brandon", age: 21 },
	{ name: "Tasha", age: 20 },
	{ name: "Peggy", age: 35 },
	{ name: "Dan", age: 40 },
	{ name: "Chris", age: 20 }
];

people.map(function (item) {
	return item.name;
});
// >> ["Max", "Sumaiya", "Brandon", "Tasha", "Peggy", "Dan", "Chris"]

function canDrink(person) { return person.age >= 21; }

people.filter(canDrink);
// >> [{Max...}, {Brandon...}, {Peggy...}, {Dan...}]

people.forEach(function (person) {
	console.log(person.name + " is " + person.age + " years old.");
});


function memoize(fn, ctx) {
	let memo = {}
	ctx = ctx || this
	return (val) => {
		if (!memo.hasOwnProperty(val))
			memo[val] = fn.call(ctx, val)
		return memo[val]
	}
}

let climbStairs_memoized = memoize(climbStairs)

climbStairs_memoized(2)
