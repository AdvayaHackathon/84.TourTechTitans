import math

# Haversine formula to compute great-circle distance (in km)
def haversine_distance(lat1, lng1, lat2, lng2):
    R = 6371  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2 +
        math.cos(math.radians(lat1)) *
        math.cos(math.radians(lat2)) *
        math.sin(dlng / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    return R * c
 