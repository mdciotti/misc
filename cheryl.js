var DATES = ['May 15',    'May 16',    'May 19',
            'June 17',   'June 18',
            'July 14',   'July 16',
          'August 14', 'August 15', 'August 17'];

function Month(date) { return date.split(' ')[0]; }
function Day(date) { return date.split(' ')[1]; }

// Cheryl tells a part of her birthdate to someone;
// return a new list of possible dates that match the part.
function tell(part, possible_dates) {
	possible_dates = possible_dates ? possible_dates : DATES;
	return possible_dates.filter(function (date) {
		return date.indexOf(part) >= 0;
	});
}

// A person knows the birthdate if they have exactly one possible date
function know(possible_dates) {
	return possible_dates.length === 1;
}

// Return a list of the possible dates for which statements 3 to 5 are true.
function cheryls_birthday(possible_dates) {
	return possible_dates.filter(statements3to5);
}

function statements3to5(date) {
	var s3 = statement3(date);
	var s4 = statement4(date);
	var s5 = statement5(date);
	console.log(date, s3, s4, s5);
	return s3 && s4 && s5;
}

// Albert: I don't know when Cheryl's birthday is, but I know that Bernard does not know too.
function statement3(date) {
	var possible_dates = tell(Month(date));
	return !know(possible_dates)
		&& possible_dates.every(function (d) {
			return !know(tell(Day(d)));
		});
}

// Bernard: At first I don't know when Cheryl's birthday is, but I know now.
function statement4(date) {
	var at_first = tell(Day(date));
	return !know(at_first)
		&& know(at_first.filter(statement3));
}

// Albert: Then I also know when Cheryl's birthday is.
function statement5(date) {
	return know(tell(Month(date)).filter(statement4));
}

console.log(cheryls_birthday(DATES));

