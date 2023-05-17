
function iterate(str) {
	var out = "";
	var current = str.charAt(0);
	var count = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);
		console.log(i, c);
		while (c === current) {
			count++;
			c = str.charAt(i+1);
		}
		out += count + current;
		current = c;
		count = 0;
	}
	console.log(out);
	return out;
}
iterate(iterate(iterate("1")));