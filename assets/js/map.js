async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const center = { lat: 38.90892791748047, lng: -77.03687286376953 };
  const map = new Map(document.getElementById("map"), {
    zoom: 14,
    center,
    mapTypeControl: false,
    streetViewControl: false,
    mapId: "347ecc0a4fa8540",
  });

  await d3.json("/assets/data/restaurants.json", function (d) {
    const restaurants = d;
    for (const restaurant of restaurants) {
      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
      map,
      content: buildContent(restaurant),
      position: restaurant.position,
      title: restaurant.name,
      });

      AdvancedMarkerElement.addListener("click", () => {
        toggleHighlight(AdvancedMarkerElement, restaurant);
      });
    }
  });


  
    for (const key in legend_colors) {
      const type = legend_colors[key];
      const div = document.createElement("div");

      div.innerHTML = `<span style="color:${type.color};"><i class="fa-solid fa-circle"></i> ${type.name}</span>`;
      legend.appendChild(div);
    }
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  
}

function toggleHighlight(markerView, restaurant) {
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = null;
  } else {
    markerView.content.classList.add("highlight");
    markerView.zIndex = 1;
  }
}

function buildContent(restaurant) {
  const content = document.createElement("div");

  content.classList.add("restaurant");
  content.innerHTML = `
    <div class="icon ${restaurant.type}">
            <i class="fa-solid fa-${restaurant.icon1} fa-md"></i>
            <i class="fa-solid fa-${restaurant.icon2} fa-md"></i>
    </div>
    <div class="details">
        <div class="name"><a href="${restaurant.link}">${restaurant.name}</a></div>
        <div class="address">${restaurant.address}</div>
        <div class="description">${restaurant.description}</div>
        <div class="features">
        <div>
            <i aria-hidden="true" class="fa-solid fa-badge-dollar fa-lg dollar" title="Average Dinner"></i>
            <span class="fa-sr-only">Average Dinner</span>
            <span>${restaurant.price}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa-solid fa-${restaurant.extra_icon} fa-lg ${restaurant.extra_color}" title="Extra"></i>
            <span class="fa-sr-only">Extra</span>
            <span>${restaurant.extra_text}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa-solid fa-calendar-lines-pen fa-lg rez" title="Reservation"></i>
            <span class="fa-sr-only">Reservation</span>
            <span>${restaurant.rez}</span>
        </div>
        </div>
    </div>
    `;
  return content;
}

const legend_colors = {
  grab_and_go: {
    name: "Grab & Go",
    color: "#D05353"
  },
  affordable_sitdown: {
    name: "Affordable Sitdown",
    color: "#41BBD9"
  },
  affordable_and_drinks: {
    name: "Affordable & Drinks",
    color: "#7CD179"
  },
  expensive_sitdown: {
    name: "Expensive Sitdown",
    color: "#33658A"
  },
  expensive_and_drinks: {
    name: "Expensive & Drinks",
    color: "#679965"
  },
  drinks: {
    name: "Drinks",
    color: "#FFB140"
  },
  want_to_go: {
    name: "Want to Go",
    color: "#262626"
  },

}

initMap();
