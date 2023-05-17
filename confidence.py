from math import sqrt

def confidence(ups, downs):
    total = ups + downs

    if total == 0:
        return 0

    z_score = 1.0  # 1.0 = 85%, 1.6 = 95%
    p_hat = float(ups) / total
    return sqrt(
        p_hat + z_score * z_score / (2 * total) - z_score * (
            (p_hat * (1 - p_hat) + z_score * z_score / (4 * total)) / total
        )) / (1 + z_score * z_score / total)

print confidence(30, 0)
print confidence(29, 1)
print confidence(28, 2)
print confidence(27, 3)
print confidence(26, 4)
print confidence(25, 5)
print confidence(24, 6)
print confidence(23, 7)
print confidence(22, 8)
print confidence(21, 9)
print confidence(20, 10)

# for up in range(0, 10):
#     row = []
#     for down in range(0, 10):
#         row.append(confidence(up, down))
#     print "%r | %r" % (up, row)
