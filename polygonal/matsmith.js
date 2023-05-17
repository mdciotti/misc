function rows(mat) { return mat.length; }
function cols(mat) { return mat[0].length; }

function clone(mat) {
	var result = [];

	for (var i = 0, m = rows(mat); i < m; i++) {
		var row = [];
		for (var j = 0, n = cols(mat); j < n; j++) {
			row.push(mat[i][j]);
		}
		result.push(row);
	}
	return result;	
}

function transpose(mat) {
	var result = [];

	for (var i = 0, m = rows(mat); i < m; i++) {
		var row = [];
		for (var j = 0, n = cols(mat); j < n; j++) {
			row.push(mat[j][i]);
		}
		result.push(row);
	}

	return result;
}

function removeRow(mat, i) {
	mat.splice(i, 1);
	return mat;
}

function removeCol(mat, j) {
	for (var i = 0, m = rows(mat); i < m; i++) {
		mat[i].splice(j, 1);
	}
	return mat;
}

function scale(mat, k) {

	for (var i = 0, m = rows(mat); i < m; i++) {
		for (var j = 0, n = cols(mat); j < n; j++) {
			mat[i][j] *= k;
		}
	}

	return mat;
}

function sameDimensions(mat1, mat2) {
	return rows(mat1) === rows(mat2) && cols(mat1) === cols(mat2);
}

function mult(mat1, mat2) {

	if (cols(mat1) !== rows(mat2)) {
		throw new Error("Matrix 1 should have a number of rows equal to the number of columns in matrix 2!");
	}

	var result = [];

	for (var i = 0, m = rows(mat1); i < m; i++) {
		var row = [];
		for (var j = 0, n = cols(mat1); j < n; j++) {
			var sum = 0;
			for (var k = 0; k < m; k++) {
				sum += mat1[i][k] * mat2[k][j];
			}
			row.push(sum);
		}
		result.push(row);
	}

	return result;
}

function add(mat1, mat2) {

	if (!sameDimensions(mat1, mat2)) {
		throw new Error("Matrices must be the same dimensions!");
		return;
	}

	for (var i = 0, m = rows(mat1); i < m; i++) {
		for (var j = 0, n = cols(mat1); j < n; j++) {
			mat1[i][j] += mat2[i][j];
		}
	}

	return mat1;
}

function subtract(mat1, mat2) {

	if (!sameDimensions(mat1, mat2)) {
		throw new Error("Matrices must be the same dimensions!");
		return;
	}

	for (var i = 0, m = rows(mat1); i < m; i++) {
		for (var j = 0, n = cols(mat1); j < n; j++) {
			mat1[i][j] -= mat2[i][j];
		}
	}

	return mat1;
}

function det(mat) {
	if (rows(mat) !== cols(mat)) {
		throw new Error("Matrix must be square!");
		return;
	}

	var result = 0,
		sign = 1;

	if (rows(mat) === 2) {
		result = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
	} else {
		for (var j = 0, n = cols(mat); j < n; j++) {
			sign = (j % 2) === 0 ? 1 : -1;
			result += sign * mat[0][j] * det(removeCol(removeRow(clone(mat), 0), j));
		}
	}

	return result;
}

function inspect(mat) {
	var str = mat[0].join(" ");

	for (var i = 1, m = rows(mat); i < m; i++) {
		str += "\n" + mat[i].join(" ");
	}

	console.log(str);
}

function horner(str, from_base) {
	var str = str.toUpperCase();
	var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var n = str.length;
	var ans = alphabet.indexOf(str[0]);
	var f_part = 0;

	// var point = str.indexOf(".");
	// if (point >= 0) {
	// 	for (var i = point + 1; i < n; i++) {

	// 	}
	// }
	str.split(".");


	for (var i = 1; i < n; i++) {
		ans = ans * from_base + alphabet.indexOf(str[i]);
	}

	return ans + f_part;
}
