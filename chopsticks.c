#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <unistd.h>

#define N 5 //the number of philosophers

static pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

// sem_t S[N]; //semaphores for chopsticks
static pthread_cond_t S[N];

void *philospher(void*num);
void take_chopsticks(int);
void put_chopsticks(int);

int phil_num[N] = {0, 1, 2, 3, 4}; //philosopher ID

// Solution 3
int available[N] = {1, 1, 1, 1, 1}; 

int main()
{
	int i;
	pthread_t thread_id[N];
	for (i = 0; i < N; i++)
		// sem_init(&S[i], 0, 1);
		if (pthread_cond_init(&S[i], NULL) != 0) {
			perror("pthread_cond_init() error");
			exit(1);
		}

	for (i = 0; i < N; i++)
		pthread_create(&thread_id[i], NULL, philospher, &phil_num[i]);

	for (i = 0; i < N; i++)
		pthread_join(thread_id[i], NULL);
}

void *philospher(void *num)
{
	while(1)
	{
		int *i = num;
		take_chopsticks(*i);
		put_chopsticks(*i);
	}
}

void take_chopsticks(int ph_num)
{
	int firstChopstick = 0;
	int secondChopstick = 0;

	pthread_mutex_lock(&mutex);
	printf("Philosopher %d is Hungry\n", ph_num);
	// Even Philosophers
	if (ph_num % 2 == 0) {
		// Pickup Right
		firstChopstick = (ph_num + 1) % N;
		// Pickup Left
		secondChopstick = ph_num;
	} else { // Odd Philosophers
		// Pickup Left
		firstChopstick = ph_num;
		// Pickup Right
		secondChopstick = (ph_num + 1) % N;
	}
  
	if (available[firstChopstick] == 1 && available[secondChopstick] == 1)
	{
		// sem_wait(&S[firstChopstick]);
        pthread_cond_wait(&S[firstChopstick], &mutex);
		printf("Philosopher %d takes chopstick %d \n", ph_num, firstChopstick);
		// Set chopstick[firstChopstick] to not available
		available[firstChopstick] = 0;
		sleep(1);

		// sem_wait (&S[(secondChopstick)]);
        pthread_cond_wait(&S[firstChopstick], &mutex);
		printf("Philosopher %d takes chopstick %d \n", ph_num, secondChopstick);
		// Set chopstick[secondChopstick] to not available
		available[secondChopstick] = 0;
		printf("Philosopher %d is eating\n", ph_num);
		sleep(1);
	}
	pthread_mutex_unlock(&mutex);
}

void put_chopsticks(int ph_num)
{
	int firstChopstick = 0;
	int secondChopstick = 0;

	// Even Philosophers
	if (ph_num % 2 == 0) {
		// Pickup Right
		firstChopstick = (ph_num + 1) % N;
		
		// Pickup Left
		secondChopstick = ph_num;
	} else { // Odd Philosophers
		// Pickup Left
		firstChopstick = ph_num;

		// Pickup Right
		secondChopstick = (ph_num + 1) % N;
	}
	// sem_post (&S[firstChopstick]);
    pthread_cond_signal(&S[firstChopstick]);
	// Set chopstick[firstChopstick] to available again
	available[firstChopstick] = 1;
	printf("Philosopher %d putting chopstick %d \n", ph_num, firstChopstick);

	sleep(1);

	// sem_post (&S[secondChopstick]);
    pthread_cond_signal(&S[secondChopstick]);
	// Set chopstick[secondChopstick] to avilable again
	available[secondChopstick] = 1;
	printf("Philosopher %d putting chopstick %d \n", ph_num, secondChopstick);

	printf("Philosopher %d is thinking\n", ph_num);
	sleep(1);
}
