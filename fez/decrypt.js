
var txt = [
	[
		[15,5], [13,15,21,18,21], [15,8,9], [1,18,21], [17,8,7],
		[5], [9,5,19,19], [16,21], [17,8,7,18],
		[15,21,23,1,15,21,12,18,8,14], [13,8,12,1,17]
	],
	[
		[4,8], [13,15,5,4], [5,4], [11,7,4,13], [1],
		[18,8,7,13,5,14,21], [10,18,8,6,21,12,7,18,21],
		[16,7,13], [5], [12,8], [14,21,21,12],
		[4,8,3,21,8,14,21], [15,21,18,21], [11,7,4,13],
		[5,14], [6,1,4,21], [4,8,3,21,13,15,5,14,2],
		[2,8,21,4], [9,18,8,14,2]
	]
];
// txt[2] = [1,8,22, 0, 20,18,8,3, 0, 8,7,21,18, 0, 15,21,18,21, 0, 16,7,13, 0, 21,7,21,18,17,13,15,5,14,2, 0, 19,8,8,22,4, 0, 8,20, 0, 17,8,7,18, 0, 9,21,5,18,12];

var eng = {
	alphabet: " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	freq: " ETAOINSHRDLCUMWFGYPBVKJXQZ",
	pair_freq: ["TH", "HE", "AN", "RE", "ER", "IN", "ON", "AT", "ND", "ST", 
		"ES", "EN", "OF", "TE", "ED", "OR", "TI", "HI", "AS", "TO"],
	doub_freq: ["LL", "EE", "SS", "OO", "TT", "FF", "RR", "NN", "PP", "CC"],
	init_freq: "SACMPRTBFGDHINELOWUVJKQYZX",
	init_freq2: "TASHWIOBMFCLDPNEGRYUVJKQZX"
};

// var source = txt1;//.concat(0, txt2, 0, txt10);
var source_str = txt.map(function (page) {
	return page.map(function (word) {
		return word.map(function (n) {
			return eng.alphabet[n];
		}).join('');
	}).join(' ') + '.';
}).join(' ');

// var source_str = source.map(function (n) {
// 	return eng.alphabet[n];
// }).join('');
console.log(source_str);

function freq_analysis(str, lang) {
	var counts = {};
	// Setup counts variable
	for (var i = 0; i < lang.alphabet.length; i++) {
		counts[lang.alphabet[i]] = 0;
	}

	// count occurrences
	for (var i = str.length - 1; i >= 0; i--) {
		++counts[str[i]];
	}
	return counts;
}

function sort_freq(counts) {
	var arr = [];
	for (var l in counts) {
		if (counts.hasOwnProperty(l)) {
			arr.push([eng.alphabet.indexOf(l), l, counts[l]]);
		}
	}
	return arr.sort(function (A, B) { return A[2] < B[2]; });
}

// console.log(sort_freq(freq_analysis(source_str, eng)));

var guess = {
	'A': 'a',
	'B': 'g',
	'C': 'm',
	'D': 's',
	'E': 'i',
	'F': 'c',
	'G': 'v',
	'H': 'o',
	'I': 'w',
	'J': 'p',
	'K': 'j',
	'L': 'd',
	'M': 't',
	'N': 'n',
	'O': 'h',
	'P': 'b',
	'Q': 'y',
	'R': 'r',
	'S': 'l',
	'T': 'f',
	'U': 'e',
	'V': 'k',
	'W': 'x',
	'X': '[qz]'
};

function create_code(freq, lang) {

}

function decrypt(str, code) {
	var regex;
	for (var c in code) {
		if (code.hasOwnProperty(c)) {
			regex = new RegExp(c, "g");
			str = str.replace(regex, code[c]);
		}
	}
	return str;
}

console.log(decrypt(source_str, guess));

var speech = [
	"hi there how are you, i will be your, hexahedron today",
	"so this is just a, routine procedure, but i do need, someone here just, in case something, goes wrong",
	"if something does, go wrong you are, going to have to, clean up the mess",
	"hey wait a minute, can you even, understand, what i am saying, and what is wrong, with your head",
	"oh well you are, here now might as, well do this thing, prepare to have, your mind blown",
	// Cutscene
	"all right, welcome to the, club enjoy your, free hat",
	"i kind of thought, maybe this would, not work because, of your weird head, but everything looks, aok from over here",
	"thanks for the hand, you can go home, now it was very nice, to meet you"
];
