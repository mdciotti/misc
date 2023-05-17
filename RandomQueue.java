import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by max on 2016-04-17.
 */
public class RandomQueue<T> implements Iterator<T> {

    private ArrayList<T> source;
    private ArrayList<T> queue;
    private int queueSize;

    public RandomQueue(int size) {
        queueSize = size;
        source = new ArrayList<>(queueSize);
        queue = new ArrayList<>(queueSize);
    }

    public void add(T item) {
        source.add(item);
    }

    private void generateQueue() {
        // Ensure queue size is large enough
        while (queue.size() < queueSize) queue.add(null);

        // Create a shuffled version of source
        for (int i = 0; i < source.size(); i++ ) {
            int j = (int) Math.floor(Math.random() * (i + 1));
            if (j != i) queue.set(i, queue.get(j));
            queue.set(j, source.get(i));
        }
    }

    @Override
    public boolean hasNext() {
        return true;
    }

    @Override
    public T next() {
        // Create a new queue when empty
        if (queue.isEmpty()) generateQueue();

        // Return the first item from the queue
        return queue.remove(0);
    }

    @Override
    public void remove() {}
}
