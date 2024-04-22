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

  await d3.json("/assets/js/rests.json", function (d) {
    const restaurants = d;
    console.log(restaurants);
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

// const restaurants = [
//   {
//     name: "Astoria",
//     link: "https://astoriadc.com/",
//     address: "1521 17th St NW",
//     description: "Chinese & Tiki Cocktails",
//     icon1: "bowl-chopsticks-noodles",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$40",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91074373631267,
//       lng: -77.03832824711489,
//     },
//   },
//   {
//     name: "Aslin DC",
//     link: "https://www.aslinbeer.com/dc",
//     address: "1740 14th St NW",
//     description: "Beergarden",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "No Rez",
//     position: {
//       lat: 38.91394036088174,
//       lng: -77.03242493027032,
//     },
//   },
//   {
//     name: "Left Door",
//     link: "",
//     address: "1345 S St NW",
//     description: "Bartender's choice cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$17",
//     extra_icon: "utensils",
//     extra_color: "nonveg",
//     extra_text: "No Food",
//     rez: "No Rez",
//     position: { 
//       lat: 38.91442527494764,
//       lng: -77.03146677542595,
//     },
//   },
//   {
//     name: "ChurchKey",
//     link: "https://www.churchkeydc.com/",
//     address: "1337 14th St NW",
//     description: "Huge draft selection, warm vibes",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$10",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: { 
//       lat: 38.90847885390439,
//       lng: -77.03163649585525,
//     },
//   },
//   {
//     name: "All Day at Kramers",
//     link: "https://www.kramers.com/all-day-by-kramers-menus/",
//     address: "1337 14th St NW",
//     description: "American bistro food & books",
//     icon1: "fork-knife",
//     icon2: "",
//     type: "affordable",
//     price: "$20",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.91083549831795,
//       lng: -77.04374105522061,
//     },
//   },
//   {
//     name: "Pizzeria Paradiso",
//     link: "https://www.eatyourpizza.com/lunch-dinner",
//     address: "2003 P St NW",
//     description: "Woodfired Pizza and Beer",
//     icon1: "pizza-slice",
//     icon2: "",
//     type: "affordable",
//     price: "$15",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "No Rez",
//     position: { 
//       lat: 38.90987941538678,
//       lng: -77.04515542838818,
//     },
//   },
//   {
//     name: "Compass Rose",
//     link: "https://www.compassrosedc.com/menu",
//     address: "1346 T St NW",
//     description: "Tour of World foods",
//     icon1: "earth-americas",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$40",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91532945665751,
//       lng: -77.03154264450163,
//     },
//   },
//   {
//     name: "Roaming Rooster",
//     link: "http://www.roamingroosterdc.com/menus",
//     address: "1301 U St NW",
//     description: "Fried Chicken Sandwiches",
//     icon1: "burger-soda",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$12",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.91727029463436,
//       lng: -77.0304322078068,
//     },
//   },
//   {
//     name: "Maydan",
//     link: "https://www.maydandc.com/#menus-section",
//     address: "1346 Florida Ave NW",
//     description: "Woodfired Middle Eastern",
//     icon1: "shish-kebab",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$55",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "Need Rez",
//     position: {
//       lat: 38.919790278240065,
//       lng: -77.03102444348733,
//     },
//   },
//   {
//     name: "Lucky Buns",
//     link: "https://www.luckybuns.com/",
//     address: "2000 18th St NW",
//     description: "Burgers",
//     icon1: "burger-soda",
//     icon2: "",
//     type: "affordable",
//     price: "$16",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.91724909808782, 
//       lng: -77.04192240531168,
//     },
//   },
//   {
//     name: "The Cellar",
//     link: "https://www.dramandgrain.com/",
//     address: "2001 18th St NW",
//     description: "New American & Cocktail Den",
//     icon1: "fork-knife",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$40",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91716715156753, 
//       lng: -77.0413490296807,
//     },
//   },  
//   {
//     name: "Jack Rose",
//     link: "http://jackrosediningsaloon.com/",
//     address: "2007 18th St NW",
//     description: "Steakhouse & Whisky",
//     icon1: "steak",
//     icon2: "whiskey-glass-ice",
//     type: "expensive-and-drinks",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91739520468794, 
//       lng: -77.04144318671433,
//     },
//   },  
//   {
//     name: "The Green Zone",
//     link: "http://thegreenzonedc.com/",
//     address: "2226 18th St NW",
//     description: "Middle Eastern Cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$17",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.9194927225516, 
//       lng: -77.04186088089233,
//     },
//   },
//   {
//     name: "Retrobottega",
//     link: "https://www.retrobottegadc.com/",
//     address: "2435 18th St NW",
//     description: "Italian",
//     icon1: "fork-knife",
//     icon2: "",
//     type: "expensive",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.92139768544606,  
//       lng: -77.04201926220323,
//     },
//   },
//   {
//     name: "Taqueria Al Lado",
//     link: "http://taqueriaallado.com/",
//     address: "1792 Columbia Rd NW",
//     description: "Taqueria",
//     icon1: "taco",
//     icon2: "",
//     type: "affordable",
//     price: "$12",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.92267980949279,   
//       lng: -77.04225290184581,
//     },
//   },
//   {
//     name: "Lapis",
//     link: "http://www.lapisdc.com/foodanddrink#theanchorname",
//     address: "1847 Columbia Rd NW",
//     description: "Afghani",
//     icon1: "shish-kebab",
//     icon2: "",
//     type: "expensive",
//     price: "$40",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.92131518055421,  
//       lng: -77.04386872119899,
//     },
//   },
//   {
//     name: "SURA",
//     link: "http://www.suradcrestaurant.com/",
//     address: "2016 P St NW",
//     description: "Thai, Chinatown Izakaya Style",
//     icon1: "bowl-chopsticks-noodles",
//     icon2: "",
//     type: "affordable",
//     price: "$25",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.909455467693334,   
//       lng: -77.04568315301594,
//     },
//   },
//   {
//     name: "Fountain Inn",
//     link: "https://www.fountaininndc.com/",
//     address: "1659 Wisconsin Ave NW",
//     description: "Historical American Cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$20",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91194485142495,   
//       lng: -77.06554365696101,
//     },
//   },
//   {
//     name: "The Sovereign",
//     link: "https://thesovereigndc.com/#menus",
//     address: "1206 Wisconsin Ave NW",
//     description: "Belgian Food and Drinks",
//     icon1: "fork-knife",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.9054837469555,    
//       lng: -77.0634676362041,
//     },
//   },
//   {
//     name: "Lost Generation",
//     link: "https://www.lostgenbrewing.com/",
//     address: "327 S St NE",
//     description: "Neighborhood Brewery",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.913581318721434,   
//       lng: -77.00093905497639,
//     },
//   },
//   {
//     name: "Red Bear Brewing",
//     link: "http://www.redbear.beer/",
//     address: "209 M St NE",
//     description: "Queer Brewery",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.905396555858815,  
//       lng: -77.00247001828106,
//     },
//   },
//   {
//     name: "SUNdeVICH",
//     link: "http://www.sundevich.com/",
//     address: "601 NJ Ave NW",
//     description: "Sandwiches around the world",
//     icon1: "sandwich",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$16",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.89814152316606,  
//       lng: -77.01159513438341,
//     },
//   },
//   {
//     name: "Tonari",
//     link: "https://www.tonaridc.com/menus/",
//     address: "707 6th St NW",
//     description: "Italian, Japanese Style",
//     icon1: "pizza-slice",
//     icon2: "martini-glass",
//     type: "affordable-and-drinks",
//     price: "$20",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.898984770750154,    
//       lng: -77.01972627358228,
//     },
//   },
//   {
//     name: "Daikaya",
//     link: "http://www.daikaya.com/",
//     address: "705 6th St NW",
//     description: "Ramen",
//     icon1: "bowl-chopsticks-noodles",
//     icon2: "",
//     type: "affordable",
//     price: "$18",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.898592959781446,    
//       lng: -77.01953901016702,
//     },
//   },
//   {
//     name: "Denson",
//     link: "http://www.densondc.com/",
//     address: "600 F St NW",
//     description: "Underground Cocktail Lounge",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$15",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.8970196020797,   
//       lng: -77.02009417681136,
//     },
//   },
//   {
//     name: "The Golden Age",
//     link: "https://www.thegoldenagedc.com/",
//     address: "1726 CT Ave NW",
//     description: "Classic Cocktails and Vibes",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$17",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.9134648721217,   
//       lng: -77.04599894600852,
//     },
//   },
//   {
//     name: "McClellan's Retreat",
//     link: "http://mcclellansretreat.com/",
//     address: "2031 FL Ave NW",
//     description: "Thematic, Divey Cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$16",
//     extra_icon: "utensils",
//     extra_color: "nonveg",
//     extra_text: "No Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.91428381528258,    
//       lng: -77.04651724592503,
//     },
//   },
//   {
//     name: "OKPB",
//     link: "https://okpbdc.com/",
//     address: "3165 Mt Pleasant St NW",
//     description: "Speakeasy, Cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$17",
//     extra_icon: "utensils",
//     extra_color: "nonveg",
//     extra_text: "No Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.930723957034644,    
//       lng: -77.03788851113629,
//     },
//   },
//   {
//     name: "St Vincent",
//     link: "http://www.stvincentwine.com/",
//     address: "3213 Georgia Ave NW",
//     description: "Hoppin' Winebar",
//     icon1: "wine-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$15",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "No Rez",
//     position: {
//       lat: 38.93044187205989,     
//       lng: -77.02367015777584,
//     },
//   },
//   {
//     name: "Reliable Tavern",
//     link: "https://www.reliable-tavern.com/menu",
//     address: "3655 Georgia Ave NW",
//     description: "Reliable Dive",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "nonveg",
//     extra_text: "No Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.936071070550746,      
//       lng: -77.02401882120313,
//     },
//   },
//   {
//     name: "Sonny's",
//     link: "https://www.sonnyspizzadc.com/menu",
//     address: "3120 Georgia Ave NW",
//     description: "Pizza and Natural Wine",
//     icon1: "pizza-slice",
//     icon2: "wine-glass",
//     type: "affordable-and-drinks",
//     price: "$10",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.929633492755165,       
//       lng: -77.02359059269064,
//     },
//   },
//   {
//     name: "Andy's Pizza",
//     link: "http://eatandyspizza.com/",
//     address: "808 V St NW",
//     description: "Pizza and Chill",
//     icon1: "pizza-slice",
//     icon2: "beer-mug",
//     type: "affordable-and-drinks",
//     price: "$10",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.917555157187486,        
//       lng: -77.02327969804855,
//     },
//   },
//   {
//     name: "Izakaya Seki",
//     link: "http://www.sekidc.com/",
//     address: "1117 V St NW",
//     description: "Real Japanese Izakaya",
//     icon1: "sushi",
//     icon2: "",
//     type: "expensive",
//     price: "$40",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.918225462053925,         
//       lng: -77.02774138914938,
//     },
//   },
//   {
//     name: "Anju",
//     link: "https://www.anjurestaurant.com/",
//     address: "1805 18th St NW",
//     description: "Korean Comfort",
//     icon1: "bowl-chopsticks-noodles",
//     icon2: "",
//     type: "expensive",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91437127660703,          
//       lng: -77.04142916945742,
//     },
//   },
//   {
//     name: "Bread & Chocolate",
//     link: "http://www.breadandchocolate.net/",
//     address: "2301 M St NW",
//     description: "Euro Café",
//     icon1: "croissant",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$10",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.90555883886068,           
//       lng: -77.05028843084322,
//     },
//   },
//   {
//     name: "Bluejacket",
//     link: "https://www.bluejacketdc.com/",
//     address: "300 Tingey St SE",
//     description: "Bustling Microbrewery",
//     icon1: "burger",
//     icon2: "beer-mug",
//     type: "affordable-and-drinks",
//     price: "$20",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.87520335874293,            
//       lng: -77.00078224263386,
//     },
//   },
//   {
//     name: "Chloe",
//     link: "http://restaurantchloe.com/",
//     address: "1331 4th St SE",
//     description: "International Flare",
//     icon1: "earth-americas",
//     icon2: "",
//     type: "expensive",
//     price: "$40",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.87466461731492,             
//       lng: -77.00070446295385,
//     },
//   },
//   {
//     name: "Union Stage",
//     link: "https://www.unionstage.com/",
//     address: "740 Water St SW",
//     description: "Tiny bar above the stage",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.87886073496985,              
//       lng: -77.02385521263515,
//     },
//   },
//   {
//     name: "12 Stories",
//     link: "https://www.12storiesdc.com/menus/",
//     address: "75 District Square SW",
//     description: "Worth it for the view",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$18",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.87957952208748,              
//       lng: -77.02523768800638,
//     },
//   },
//   {
//     name: "2Fifty BBQ",
//     link: "http://www.2fiftybbq.com/",
//     address: "4700 Riverdale Rd, Riverdale Park",
//     description: "DMV BBQ",
//     icon1: "grill-hot",
//     icon2: "",
//     type: "affordable",
//     price: "$15",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.962000788687796,               
//       lng: -76.93481591674815,
//     },
//   },
//   {
//     name: "Vigilante Coffee",
//     link: "http://www.vigilantecoffee.com/",
//     address: "4327 Gallatin St, Hyattsville",
//     description: "Cool Coffee",
//     icon1: "mug-hot",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$6",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.95236371522776,                
//       lng: -76.94108264276102,
//     },
//   },
//   {
//     name: "Nina May",
//     link: "http://www.ninamaydc.com/",
//     address: "1337 11sh St NW",
//     description: "Farm-to-Table, Great Brunch",
//     icon1: "fork-knife",
//     icon2: "",
//     type: "expensive",
//     price: "$55",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.90842259278633,                
//       lng: -77.02665901076719,
//     },
//   },
//   {
//     name: "Tiger Fork",
//     link: "http://www.tigerforkdc.com/",
//     address: "Blagden Alley NW",
//     description: "Chinese & Medicinal Cocktails",
//     icon1: "bowl-chopsticks-noodles",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.906533096429015,                 
//       lng: -77.0248382521691,
//     },
//   },
//   {
//     name: "Call Your Mother Trolley",
//     link: "https://www.callyourmotherdeli.com/",
//     address: "8804 Old Georgetown Rd, Bethesda",
//     description: "Bagels on benches",
//     icon1: "bagel",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$12",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.999842546535966,                  
//       lng: -77.10977620428476,
//     },
//   },
//   {
//     name: "Daniel O'Connell's",
//     link: "http://www.danieloconnells.com/",
//     address: "112 King St, Alexandria",
//     description: "Irish American Pub",
//     icon1: "fork-knife",
//     icon2: "beer-mug",
//     type: "affordable-and-drinks",
//     price: "$20",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "No Rez",
//     position: {
//       lat: 38.804188620639906,                   
//       lng: -77.04075965720466,
//     },
//   },
//   {
//     name: "Bagel Uprising",
//     link: "https://bageluprising.com/",
//     address: "2307A Mt Vernon Ave, Alexandria",
//     description: "Quality Bagels",
//     icon1: "bagel",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$6",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.82647767387219,                    
//       lng: -77.05829606084536,
//     },
//   },
//   {
//     name: "Caboose Brewing",
//     link: "https://caboosebrewing.com/restaurant-brewpub-vienna-va/",
//     address: "520 Mill St NE, Vienna",
//     description: "Bike-Up Beers",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$7",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.907552592880194,                     
//       lng: -77.2705644963627,
//     },
//   },
//   {
//     name: "Aslin Alexandria",
//     link: "http://www.aslinbeer.com/",
//     address: "847 S Pickett St, Alexandria",
//     description: "Brewery with cool events",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.80426714390321,                      
//       lng: -77.13787685354649,
//     },
//   },
//   {
//     name: "Quill",
//     link: "https://www.jeffersondc.com/downtown-washington-dc-restaurants/quill/",
//     address: "1200 16th St NW",
//     description: "The Jefferson's swanky cocktail bar",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$23",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.90594105738225,                       
//       lng: -77.03682421959189,
//     },
//   },
//   {
//     name: "Allegory",
//     link: "http://allegory-dc.com/",
//     address: "1201 K St NW",
//     description: "Storybook themed cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "drinks",
//     price: "$20",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Snacks",
//     rez: "No Rez",
//     position: {
//       lat: 38.90287508254804,                        
//       lng: -77.02830169735198,
//     },
//   },
//   {
//     name: "The Wydown",
//     link: "http://thewydown.com/",
//     address: "1924 14th St NW",
//     description: "Coffee and Pastries",
//     icon1: "mug-hot",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$5",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.91638362699135,                         
//       lng: -77.03219240448311,
//     },
//   },
//   {
//     name: "Yellow",
//     link: "http://www.yellowthecafe.com/",
//     address: "1524 Wisconsin Ave NW",
//     description: "Levantine Café",
//     icon1: "flatbread-stuffed",
//     icon2: "",
//     type: "affordable",
//     price: "$15",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.90946093704561,                          
//       lng: -77.06463329255155,
//     },
//   },
//   {
//     name: "La Bohème",
//     link: "https://www.labohemedc.com/",
//     address: "2622 P St NW",
//     description: "Themed French Menus",
//     icon1: "fork-knife",
//     icon2: "",
//     type: "want-to-go",
//     price: "$95",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Need Rez",
//     position: {
//       lat: 38.909198985872756,                           
//       lng: -77.05549607977214,
//     },
//   },
//   {
//     name: "barmini",
//     link: "http://www.minibarbyjoseandres.com/barmini/",
//     address: "501 9th St NW",
//     description: "Molecular Cocktails",
//     icon1: "martini-glass",
//     icon2: "",
//     type: "want-to-go",
//     price: "$115",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "Need Rez",
//     position: {
//       lat: 38.89630436813174,                            
//       lng: -77.02364387102429,
//     },
//   },
//   {
//     name: "Call Your Mother Barracks Row",
//     link: "https://www.callyourmotherdeli.com/",
//     address: "701 8th St SE",
//     description: "Bagels in SE",
//     icon1: "bagel",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$12",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.8811116199946,                   
//       lng: -76.99524904652372,
//     },
//   },
//   {
//     name: "Call Your Mother West End",
//     link: "https://www.callyourmotherdeli.com/",
//     address: "1143 NH Ave NW",
//     description: "Chic Bagels",
//     icon1: "bagel",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$12",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.90491249829901,                    
//       lng: -77.0474111337449,
//     },
//   },
//   {
//     name: "Call Your Mother Logan",
//     link: "https://www.callyourmotherdeli.com/",
//     address: "1471 P St NW",
//     description: "Bagels to Go",
//     icon1: "bagel",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$12",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.90981277722425,                     
//       lng: -77.03396859249283,
//     },
//   },
//   {
//     name: "Little Pearl",
//     link: "https://www.littlepearldc.com/",
//     address: "921 Penn Ave SE",
//     description: "Prix Fixe New American",
//     icon1: "fork-knife",
//     icon2: "",
//     type: "want-to-go",
//     price: "$115",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "Need Rez",
//     position: {
//       lat: 38.883134162123355,                    
//       lng: -76.99356927579936,
//     },
//   },
//   {
//     name: "Brightwood Pizza & Anxo Cider",
//     link: "https://store.anxodc.com/",
//     address: "711 Kennedy St NW",
//     description: "Pizza and Cider",
//     icon1: "pizza-slice",
//     icon2: "apple-whole",
//     type: "affordable-and-drinks",
//     price: "$18",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.956533316905045,                     
//       lng: -77.0228473691132,
//     },
//   },
//   {
//     name: "Keren",
//     link: "",
//     address: "711 Kennedy St NW",
//     description: "Nicest Eritrean",
//     icon1: "pan-food",
//     icon2: "",
//     type: "affordable",
//     price: "$10",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Vegan OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.9167039714651,                      
//       lng: -77.0412631551551,
//     },
//   },
//   {
//     name: "Exiles",
//     link: "http://www.exilesbar.com/",
//     address: "1610 U St NW",
//     description: "Chill Tavern",
//     icon1: "beer-mug",
//     icon2: "",
//     type: "drinks",
//     price: "$8",
//     extra_icon: "utensils",
//     extra_color: "veg",
//     extra_text: "Food",
//     rez: "No Rez",
//     position: {
//       lat: 38.91678012855483,                       
//       lng: -77.03742480070991,
//     },
//   },
//   {
//     name: "Baby Shank",
//     link: "http://babyshank.com/",
//     address: "1602 U St NW",
//     description: "French Steaks, Unique Seafood",
//     icon1: "steak",
//     icon2: "sushi",
//     type: "expensive",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "nonveg",
//     extra_text: "Non Veg",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.91687381557427,                        
//       lng: -77.03705160557993,
//     },
//   },
//   {
//     name: "Bandit Taco",
//     link: "https://www.bandittacodc.com/",
//     address: "1946 NH Ave NW",
//     description: "Quick Burritos and Tacos",
//     icon1: "burrito",
//     icon2: "",
//     type: "grab-and-go",
//     price: "$14",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "No Rez",
//     position: {
//       lat: 38.9166076448446,                         
//       lng: -77.03715367604283,
//     },
//   },
//   {
//     name: "El Presidente",
//     link: "https://elpresidentedc.com/",
//     address: "1255 Union St NE",
//     description: "Neo Mexico City",
//     icon1: "taco",
//     icon2: "martini-glass",
//     type: "expensive-and-drinks",
//     price: "$30",
//     extra_icon: "leaf",
//     extra_color: "veg",
//     extra_text: "Veg OK",
//     rez: "Rez Rec'd",
//     position: {
//       lat: 38.90829662909372,                          
//       lng: -77.0005820894272,
//     },
//   },
// ];

initMap();
