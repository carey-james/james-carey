let activeMarkers = [];
let gridApi = null;
let map = null;

const filters = {
  type: new Set(["grab-and-go", "food", "drinks", "food-and-drinks", "want-to-go"]),
  level: new Set(["1", "2", "3"]),
  price: new Set(["$", "$$", "$$$", "$$$$"]),
};


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

    document.querySelectorAll(".filter-toggle").forEach(el => {
    el.addEventListener("click", () => {
      const category = el.dataset.filter;
      const value = el.dataset.value;

      if (filters[category].has(value)) {
        filters[category].delete(value);
        el.classList.add("inactive");
        el.querySelector("i").classList.replace("fa-eye", "fa-eye-slash");
      } else {
        filters[category].add(value);
        el.classList.remove("inactive");
        el.querySelector("i").classList.replace("fa-eye-slash", "fa-eye");
      }

      updateFilters();
    });
  });

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
          const icon1 = params.data.icon1;
          const color = getPointsColor(params.data.points);
          return `
            <div class="icon" style="color:${color}">
            <i class="fa-solid fa-${icon1} fa-lg"></i>
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
  const grid = agGrid.createGrid(gridDiv, gridOptions);
  gridApi = grid.api;

}

function getPointsColor(points) {
  // Unknown value
  if (points === "?" || points == null || points === "") {
    return "#8a2be2"; // Purple
  }

  const value = Number(points);

  // Clamp between 5 and 50
  const min = 5;
  const max = 50;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));

  // RGB interpolation:
  // Yellow (255,255,0) -> Red (255,0,0)
  const r = 255;
  const g = Math.round(255 * (1 - t));
  const b = 0;

  return `rgb(${r}, ${g}, ${b})`;
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

  const color = getPointsColor(rec.points);

  content.classList.add("rec"); 
  content.style.setProperty("--marker-color", color);

  content.innerHTML = `
    <div class="icon ${rec.type}">
            <span>${rec.points}</span>
    </div>
    <div class="details">
        <div class="name">${rec.name}</div>
        <div class="address">${rec.lat} - ${rec.lng}</div>
        <div class="description">${rec.description}</div>
        <div class="features">
        <div>
            <i aria-hidden="true" class="fa-solid fa-badge-dollar fa-lg dollar" title="Price"></i>
            <span>${rec.price}</span>
        </div>
        <div>
            <i aria-hidden="true" class="fa-solid fa-star fa-lg star" title="Star"></i> 
            <span>${rec.points}</span>
        </div>
        </div>
    </div>
    `;
  return content;
}

function updateFilters() {
  //if (!gridApi || !map) return;
  // Update MAP
  for (const { marker, rec } of activeMarkers) {
    const visible =
      filters.type.has(rec.type) &&
      filters.level.has(rec.level) &&
      filters.price.has(rec.price);
    marker.setMap(visible ? map : null);
  }

  // Update GRID
  gridApi.setFilterModel(null); // Clear existing filters
  gridApi.setRowData(
    activeMarkers
      .map(({ rec }) => rec)
      .filter(rec =>
        filters.type.has(rec.type) &&
        filters.level.has(rec.level) &&
        filters.price.has(rec.price)
      )
  );
}


initMap();
