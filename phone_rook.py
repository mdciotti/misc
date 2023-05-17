graph = {}

def connect(a, b):
	if a in graph:
		graph[a].append(b)
	else:
		graph[a] = [b]

# 1 2 3
# 4 5 6
# 7 8 9
#   0  

connect(0, 4)
connect(0, 6)
connect(1, 6)
connect(1, 8)
connect(2, 7)
connect(2, 9)
connect(3, 4)
connect(3, 8)
connect(4, 0)
connect(4, 3)
connect(4, 9)
connect(6, 0)
connect(6, 1)
connect(6, 7)
connect(7, 2)
connect(7, 6)
connect(8, 1)
connect(8, 3)
connect(9, 4)
connect(9, 2)

def neighbors(position):
	return graph[position]

def yield_sequences(starting_position, num_hops, sequence=None):
    if sequence is None:
        sequence = [starting_position]
    
    if num_hops == 0:
        yield sequence
        return

    for neighbor in neighbors(starting_position):
        yield from yield_sequences(
            neighbor, num_hops - 1, sequence + [neighbor])

def count_sequences(start_position, num_hops):                  
    if num_hops == 0:                                           
        return 1                                                
                                                                
    num_sequences = 0                                           
    for position in neighbors(start_position):                  
        num_sequences += count_sequences(position, num_hops - 1)
    return num_sequences

print(count_sequences(6, 2))
