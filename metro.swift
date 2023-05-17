class Queue {

}

// (Internal) Node for a doubly-linked list
internal class Node<T> {
	let value: T
	var next: Node?
	var prev: Node?

	func init(val: T, prev: Node?, next: Node?) {
		self.value = val
		self.prev = prev
		self.next = next
	}
}

// Doubly-linked list
public class List<T> {
	internal var head: Node<T>?
	internal var tail: Node<T>?
	internal var length: UInt = 0

	public func append(val: T) {
		let last = self.tail
		let node = Node<T>(val, last, nil)
		self.tail = node
		length += 1
	}

	public func prepend(val: T) {
		let first = self.head
		let node = Node<T>(val, nil, first)
		self.head = node
		length += 1
	}

	public func get(i: UInt) -> T {
		var node = self.head
		for j in 0..i {
			node = node.next
		}
		return node.value
	}

	public func replace(i: UInt, val: T) {
		var node = self.head
		for j in 0..i {
			node = node.next
		}
		var newNode = Node<T>(val, node.prev, node.next)
		node.prev.next = newNode
		node.next.prev = newNode
	}

	public func remove(i: UInt) {
		var node = self.head
		for j in 0..i {
			node = node.next
		}
		node.prev.next = node.next
		node.next.prev = node.prev
		node = nil
	}
}

class Passenger {
	let destination: StationType
	var currentStation: Station
	var onTrain: Bool = false
}

class Train {
	let line: Line
	var capacity: UInt
}

class Line {
	let id: UInt
	let stations: List<Station>
}

enum StationType {
	case triangle
	case circle
	case square
	case star
	case pentagon
	case lobe
}

class Station {
	let id: UInt
	let queue: Queue<Passenger>
	let lines: Set<Line>
	var type: StationType
}

class City {
	let id: UInt
	let stations: Set<Station>
	let lines: Set<Line>
}