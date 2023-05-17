/********************************\
| Document Object Model API      |
| (c) 2010 Max Ciotti            |
\********************************/

function Color() {
	var arg = arguments; //Alias for easy access
	this._MAX_ALPHA = 1; //In case it needs to be changed to another format
	this._MAX_DEGREES = 360;
	this.bits_color	 = 24;
	this.bits_alpha = 8;
	this._colors = Math.pow(2,this.bits_color/3); ///Color depth in each rgb channel
	switch (arguments.length) {
	case 4:
		this.alpha = ((arg[3] <= 0)?0:((arg[3] >= 1)?1:arg[3])); //Converts alpha values less than 0 to 0, and greater than 1 to 1
	case 3:
		this.alpha = this.alpha || this._MAX_ALPHA; //If Alpha is not set, (case 4 doesn't fall through), then set alpha to 1
		if (typeof(arg[0]) === "number" && typeof(arg[1]) === "number" && typeof(arg[2]) === "number") {
			this.RGBA(arg[0], arg[1], arg[2], this.alpha);
		} else if (typeof(arg[0]) === "number" && typeof(arg[1]) === "string" && typeof(arg[2]) === "string") {
			this.HSLA(arg[0], arg[1], arg[2], this.alpha);
		} else {
			this.type = "ERROR";
			console.error('Incompatible argument type(s)!\nTryUsing HSL (360,"100%","100%") or RGB (255,255,255)');
		}
		break;
	case 1: this.hex(arg[0]);
		break;
	case 0: break;
	default:
		this.type = "ERROR";
		console.error('Invalid number (' + arguments.length + ') of arguments passed to a Color declaration.');
		break;
	}
	return this;
};

Color.prototype.RGB = function (r,g,b) {
	this.type = "RGB";
	if (arguments.length !== 3) console.error('Invalid number (' + arguments.length + ') of arguments passed to function RGB().');
	//return "rgb(" + r + ", " + g + ", " + b + ")";
	this.red = Math.abs(r%this._colors); //Converts odd color values to 0-255
	this.green = Math.abs(g%this._colors);
	this.blue = Math.abs(b%this._colors);
	this.alpha = this._MAX_ALPHA;
	return this;
}

Color.prototype.RGBA = function (r,g,b,a) {
	this.type = "RGBA";
	if (arguments.length !== 4) console.error('Invalid number (' + arguments.length + ') of arguments passed to function RGBA().');
	//return "rgb(" + r + ", " + g + ", " + b + ", " + a + ")";
	this.red = Math.abs(r%this._colors); //Converts odd color values to 0-255
	this.green = Math.abs(g%this._colors);
	this.blue = Math.abs(b%this._colors);
	this.alpha = a;
	return this;
}

Color.prototype.HSL = function (h,s,l) {
	this.type = "HSL";
	if (arguments.length !== 3) console.error('Invalid number (' + arguments.length + ') of arguments passed to function HSL().');
	this.hue = Math.abs(h%this._MAX_DEGREES); //Converts from higher degrees to 0-360
	this.saturation = s;
	this.luminance = l;
	this.alpha = this._MAX_ALPHA;
	return this;
}

Color.prototype.HSLA = function (h,s,l,a) {
	this.type = "HSLA";
	if (arguments.length !== 4) console.error('Invalid number (' + arguments.length + ') of arguments passed to function HSLA().');
	this.hue = Math.abs(h%this._MAX_DEGREES);
	this.saturation = s;
	this.luminance = l;
	this.alpha = a;
	return this;
}

Color.prototype.hex = function (hex) {
	this.type = "hexadecimal";
	if (arguments.length !== 1) console.error('Invalid number (' + arguments.length + ') of arguments passed to function hex().');
	hex = hex.toLowerCase();
	if (hex.indexOf('#') === 0) { //Contains # prefix
		if (hex.length === 7) {
			this.red = hex.substr(1,2);
			this.green = hex.substr(3,2);
			this.blue = hex.substr(5,2);
			this.alpha = this._MAX_ALPHA;
		} else if (hex.length === 4) {
			this.red = hex.substr(1,1) + hex.substr(1,1);
			this.green = hex.substr(2,1) + hex.substr(2,1);
			this.blue = hex.substr(3,1) + hex.substr(3,1);
			this.alpha = this._MAX_ALPHA;
		}
	} else if (hex.indexOf('0x') === 0) { //Contains 0x prefix
		if (hex.length === 8) {
			this.red = hex.substr(2,2);
			this.green = hex.substr(4,2);
			this.blue = hex.substr(6,2);
			this.alpha = this._MAX_ALPHA;
		} else if (hex.length === 5) {
			this.red = hex.substr(2,1) + hex.substr(2,1);
			this.green = hex.substr(3,1) + hex.substr(3,1);
			this.blue = hex.substr(4,1) + hex.substr(4,1);
			this.alpha = this._MAX_ALPHA;
		}
	} else if (hex.indexOf('#') === -1 && hex.indexOf('0x') === -1) { //Does not contain prefix
		if (hex.length === 6) {
			this.red = hex.substr(0,2);
			this.green = hex.substr(2,2);
			this.blue = hex.substr(4,2);
			this.alpha = 1;
		} else if (hex.length === 3) {
			this.red = hex.substr(0,1) + hex.substr(0,1);
			this.green = hex.substr(1,1) + hex.substr(1,1);
			this.blue = hex.substr(2,1) + hex.substr(2,1);
			this.alpha = this._MAX_ALPHA;
		}
	} else {
		console.error('Invalid hex color string "' + hex + '"!');
	}
}

