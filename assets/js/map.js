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
  {
    name: "Left Door",
    link: "",
    address: "1345 S St NW",
    description: "Bartender's choice cocktails",
    icon1: "martini-glass",
    icon2: "",
    type: "drinks",
    price: "$17",
    extra_icon: "utensils",
    extra_color: "nonveg",
    extra_text: "No Food",
    rez: "No Rez",
    position: { 
      lat: 38.91442527494764,
      lng: -77.03146677542595,
    },
  },
  {
    name: "ChurchKey",
    link: "https://www.churchkeydc.com/",
    address: "1337 14th St NW",
    description: "Huge draft selection, warm vibes",
    icon1: "beer-mug",
    icon2: "",
    type: "drinks",
    price: "$10",
    extra_icon: "utensils",
    extra_color: "veg",
    extra_text: "Food",
    rez: "No Rez",
    position: { 
      lat: 38.90847885390439,
      lng: -77.03163649585525,
    },
  },
  {
    name: "All Day at Kramers",
    link: "https://www.kramers.com/all-day-by-kramers-menus/",
    address: "1337 14th St NW",
    description: "American bistro food & books",
    icon1: "fork-knife",
    icon2: "",
    type: "affordable",
    price: "$20",
    extra_icon: "leaf",
    extra_color: "veg",
    extra_text: "Vegan OK",
    rez: "No Rez",
    position: {
      lat: 38.91083549831795,
      lng: -77.04374105522061,
    },
  },
  {
    name: "Pizzeria Paradiso",
    link: "https://www.eatyourpizza.com/lunch-dinner",
    address: "2003 P St NW",
    description: "Woodfired Pizza and Beer",
    icon1: "pizza-slice",
    icon2: "",
    type: "affordable",
    price: "$15",
    extra_icon: "leaf",
    extra_color: "veg",
    extra_text: "Veg OK",
    rez: "No Rez",
    position: { 
      lat: 38.90987941538678,
      lng: -77.04515542838818,
    },
  },
  {
    name: "Compass Rose",
    link: "https://www.compassrosedc.com/menu",
    address: "1346 T St NW",
    description: "Tour of World foods",
    icon1: "earth-americas",
    icon2: "martini-glass",
    type: "expensive-and-drinks",
    price: "$40",
    extra_icon: "leaf",
    extra_color: "veg",
    extra_text: "Vegan OK",
    rez: "Rez Rec'd",
    position: {
      lat: 38.91532945665751,
      lng: -77.03154264450163,
    },
  },
  {
    name: "Roaming Rooster",
    link: "http://www.roamingroosterdc.com/menus",
    address: "1301 U St NW",
    description: "Fried Chicken Sandwiches",
    icon1: "burger-soda",
    icon2: "",
    type: "grab-and-go",
    price: "$12",
    extra_icon: "leaf",
    extra_color: "veg",
    extra_text: "Veg OK",
    rez: "No Rez",
    position: {
      lat: 38.91727029463436,
      lng: -77.0304322078068,
    },
  },
  {
    name: "Maydan",
    link: "https://www.maydandc.com/#menus-section",
    address: "1346 Florida Ave NW",
    description: "Woodfired Middle Eastern",
    icon1: "shish-kebab",
    icon2: "martini-glass",
    type: "expensive-and-drinks",
    price: "$55",
    extra_icon: "leaf",
    extra_color: "veg",
    extra_text: "Vegan OK",
    rez: "Rez Req'd",
    position: {
      lat: 38.919790278240065,
      lng: -77.03102444348733,
    },
  },
  {
    name: "Lucky Buns",
    link: "https://www.luckybuns.com/",
    address: "2000 18th St NW",
    description: "Burgers",
    icon1: "burger-soda",
    icon2: "",
    type: "affordable",
    price: "$16",
    extra_icon: "leaf",
    extra_color: "nonveg",
    extra_text: "Non Veg",
    rez: "No Rez",
    position: {
      lat: 38.91724909808782, 
      lng: -77.04192240531168,
    },
  },
];

initMap();
