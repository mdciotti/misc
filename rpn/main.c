
#include <stdio.h>
#include <stdlib.h>

double add(double x, double y) {
	return x + y;
}

double divide(double x, double y) {
	return x / y;
}

double subtract(double x , double y) {
	return x - y;
}

double multiply(double x, double y) {
	return x * y;
}



int main() {

	char a[8];
	char b[8];
	double x;
	double y;

	gets(a);
	gets(b);

	x = atof(a);
	y = atof(b);


	printf("Result: %f\n", add(x, y));
	return 0;
}
