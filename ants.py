"""
Simulates ant behavior
"""

# import numpy as np
from math import cos, sin, pi, floor, fsum #, exp
import random
import sys
import time
from collections import deque
import pygame
from pygame.locals import *

class Ground(object):
    width = 0
    height = 0
    data = None
    lodata = None
    pheremone_decay_rate = 0.9375

    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.data = [0.0] * (self.width * self.height)
        self.lodata = [0.0] * (self.width * self.height)

    def add(self, samp_x, samp_y, value):
        world_x = floor(samp_x) % self.width
        world_y = floor(samp_y) % self.height
        self.data[world_y * self.width + world_x] += value

    def samp(self, samp_x, samp_y):
        world_x = floor(samp_x) % self.width
        world_y = floor(samp_y) % self.height
        return self.data[world_y * self.width + world_x]

    def losamp(self, samp_x, samp_y):
        world_x = floor(samp_x) % self.width
        world_y = floor(samp_y) % self.height
        return self.lodata[world_y * self.width + world_x]

    def lopass(self):
        """
        Computes the 2D convolution of the ground data based on a
        square n*n kernel. Results are stored in the `lodata` array.
        """

        kernel_size = 3
        lodata_tmp = [0.0] * (self.width * self.height)

        # Low-pass over columns
        vkernel = deque()
        for i in range(0, self.width):
            for k in range(0, 2 * kernel_size + 1):
                vkernel.append(self.samp(i, 0 - kernel_size + k))
            for j in range(0, self.height):
                self.lodata[j * self.width + i] = fsum(vkernel) / len(vkernel)
                vkernel.popleft()
                vkernel.append(self.samp(i, j + kernel_size + 1))

        # Low-pass over rows
        hkernel = deque()
        for j in range(0, self.height):
            for k in range(0, 2 * kernel_size + 1):
                hkernel.append(self.losamp(0 - kernel_size + k, j))
            for i in range(0, self.width):
                lodata_tmp[j * self.width + i] = fsum(hkernel) / len(hkernel)
                hkernel.popleft()
                hkernel.append(self.losamp(i + kernel_size + 1, j))

        self.lodata = lodata_tmp

    def step(self):
        for cell in self.data:
            # cell = cell * exp(-x)
            cell = cell * self.pheremone_decay_rate

        self.lopass()

WAITING = 0
WALKING = 1
FORAGING = 2

class Ant(object):
    """
    Ants should:
    - largely follow pheremone trails
    - interact with other nearby ants
    """

    p_x = 0
    p_y = 0
    dir = 0 # rad
    speed = 1 # px/s
    pheremone_drop_rate = 1 # amount / step
    state = WALKING

    def __init__(self, initial_x, initial_y):
        self.p_x = initial_x
        self.p_y = initial_y
        self.dir = random.random() * 2 * pi

    def inspect(self, ground):
        a_len = 3 # antennae length (px)
        a_sep = 90 * pi / 180 # antennae separation (deg)

        left_dir = self.dir + a_sep / 2
        right_dir = self.dir - a_sep / 2
        left_samp_x = self.p_x + a_len * cos(left_dir)
        left_samp_y = self.p_y + a_len * sin(left_dir)
        right_samp_x = self.p_x + a_len * cos(right_dir)
        right_samp_y = self.p_y + a_len * sin(right_dir)

        left = ground.losamp(left_samp_x, left_samp_y)
        right = ground.losamp(right_samp_x, right_samp_y)
        # total = left + right
        # if total > 0.0:
        #     self.dir = (left / total) * left_dir + (right / total) * right_dir
        # else:
        #     self.dir += random.random() * a_sep - a_sep / 2
        if left > right:
            self.dir = left_dir
        elif left < right:
            self.dir = right_dir

    def step(self, ground):
        """
        1. Inspect ground
           a. sample low-pass ground at each antenna
           b. choose antenna with higher pheremone
        2. Probabilistically choose segment
        3. Drop pheremone
        4. Travel in direction of segment
        """
        self.inspect(ground)
        ground.add(self.p_x, self.p_y, self.pheremone_drop_rate)
        self.p_x += self.speed * cos(self.dir)
        self.p_y += self.speed * sin(self.dir)
        self.p_x = self.p_x % ground.width
        self.p_y = self.p_y % ground.height

class AntSim(object):

    n_ants = 10
    ants = []
    ground = None
    curr_time = 0
    prev_time = 0
    target_fps = 60
    screen = None

    def __init__(self):
        random.seed()

        self.ground = Ground(width=100, height=100)

        for _ in range(0, self.n_ants):
            initial_x = random.random() * self.ground.width
            initial_y = random.random() * self.ground.height
            self.ants.append(Ant(initial_x, initial_y))

    def start(self):
        self.prev_time = time.time()
        pygame.init()
        pygame.font.init()
        pygame.display.init()
        self.screen = pygame.display.set_mode((self.ground.width, self.ground.height))

        # self.draw()

        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    sys.exit()

            self.step()
            self.draw()

            self.curr_time = time.time()
            diff = self.curr_time - self.prev_time
            delay = max(1.0 / self.target_fps - diff, 0)
            time.sleep(delay)
            self.prev_time = self.curr_time

            # fps = 1.0 / (delay + diff)
            # pygame.display.set_caption("{1:.2f}".format(fps))

    def draw(self):
        self.screen.fill((255, 255, 255))
        pxarray = pygame.PixelArray(self.screen)
        for loc_x in range(0, self.ground.width):
            for loc_y in range(0, self.ground.height):
                pheremone_level = self.ground.data[loc_y * self.ground.width + loc_x]
                prev_px = self.screen.unmap_rgb(pxarray[loc_x, loc_y])
                new_blue = max(0, prev_px.b - 10 * pheremone_level)
                pxarray[loc_x, loc_y] = self.screen.map_rgb(prev_px.r, prev_px.g, new_blue)

        for ant in self.ants:
            position = (floor(ant.p_x), floor(ant.p_y))
            pygame.draw.circle(self.screen, (0, 0, 0), position, 1)

        pygame.display.flip()

    def step(self):
        self.ground.step()

        for ant in self.ants:
            ant.step(self.ground)

if __name__ == '__main__':
    AntSim().start()
