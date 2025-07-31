async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const map = new Map(document.getElementById("map"), {
    zoom: 9,
    center: { lat: 37.96677, lng: -122.52741 },
    mapTypeControl: false,
    streetViewControl: false,
    mapId: "99ceafbf2eaede861f64936d",
  });

  const recs = await d3.dsv('|', '/assets/data/sf_recs.csv');
  let allMarkers = [];
  let allRecs = recs;

  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  function fillCheckbox(containerSel, items) {
    const ul = document.querySelector(containerSel);
    ul.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<label><input type="checkbox" value="${item.value}"> ${item.text}</label>`;
      ul.appendChild(li);
    });
  }

  function populateFilters(recs) {
    const types = [...new Set(recs.map(r => r.type))].sort();
    const levels = ['1','2','3'];
    const levelLabels = { '1': 'If Nearby', '2': 'Worth a Detour', '3': 'Worth a Trip' };
    const prices = [...new Set(recs.map(r => r.price))].sort();

    fillCheckbox('#typeFilter ul', types.map(t => ({ value: t, text: capitalize(t) })));
    fillCheckbox('#levelFilter ul', levels.map(l => ({ value: l, text: levelLabels[l] })));
    fillCheckbox('#priceFilter ul', prices.map(p => ({ value: p, text: p })));
  }

  function applyFilters(data) {
    const getChecked = sel =>
      Array.from(document.querySelectorAll(sel + ' input:checked')).map(i => i.value);

    const types = getChecked('#typeFilter');
    const levels = getChecked('#levelFilter');
    const prices = getChecked('#priceFilter');

    return data.filter(r =>
      (types.length === 0 || types.includes(r.type)) &&
      (levels.length === 0 || levels.includes(r.level)) &&
      (prices.length === 0 || prices.includes(r.price))
    );
  }

  function updateMarkers(filteredRecs) {
    allMarkers.forEach(marker => marker.map = null);
    allMarkers = [];

    for (const rec of filteredRecs) {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        content: buildContent(rec),
        position: { lat: parseFloat(rec.lat), lng: parseFloat(rec.lng) },
        title: rec.name,
      });

      marker.addListener("click", () => toggleHighlight(marker, rec));
      allMarkers.push(marker);
    }
  }

  document.querySelectorAll('#options input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      const filtered = applyFilters(allRecs);
      updateMarkers(filtered);
      gridOptions.api.setRowData(filtered);
    });
  });

  populateFilters(recs);
  updateMarkers(recs);
  initRecGrid(recs);
}


let gridOptions;

function initRecGrid(recs) {
  gridOptions = {
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

function populateFilterOptions(recs) {
  const typeSet = new Set();
  const levelSet = new Set();
  const priceSet = new Set();

  recs.forEach(rec => {
    if (rec.type) typeSet.add(rec.type);
    if (rec.level) levelSet.add(rec.level);
    if (rec.price) priceSet.add(rec.price);
  });

  populateSelect('#typeFilter', [...typeSet]);
  populateSelect('#levelFilter', [...levelSet].sort());
  populateSelect('#priceFilter', [...priceSet]);
}

function populateSelect(selector, values) {
  const select = document.querySelector(selector);
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function applyFilters(data) {
  const selectedTypes = getSelectedValues('#typeFilter');
  const selectedLevels = getSelectedValues('#levelFilter');
  const selectedPrices = getSelectedValues('#priceFilter');

  return data.filter(rec =>
    (selectedTypes.length === 0 || selectedTypes.includes(rec.type)) &&
    (selectedLevels.length === 0 || selectedLevels.includes(rec.level)) &&
    (selectedPrices.length === 0 || selectedPrices.includes(rec.price))
  );
}

function getSelectedValues(selector) {
  return Array.from(document.querySelector(selector).selectedOptions).map(opt => opt.value);
}


initMap();
