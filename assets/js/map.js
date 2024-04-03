async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const center = { lat: 38.90892791748047, lng: -77.03687286376953 };
  const map = new Map(document.getElementById("map"), {
    zoom: 12,
    center,
    mapId: "347ecc0a4fa8540",
  });

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

  for (const key in legend_colors) {
      const type = legend_colors[key];
      const name = type.name;
      const color = type.color;
      const div = document.createElement("div");

      div.innerHTML = `<i class="fa-solid fa-circle ${color}"></i>` + name;
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
    color: "grab-and-go"
  },
  affordable_sitdown: {
    name: "Affordable Sitdown",
    color: "affordable"
  },
  affordable_and_drinks: {
    name: "Affordable & Drinks",
    color: "affordable-and-drinks"
  },
  expensive_sitdown: {
    name: "Expensive Sitdown",
    color: "expensive"
  },
  expensive_and_drinks: {
    name: "Expensive & Drinks",
    color: "expensive-and-drinks"
  },
  drinks: {
    name: "Drinks",
    color: "drinks"
  },

}

const restaurants = [
  {
    name: "Astoria",
    link: "https://astoriadc.com/",
    address: "1521 17th St NW",
    description: "Chinese & Cocktails",
    icon1: "bowl-chopsticks-noodles",
    icon2: "martini-glass",
    type: "expensive-and-drinks",
    price: "$40",
    extra_icon: "leaf",
    extra_color: "veg",
    extra_text: "Vegan OK",
    rez: "Rez Rec'd",
    position: {
      lat: 38.91074373631267,
      lng: -77.03832824711489,
    },
  },
  {
    name: "Aslin DC",
    link: "https://www.aslinbeer.com/dc",
    address: "1740 14th St NW",
    description: "Beergarden",
    icon1: "beer-mug",
    icon2: "",
    type: "drinks",
    price: "$8",
    extra_icon: "utensils",
    extra_color: "veg",
    extra_text: "Snacks",
    rez: "No Rez",
    position: {
      lat: 38.91394036088174,
      lng: -77.03242493027032,
    },
  },
];

initMap();
