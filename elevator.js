
class Passenger {
	constructor(location, destination) {
		this.location = location
		this.destination = destination
	}

	update() {
		if (this.location instanceof Elevator) {
			if (this.location.currentFloorNum === this.destination.num) {
				if (this.location.doorsOpen) {
					this.location.passengers.remove(this)
					this.destination.arrived.add(this)
					this.location = this.destination
				}
			} else {
				this.location.selectedFloors.add(this.destination.num)
			}
		} else {
			if (this.location.elevatorPresent) {
				this.upQueue.remove(this)
				this.downQueue.remove(this)
				this.location.elevatorPresent.passengers.add(this)
				this.location = this.location.elevatorPresent
			} else {
				if (this.location.currentFloorNum < this.destination.num) {
					this.location.upQueue.add(this)
				} else if (this.location.currentFloorNum > this.destination.num) {
					this.location.downQueue.add(this)
				}
			}
		}
	}
}

class Floor {
	constructor(num) {
		this.num = num
		this.upQueue = new Set()
		this.downQueue = new Set()
		this.arrived = new Set()
		this.elevatorPresent = null
	}

	update() {
		for (let pu of this.upQueue) pu.update()
		for (let pd of this.downQueue) pd.update()
	}
}

class Elevator {
	constructor() {
		this.passengers = new Set()
		this.currentFloorNum = 0
		this.selectedFloors = new Set()
		this.doorsOpen = false
	}

	update() {
		if (this.doorsOpen) {
			for (let p of this.passengers) p.update()
		}

		let fn = this.currentFloorNum
		while (this.selectedFloors.has(fn)) {
			
		}
	}
}

class Building {
	constructor(n_floors) {
		this.floors = []
		for (let i = 0; i < n_floors; i++) {
			this.floors.push(new Floor(i + 1))
		}
		this.elevator = new Elevator()
	}

	update() {
		this.elevator.update()
		this.floors.map(f => f.update())
	}
}

const floors = 3
const b1 = new Building(floors)
for (let i = 0; i < 15; i++) {
	let f = Math.floor(Math.random() * floors) + 1
	let d = Math.floor(Math.random() * floors) + 1
	let p = new Passenger(b1.floors[f], b1.floors[d])
	p.update()
}