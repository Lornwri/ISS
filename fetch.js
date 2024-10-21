let url = 'https://api.wheretheiss.at/v1/satellites/25544';

let issLat = document.querySelector('#iss-lat');
let issLong = document.querySelector('#iss-long');
let timeIssLocationFetched = document.querySelector('#time');

let update = 10000; // page data reloads every 10 seconds
let maxFailedAttempts = 3; // Maximum number of retry attempts

let issMarker;
let icon = L.icon({
    iconUrl: 'ISS-icon.png', // Make sure this image path is correct
    iconSize: [50, 50],
    iconAnchor: [25, 25] // Shifts where the icon is relative to the coordinates
});

let map = L.map('iss-map').setView([0, 0], 1);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

// Start fetching ISS data with a maximum number of attempts
iss(maxFailedAttempts);

function iss(attempts) {
    if (attempts > 0) { // Proceed only if there are remaining attempts
        fetch(url)
            .then(res => res.json())
            .then((issData) => {
                console.log(issData);
                let lat = issData.latitude;
                let long = issData.longitude;

                // Update lat/long display
                issLat.innerHTML = lat;
                issLong.innerHTML = long;

                // Move the marker as the ISS moves
                if (!issMarker) {
                    // Create marker
                    issMarker = L.marker([lat, long], { icon: icon }).addTo(map);
                } else {
                    issMarker.setLatLng([lat, long]);
                }

                // Update timestamp
                let now = new Date().toLocaleString();
                timeIssLocationFetched.innerHTML = `This data was fetched at ${now}`; // time and date data was fetched
            })
            .catch((err) => {
                attempts--; // Subtract from attempts
                console.log('ERROR!', err);
            })
            .finally(() => {
                setTimeout(() => iss(attempts), update); // Continue updating every 10 seconds with updated attempts
            });
    } else {
        console.log("Max retry attempts reached.");
    }
}
