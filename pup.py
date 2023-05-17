stages = [
    { 'start': 8*7, 'end': 122, 'min': 0.5, 'max': 1 },
    { 'start': 122, 'end': 183, 'min': 1.5, 'max': 2 },
    { 'start': 183, 'end': 275, 'min': 1, 'max': 1.667 },
    { 'start': 275, 'end': 365, 'min': 2, 'max': 2 },
    { 'start': 365, 'end': 2*365, 'min': 2, 'max': 3 }
]

def lerp(v0, v1, t):
    return (1 - t) * v0 + t * v1

def get_stage(age):
    for stage in stages:
        if stage['start'] <= age < stage['end']:
            return stage
    return None

def nearest(value, steps):
    deltas = [abs(s - value) for s in steps]
    return steps[deltas.index(min(deltas))]

def amount_to_feed(age):
    stage = get_stage(age)
    if stage == None:
        return None

    t = (age - stage['start']) / (stage['end'] - stage['start'])
    raw_amount = lerp(stage['min'], stage['max'], t)

    amounts = [x / 4 for x in range(1, 13)]
    return nearest(raw_amount, amounts)

total = 0
for age in range(8*7, 2*365 - 1):
    total = total + amount_to_feed(age)
    # print(age, feed_amount, total)

print('TOTAL:', total)

