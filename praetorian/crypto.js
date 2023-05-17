'use strict'

var http = require('http')
var querystring = require('querystring')

// Global values
var host = 'crypto.praetorian.com'
var email = 'max@mdc.io'
var auth_token = null
// var auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heEBtZGMuaW8iLCJ1c2VyX2lkIjozMzcsImVtYWlsIjoibWF4QG1kYy5pbyIsImV4cCI6MTQ0MzY1NjY3Mn0.QeEvIvGk8oEn7kvcMyH--kaVsRzcnhLoNSGrD--kCc8'
var challenges = {
	0: '0bf2534aafec6d8e3178aadc1004d0257b226c6576656c223a202230222c202275736572223a20226d6178406d64632e696f227d',
	1: '418f242c034e7c0cf25c31d5ccfa53137b226c6576656c223a202231222c202275736572223a20226d6178406d64632e696f227d',
	2: '',
	3: '',
	4: '',
	5: '',
	6: '',
	7: '',
	8: ''
}

function mod(a, n) {
	// Because a % n is stupid
	return a - (n * Math.floor(a / n))
}

function isLower(str, i) {
	var code = str.charCodeAt(i)
	return code >= 97 && code <= 122
}

function isUpper(str, i) {
	var code = str.charCodeAt(i)
	return code >= 65 && code <= 90
}

function ch(str, i) {
	var code = str.charCodeAt(i)
	if (isUpper(str, i)) return code - 65
	else if (isLower(str, i)) return code - 97
}

function uch(code, lower) {
	if (!lower)
		return String.fromCharCode(code + 65);
	else
		return String.fromCharCode(code + 97);
}

function byChar(str, itr) {
	var result = ''
	var lower
	for (var i = 0; i < str.length; i++) {
		lower = isLower(str, i)
		result += uch(itr(ch(str, i)), lower);
	}
	return result
}

var Caesar = {
	encrypt: (plaintext, n) => byChar(plaintext, (c) => mod(c + n, 26)),
	decrypt: (ciphertext, n) => byChar(ciphertext, (c) => mod(c - n, 26))
}

function CaesarAttack(ciphertext) {
	var results = [];
	for (var i = 1; i < 26; i++) {
		results.push(Caesar.decrypt(ciphertext, i))
	}
	// return results
	console.log(results)
}


// Used for authentication
function token(email) {
	if (auth_token !== null) {
		let req = http.request({
			method: 'POST'
			host: host,
			path: '/api-token-auth/'
		}, (res) => {
			console.log(res)
			// auth_token = { 'Authorization': `JWT ${res['token']}` }
		})
		req.write(querystring.stringify({ 'email': email }))
		req.end()
	} else {
		return auth_token
	}
}

// Fetch the challenge and hint for level n
function fetch(n, cb) {
	let req = http.request({
		method: 'GET',
		host: host,
		path: `/challenge/${n}/`,
		headers: token(email)
	}, (res) => {
		console.log(res)

		if (res.statusCode != 200) {
			// raise Exception(res.json()['detail'])
			console.log(`Invalid request: error ${res.statusCode}`)
		}
	})
	req.on('error', (e) => {
		console.log(`Problem with request: ${e.message}`)
	})
	req.end();
}

// Submit a guess for level n
function solve(n, guess) {
	let data = { 'guess': guess }
	let req = http.request({
		method: 'POST',
		host: host,
		path: `/challenge/${n}/`,
		headers: token(email)
	}, (res) => {
		console.log(res)
		if (res.status_code != 200) {
			// throw Exception(resp.json()['detail'])
			console.log(`Invalid request: error ${res.statusCode}`)
		}
	})
	req.on('error', (e) => {
		console.log(`Problem with request: ${e.message}`)
	})
	req.write(querystring.stringify(data))
	req.end()
	// return resp.json()
}
/*
// Fetch level 0
level = 0
hashes = {}
data = fetch(level)

// Level 0 is a freebie and gives you the password
guess = data['challenge']
h = solve(level, guess)

// If we obtained a hash add it to the dict
if 'hash' in h: hashes[level] = h['hash']


// Display all current hash
for (k, v) in hashes.items()
	console.log(`Level ${k}: ${v}`)
*/