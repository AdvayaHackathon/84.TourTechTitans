import folium
from folium import Popup
from folium.plugins import MarkerCluster

def generate_leaflet_map_from_api_output(api_output):
    """
    Generate an interactive Leaflet map using the output from find_nearby_places().
    Includes color-coded markers and a directions link for each POI.
    """
    lat = api_output["landmark_location"]["lat"]
    lng = api_output["landmark_location"]["lng"]
    poi_list = api_output["nearby_places"]

    leaflet_map = folium.Map(location=[lat, lng], zoom_start=15)
    marker_cluster = MarkerCluster().add_to(leaflet_map)

    # Add landmark/user marker
    folium.Marker(
        [lat, lng],
        popup="📍 You are here",
        icon=folium.Icon(color='white')
    ).add_to(leaflet_map)

    # Add each POI marker 
    for poi in poi_list:
        name = poi["name"]
        lat2 = poi["lat"]
        lng2 = poi["lng"]
        distance = poi.get("distance_km", "?")
        type_ = poi.get("type", "unknown")
        address = poi.get("address", "")
        directions_url = poi.get("route_url", "#")
        marker_color = poi.get("marker_color", "gray")

        popup_html = f"""
        <b>{name}</b><br>
        Type: {type_}<br>
        Address: {address}<br>
        Distance: {distance} km<br>
        <a href="{directions_url}" target="_blank">Get Directions</a>
        """

        folium.Marker(
            [lat2, lng2],
            popup=Popup(popup_html, max_width=250),
            icon=folium.Icon(color=marker_color, icon='info-sign')
        ).add_to(marker_cluster)

    return leaflet_map