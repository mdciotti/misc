--[[
0th dimension (point)
0 edges

1st dimension (segment)
1 edge = 2 * 0 + 1

x
0 - 1

    0 1
  +----
0 |   +
1 | -  

2nd dimension (square)
4 edges = 2 * 1 + 2

y x
0 0 - 0 1
0 1 - 1 1
1 0 - 0 0
1 1 - 1 0

    0 1 2 3
  +--------
0 |   + +  
1 | -     +
2 | -     +
3 |   - -  

3rd dimension (cube)
12 edges = 2 * 4 + 4

z y x
0 0 0 - 0 0 1
0 0 0 - 0 1 0
0 0 0 - 1 0 0
0 0 1 - 0 1 1
0 0 1 - 1 0 1
0 1 0 - 0 1 1
0 1 0 - 1 1 0
0 1 1 - 1 1 1
1 0 0 - 1 1 0
1 0 0 - 1 0 1
1 0 1 - 1 1 1
1 1 0 - 1 1 1

    0 1 2 3 4 5 6 7
  +----------------
0 |   + +   +      
1 | -     +   +    
2 | -     +     +  
3 |   - -         +
4 | -         + +  
5 |   -     -     +
6 |     -   -     +
7 |       -   - -  

4th dimension (hypercube)
32 edges = 2 * 12 + 8

z y x w
...
0 0 0 0 - 1 0 0 0
0 0 0 1 - 1 0 0 1
0 0 1 0 - 1 0 1 0
0 0 1 1 - 1 0 1 1
0 1 0 0 - 1 1 0 0
0 1 0 1 - 1 1 0 1
0 1 1 0 - 1 1 1 0
0 1 1 1 - 1 1 1 1
1 0 0 0 - 1 0 0 1
1 0 0 0 - 1 0 1 0
1 0 0 0 - 1 1 0 0
1 0 0 1 - 1 0 1 1
1 0 0 1 - 1 1 0 1
1 0 1 0 - 1 0 1 1
1 0 1 0 - 1 1 1 0
1 0 1 1 - 1 1 1 1
1 1 0 0 - 1 1 0 1
1 1 0 0 - 1 1 1 0
1 1 0 1 - 1 1 1 1
1 1 1 0 - 1 1 1 1

    0 1 2 3 4 5 6 7 8 9 A B C D E F
  +--------------------------------
0 |   + +   +       +              
1 | -     +   +       +            
2 | -     +     +       +          
3 |   - -         +       +        
4 | -         + +           +      
5 |   -     -     +           +    
6 |     -   -     +             +  
7 |       -   - -                 +
8 | -                 + +   +      
9 |   -             -     +   +    
A |     -           -     +     +  
B |       -           - -         +
C |         -       -         + +  
D |           -       -     -     +
E |             -       -   -     +
F |               -       -   - -  

(0 // 1) = 0
(1 // 1) = 1
(2 // 1) = 2

1 2 4 8   r / c    r % 2c  
+ + + +  0 0 0 0  0 0 0 0  0 0 0 0
  + + +  1 0 0 0  1 1 1 1  1 0 0 0
+   + +  2 1 0 0  0 2 2 2  0 1 0 0
    + +  3 1 0 0  1 3 3 3  1   0 0
+ +   +  4 2 1 0  0 0 4 4  0 0 1 0
  +   +  5 2 1 0  1 1 5 5  1 0   0
+     +  6 3 1 0  0 2 6 6  0 1   0
      +  7 3 1 0  1 3 7 7  1     0
+ + +    8 4 2 1  0 0 0    0 0 0
  + +    9 4 2 1  1 1 1    1 0 0
+   +    A 5 2 1  0 2 2    0 1 0
    +    B 5 2 1  1 3 3    1   0
+ +      C 6 3 1  0 0      0 0
  +      D 6 3 1  1 1      1 0
+        E 7 3 1  0        0

]]--

local graph = {}
graph.__index = graph

function graph.new(d)
	local self = {}
	setmetatable(self, graph)

	self.dimension = d
	self.matrix = {}

	-- Initialize edge matrix
	local n = 2^self.dimension - 1
	for r = 0, n do
		self.matrix[r] = {}
		for c = 0, n do
			self.matrix[r][c] = 0
		end
	end

	return self
end

-- Iterative algorithm
function graph:edge_iterate()
	local d = self.dimension
	for i = 0, d - 1 do
		local c = 2^i
		local r = 0
		for j = 0, 2^(d - 1) - 1 do
			self:add_edge(r, r + c)
			r = r + 1
			if r % (2 * c) == c then
				r = r + c
			end
		end
	end
end

-- Recursive algorithm
function graph:edge_recurse(r, c, n)
	if r == nil then
		n = 2^(self.dimension-1)
		c = n
		r = 0
	end
	if n == 1 then
		self:add_edge(r, c)
	else
		local hn = n // 2
		self:edge_recurse(r, c - hn, hn)
		self:edge_recurse(r + n, c + hn, hn)
		for i = 0, n - 1 do
			self:add_edge(r + i, c + i)
		end
	end
end

function graph:add_edge(r, c)
	self.matrix[r][c] = 1
end

function graph:display()
	local n = 2^self.dimension - 1

	local str
	for r = 0, n do
		-- print(table.concat(self.matrix[r], ' '))
		str = ""
		for c = 0, n do
			local ch
			if self.matrix[r][c] == 0 and self.matrix[c][r] == 0 then
				ch = ' '
			else
				ch = '+'
			end
			str = str .. ' ' .. ch
		end
		print(str)
	end
end

local g = graph.new(arg[1])
g:edge_iterate()
-- g:edge_recurse()
g:display()

--[[
Number of orthogonal edges:
edges(0) = 0
edges(n) = 2*edges(n - 1) + 2^(n - 1)

A001787
a(n) = n * 2^(n-1)

1 |   1
2 |   4   3  
3 |  12   8   5  
4 |  32  20  12   7
5 |  80  48  28  16   9
6 | 192 112  64  36  20  11
7 | 448 256 144  80  44  48  13

two points are connected iff point distance = 1

Number of vertices
v(d) = 2^d
1 | 2
2 | 4
3 | 8
4 | 16

]]--
