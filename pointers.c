#include <stdio.h>
#include <stdlib.h>

#define PI 3.1415

// Vector
typedef struct {
	float x;
	float y;
} vector;

// Adds two vectors `a` and `b` then places the result in the `out` vector parameter
void vector_add(vector &out, vector *a, vector *b)
{
	out.x = a->x + b->x;
	out.y = a->y + b->y;
}

// Prints the name and values of a vector
void inspect(vector *a, char *name)
{
	printf("%s: (%5.1f, %5.1f)\n", name, a->x, a->y);
}

// Sum a list of vectors and return a new vector holding the sum
vector vector_sum(vector *items[])
{
	// Initialize the sum to (0, 0)
	vector sum = { 0.0, 0.0 };

	// Calculate number of items
	int count = sizeof(items) / sizeof(items[0]);

	for (int i = 0; i < count; i++)
	{
		sum.x += items[i]->x;
		sum.y += items[i]->y;
		// vector_add(sum, sum, items[i]);
	}

	return sum;
}

int main(char *argc, char **argv)
{
	// Create three vectors on the stack
	vector origin = { 0.0, 0.0 };
	vector position = { 3.0, 4.0 };
	vector movement = { 2.0, -1.0 };

	// Create pointers to vectors
	vector *p0 = { 0.0, 4.0 };
	vector *p1 = { 2.0, -1.0 };
	vector *p2 = { 2.0, -1.0 };

	// Create a pointer to position
	vector *a = &position;
	// Two ways to retrieve values from the pointer
	if (a->x == (*a).x);

	// Array of vectors
	vector all_vectors[3];
	// Array of pointers to vectors
	vector *all_vectors[3];

	// Add two vectors
	vector new_position;
	vector_add(&new_position, position, movement);

	vector *new_position;
	vector_add(new_position, position, movement);

	// Print vectors to console
	inspect(position, "position");
	inspect(movement, "movement");
	inspect(new_position, "new position");

	return 0;
}