Color.prototype.inspect = function () {
	if (arguments.length !== 0) console.error('Function "inspect()" should not receive any arguments!');
	console.log('RGBA: ' + this.toRGBA() + '\nHSLA: ' + this.toHSLA() + '\nHex:  ' + this.toHex());
	//return {RGBA:this.toRGBA(),HSLA:this.toHSLA(),Hex:this.toHex()};
	return null;
};

Color.prototype.toRGB = function () {
	if (arguments.length !== 0) console.error('Function "toRGB()" should not receive any arguments!');
	switch (this.type) {
	case "RGBA":
		return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
	case "HSLA":
		return; //"hsl(" + this.red + "," + this.green + "," + this.blue + ")";
	case "hexadecimal":
		return "rgb(" + parseInt(this.red,16) + "," + parseInt(this.green,16) + "," + parseInt(this.blue,16) + ")";
	default:
		console.error('Function "toRGB()" expects the type to be valid.');
		break;
	}
	return null;
};

Color.prototype.toRGBA = function () {
	if (arguments.length !== 0) console.error('Function "toRGBA()" should not receive any arguments!');
	switch (this.type) {
	case "RGBA":
		return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
	case "HSLA":
		return; //"hsl(" + this.red + "," + this.green + "," + this.blue + ")";
	case "hexadecimal":
		return "rgba(" + parseInt(this.red,16) + ", " + parseInt(this.green,16) + ", " + parseInt(this.blue,16) + ", " + this.alpha + ")";
	default:
		console.error('Function "toRGBA()" expects the type to be valid.');
		break;
	}
	return null;
};

Color.prototype.toHSL = function () {
	if (arguments.length !== 0) console.error('Function "toHSL()" should not receive any arguments!');
	switch (this.type) {
	case "RGBA":
		return; //"hsl(" + this.red + "," + this.green + "," + this.blue + ")";
	case "HSLA":
		return "hsl(" + this.hue + "," + this.saturation + "," + this.luminance + ")";
	case "hexadecimal":
		return; //"hsl(" + parseInt(this.red,16) + "," + parseInt(this.green,16) + "," + parseInt(this.blue,16) + ")";
	default:
		console.error('Function "toHSL()" expects the type to be valid.');
		break;
	}
	return null;
};

Color.prototype.toHSLA = function () {
	if (arguments.length !== 0) console.error('Function "toHSL()" should not receive any arguments!');
	switch (this.type) {
	case "RGBA":
		return; //"hsla(" + this.red + "," + this.green + "," + this.blue + ")";
	case "HSLA":
		return "hsla(" + this.hue + "," + this.saturation + "," + this.luminance + ", " + this.alpha + ")";
	case "hexadecimal":
		return; //"hsla(" + parseInt(this.red,16) + "," + parseInt(this.green,16) + "," + parseInt(this.blue,16) + ")";
	default:
		console.error('Function "toHSL()" expects the type to be valid.');
		break;
	}
	return null;
};

Color.prototype.toHex = function (prefix) {
	var prefix = prefix || "#";
	if (arguments.length !== 1 && arguments.length !== 0)	console.error('Function "toHex()" should receive 0 or 1 arguments (prefix)!');
	switch (this.type) {
	case "RGBA":
		var r = this.red.toString(16),
				g = this.green.toString(16),
				b = this.blue.toString(16);
		return prefix + (this.red < 10)?"0"+r:r  + (this.green < 10)?"0"+g:g + (this.blue < 10)?"0"+b:b;
	case "HSLA":
		return;
	case "hexadecimal":
		return prefix + this.red + this.green + this.blue;
	default:
		console.error('Function "toHex()" expects the type to be valid.');
		break;
	}
	return null;
};

/*
//+
//RGB +
console.log(new Color(0,0,0,0));
console.log(new Color(255,0,0));
//HSL +
console.log(new Color(120,"100%","50%",0));
console.log(new Color(60,"75%","25%"));
//Hexadecimal +
console.log(new Color("#00ff00"));
console.log(new Color("#00f"));
console.log(new Color("00ff00"));
console.log(new Color("00f"));
console.log(new Color("0x00ff00"));
console.log(new Color("0X00F"));
//Hexadecimal -

//-
console.log(new Color("error:","only 2 args"));
*/



