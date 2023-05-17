#include <stdio.h>
#include <stdlib.h>

unsigned long long int reduce (unsigned long long int n)
{
	unsigned long long int result, d;

	result = 1;

	while (n > 0) {
		d = n % 10;
		n = (n - d)/10;
		result *= d;
	}

	return result;
}

unsigned long long int reduceAndCount (unsigned long long int n)
{
	unsigned long long int count;

	count = 0;

	while (n > 10) {
		n = reduce(n);
		count++;
	}

	return count;
}

unsigned long long int findPersistence (unsigned long long int n)
{
	unsigned long long int i, x; 

	i = 0;
	x = 0;

	while (x != n) {
		x = reduceAndCount(++i);
	}

	return i;
}

int main (int argc, char *argv[])
{
	unsigned long long int n;

	n = atoi(argv[1]);
	printf("%llu\n", findPersistence(n));

	return 0;
}
