# Neuron Simulator
# Copyright (c) 2015 Maxwell Ciotti
# The human cerebral cortex can have from 100-500 trillion synapses

class Network(object)

    def __init__(self):
        self.neurons = []
        self.conduction = [[]]

class Neuron(object)

    def __init__(self):
        self.membrane_potential = -70
        self.threshold = 55
        self.forward_connections = []

    def connect(neuron):
        self.forward_connections.push(neuron)

    # Charge can be positive or negative
    def accumulate(charge):
        self.potential += charge
        if self.potential > self.threshold:
            self.fire()

    def fire():
