async function initMap() {
  
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const center = { lat: 37.966774418236604, lng: -122.52741599352697 };
  const map = new Map(document.getElementById("map"), {
    zoom: 9,
    center,
    mapTypeControl: false,
    streetViewControl: false,
    mapId: "99ceafbf2eaede861f64936d",
  });

  // Get the data on recs from the JSON file held in '/assets/data/'
  // And build the markers based on that
  const recs = await d3.dsv('|', '/assets/data/sf_recs.csv');
  console.log(recs)
  for (const rec of recs) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      content: buildContent(rec),
      position: {lat: parseFloat(rec.lat), lng: parseFloat(rec.lng)},
      title: rec.name,
    });

    marker.addListener("click", () => {
      toggleHighlight(marker, rec);
    });
  }
}

function toggleHighlight(markerView, rec) {
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = null;
  } else {
    markerView.content.classList.add("highlight");
    markerView.zIndex = 1;
  }
}

function buildContent(rec) {
  const content = document.createElement("div");

  content.classList.add("rec");
  let priceIcon = '';
  if (rec.price == 'Free') {
    priceIcon = `
      <span>Free</span>
    `
  } else {
    for (let i = 0; i < (rec.price.length); i++) {
      priceIcon += `
        <i aria-hidden="true" class="fa-solid fa-badge-dollar fa-lg dollar" title="Dollar"></i>
      `
    }
  }
  content.innerHTML = `
    <div class="icon ${rec.type}">
            <i class="fa-solid fa-${rec.icon1} fa-md"></i>
            <i class="fa-solid fa-${rec.icon2} fa-md"></i>
    </div>
    <div class="details">
        <div class="name"><a href="${rec.link}">${rec.name}</a></div>
        <div class="address">${rec.address}</div>
        <div class="description">${rec.description}</div>
        <div class="features">
        <div>
          ${priceIcon}
        </div>
        <div>
            <i aria-hidden="true" class="fa-solid fa-${rec.extra_icon} fa-lg ${rec.extra_color}" title="Extra"></i>
            <span class="fa-sr-only">Extra</span>
            <span>${rec.extra_text}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa-solid fa-calendar-lines-pen fa-lg rez" title="Reservation"></i>
            <span class="fa-sr-only">Reservation</span>
            <span>${rec.rez}</span>
        </div>
        </div>
    </div>
    `;
  return content;
}


initMap();
