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

  // Init the grid
  initRecGrid(recs);
}

function initRecGrid(recs) {
  const gridOptions = {
    columnDefs: [
      {
        headerName: '', // No header
        field: 'icon1',
        minWidth: 50,
        maxWidth: 60,
        cellRenderer: (params) => {
          const type = params.data.type?.toLowerCase() || 'default';
          const icon1 = params.data.icon1;
          return `
            <div class="icon ${type}">
              <i class="fa-solid fa-${icon1} fa-lg ${type}"></i>
            </div>
          `;
        }
      },

      {
        headerName: 'Name',
        field: 'name',
        minWidth: 160,
        cellRenderer: (params) => {
          return `<a href="${params.data.link}" class="black-link" target="_blank">${params.value}</a>`;
        },
      },
      { headerName: 'Address', field: 'address', minWidth: 180 },
      {
        headerName: "Level",
        field: "level",
        minWidth: 160,
        cellRenderer: (params) => {
          const level = parseInt(params.value, 10);
          const stars = '<i class="fa-solid fa-star fa-sm star"></i>'.repeat(level);
          let text = '';
          if (level === 1) text = 'If Nearby';
          else if (level === 2) text = 'Worth a Detour';
          else if (level === 3) text = 'Worth a Trip';

          return `
            <div class="level-cell">
              ${stars} <span class="level-desc">${text}</span>
            </div>
          `;
        }
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
  agGrid.createGrid(gridDiv, gridOptions);

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
  let levelText = '';
  if (rec.level == '1') {
    levelText = '<i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i> <span>If Nearby</span>'
  } else if (rec.level == '2') {
    levelText = '<i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i><i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i> <span>Worth a Detour</span>'
  } else {
    levelText = '<i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i><i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i><i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i> <span>Worth a Trip</span>'
  }
  content.innerHTML = `
    <div class="icon ${rec.type}">
            <i class="fa-solid fa-${rec.icon1} fa-md"></i>
            <i class="fa-solid fa-${rec.icon2} fa-md"></i>
    </div>
    <div class="details">
        <div class="name"><a href="${rec.link}" class="black-link">${rec.name}</a></div>
        <div class="address">${rec.address}</div>
        <div class="description">${rec.description}</div>
        <div class="features">
        <div>
            <i aria-hidden="true" class="fa-solid fa-badge-dollar fa-lg dollar" title="Price"></i>
            <span class="fa-sr-only">Price</span>
            <span>${rec.price}</span>
        </div>
        <div>
            ${levelText}
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
