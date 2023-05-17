
def pi_n(n):
    return 4.0/(8*n+1) - 2.0/(8*n+4) - 1.0/(8*n+5) - 1.0/(8*n+6)

def main():
    for i in xrange(1, 10):
        print pi_n(i)

if __name__ == '__main__': main()
