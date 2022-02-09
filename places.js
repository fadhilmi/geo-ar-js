const loadPlaces = function () {
  return [
    {
      name: "Your place name",
      location: {
        lat: 2.733615, // add here latitude if using static data
        lng: 101.894279, // add here longitude if using static data
      },
    },
  ];
};

const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 27000,
};

window.onload = () => {
  // document.getElementById("button").onclick = (event) => {
  //   const latitude = document.getElementById("input-latitude").value;
  //   const longitude = document.getElementById("input-longitude").value;

  //   const isLatitudeValid = isFinite(latitude) && Math.abs(latitude) <= 90;
  //   const isLongitudeValid = isFinite(longitude) && Math.abs(longitude) <= 180;
  //   if (isLatitudeValid && isLongitudeValid) {
  //     const icon = document.querySelector("a-box");
  //     icon.setAttribute(
  //       "gps-entity-place",
  //       `latitude: ${latitude}; longitude: ${longitude}`
  //     );
  //   } else {
  //     alert("please enter valide latitude & longitude");
  //   }
  // };

  const scene = document.querySelector("a-scene");
  // first get current user location

  const handleCurrentPos = (position) => {
    // then use it to load from remote APIs some places nearby

    const {
      latitude: userLatitude,
      longitude: userLongitude,
      altitude: userAltitude,
    } = position.coords;

    const latitudeText = document.querySelector("#latitude-text");
    const longitudeText = document.querySelector("#longitude-text");
    const altitudeText = document.querySelector("#altitude-text");
    latitudeText.innerHTML = `Latitude: ${userLatitude}`;
    longitudeText.innerHTML = `Longitude: ${userLongitude}`;
    altitudeText.innerHTML = `Altitude: ${userAltitude}`;

    const places = loadPlaces();
    console.log("[DEBUG] :: ", { places });
    places.forEach((place) => {
      console.log("[DEBUG] :: ", { place });
      // add place icon
      // const icon = document.createElement("a-entity");
      const icon = document.createElement("a-box");
      icon.setAttribute("id", "aEntity");
      icon.setAttribute(
        "gps-entity-place",
        "latitude: 2.7335247; longitude: 101.8942062;"
      );

      // icon.setAttribute("animation-mixer", "loop: repeat");
      // icon.setAttribute(
      //   "gltf-model",
      //   "https://cdn.glitch.me/fc511399-d148-4898-ad51-f0b6fafd32a6/scene.gltf"
      // );
      icon.setAttribute("color", "red");
      icon.setAttribute("scale", "10 10 10");
      icon.setAttribute("position", "0 80 -5");
      icon.setAttribute("rotation", "5 0 0");

      icon.addEventListener("loaded", () =>
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"))
      );

      const clickListener = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        alert("hey");
      };

      icon.addEventListener("click", clickListener);

      scene.appendChild(icon);
    });
  };

  const handleGeoSuccess = (position) => {
    const {
      latitude: userLatitude,
      longitude: userLongitude,
      altitude: userAltitude,
    } = position.coords;

    const latitudeText = document.querySelector("#latitude-text");
    const longitudeText = document.querySelector("#longitude-text");
    const altitudeText = document.querySelector("#altitude-text");
    const distanceText = document.querySelector("#distance-text");
    latitudeText.innerHTML = `Latitude: ${userLatitude}`;
    longitudeText.innerHTML = `Longitude: ${userLongitude}`;
    altitudeText.innerHTML = `Altitude: ${userAltitude}`;

    const distanceMsg = document
      .querySelector("[gps-entity-place]")
      .getAttribute("distanceMsg");
    console.log(distanceMsg);
    distanceText.innerHTML = `Distance: ${distanceMsg}`;
  };

  const handleGeoError = (err) => {
    console.error("Error in retrieving position", err);
  };

  navigator.geolocation.getCurrentPosition(
    handleCurrentPos,
    handleGeoError,
    options
  );

  navigator.geolocation.watchPosition(
    handleGeoSuccess,
    handleGeoError,
    options
  );

  return navigator.geolocation.clearWatch(
    handleGeoSuccess,
    handleGeoError,
    options
  );
};
