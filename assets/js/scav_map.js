let activeMarkers = [];
let gridApi = null;
let map = null;

async function initMap() {
  
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const center = { lat: 38.90892791748047, lng: -77.03687286376953 };
  map = new Map(document.getElementById("map"), {
    zoom: 14,
    center,
    mapTypeControl: false,
    streetViewControl: false,
    mapId: "347ecc0a4fa8540",
  });

  // Get the data on recs from the JSON file held in '/assets/data/'
  // And build the markers based on that
  const recs = await d3.dsv('|', '/assets/data/scav_list.csv');
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

    activeMarkers.push({ marker, rec });
  }

  // Init the grid
  initRecGrid(recs);

}

function initRecGrid(recs) {
  const gridOptions = {
    columnDefs: [
      { headerName: '#', field: 'number', width: 50 },
      { headerName: 'Pts', field: 'pts', width: 60 },
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 200,
        cellRenderer: (params) => {
          return `<span>${params.value}</span>`;
        },
      },
      { headerName: 'Price', field: 'price', width: 90 },
      { headerName: 'Description', field: 'description', flex: 1, minWidth: 200 },
    ],
    defaultColDef: {
      resizable: true,
      wrapText: true,
      autoHeight: true,
    },
    rowData: recs,
    domLayout: 'autoHeight',
  };

  const gridDiv = document.querySelector('#recGrid');
  const grid = agGrid.createGrid(gridDiv, gridOptions);
  gridApi = grid.api;

}


function toggleHighlight(markerView, rec) {
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = 1;
  } else {
    markerView.content.classList.add("highlight");
    markerView.zIndex = 1000;
  }
}

function buildContent(rec) {
  const content = document.createElement("div");

  content.classList.add("rec", rec.type);
  content.innerHTML = `
    <div class="icon ${rec.type}">
            <span>${rec.number}</span>
    </div>
    <div class="details">
        <div class="name"><a href="${rec.link}" class="black-link">${rec.name}</a></div>
        <div class="address">${rec.lat}, ${rec.lng}</div>
        <div class="description">${rec.description}</div>
        <div class="features">
          <div>
              <i aria-hidden="true" class="fa-solid fa-star fa-lg star"</i>
              <span class="fa-sr-only">Points</span>
              <span>${rec.pts}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa-solid fa-badge-dollar fa-lg dollar" title="Price"></i>
              <span class="fa-sr-only">Price</span>
              <span>${rec.price}</span>
          </div>
        </div>
    </div>
    `;
  return content;
}

initMap();
