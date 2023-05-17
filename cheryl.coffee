DATES = ['May 15',    'May 16',    'May 19',
        'June 17',   'June 18',
        'July 14',   'July 16',
      'August 14', 'August 15', 'August 17']

Month = (date) -> date.split(' ')[0]
Day = (date) -> date.split(' ')[1]

# Cheryl tells a part of her birthdate to someone;
# return a new list of possible dates that match the part.
tell = (part, possible_dates) ->
	possible_dates ?= DATES
	possible_dates.filter (date) ->
		date.indexOf(part) >= 0

# A person knows the birthdate if they have exactly one possible date
know = (possible_dates) ->
	possible_dates.length is 1

# Return a list of the possible dates for which statements 3 to 5 are true.
cheryls_birthday = (possible_dates) ->
	possible_dates.filter(statements3to5)

statements3to5 = (date) ->
	s3 = statement3(date)
	s4 = statement4(date)
	s5 = statement5(date)
	console.log(date, s3, s4, s5)
	s3 && s4 && s5

# Albert: I don't know when Cheryl's birthday is, but I know that Bernard does not know too.
statement3 = (date) ->
	possible_dates = tell Month(date)
	not know(possible_dates) and possible_dates.every (d) ->
		not know tell Day(d)

# Bernard: At first I don't know when Cheryl's birthday is, but I know now.
statement4 = (date) ->
	at_first = tell Day(date)
	not know(at_first) and know at_first.filter(statement3)

# Albert: Then I also know when Cheryl's birthday is.
statement5 = (date) ->
	know tell(Month(date)).filter(statement4)

console.log cheryls_birthday(DATES)

