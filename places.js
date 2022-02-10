const options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 27000,
};

window.onload = () => {
  let objectExists = false;
  let show = false;
  let showInput = false;
  const arrow = document.querySelector(".arrow");
  const infoDescription = document.querySelector("#details");

  let object = {
    name: "Your Object",
    location: {
      lat: 2.733615, // add here latitude if using static data
      lng: 101.894279, // add here longitude if using static data
      pos: "0 80 0",
    },
  };

  document.getElementById("button").onclick = (event) => {
    try {
      const latitude = document.getElementById("input-latitude").value;
      const longitude = document.getElementById("input-longitude").value;
      const objectLatitudeText = document.querySelector(
        "#object-latitude-text"
      );
      const objectLongitudeText = document.querySelector(
        "#object-longitude-text"
      );
      const inputField = document.querySelector("#input-field");

      const isLatitudeValid = isFinite(latitude) && Math.abs(latitude) <= 90;
      const isLongitudeValid =
        isFinite(longitude) && Math.abs(longitude) <= 180;

      if (isLatitudeValid && isLongitudeValid) {
        const icon = document.querySelector("a-box");
        console.log("[DEBUG] :: ", { icon });
        if (icon) {
          icon.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude}`
          );
        }
        objectLatitudeText.innerHTML = `Obj. Latitude: ${latitude}`;
        objectLongitudeText.innerHTML = `Obj. Longitude: ${longitude}`;
        inputField.className = "input-container-hidden";
        showInput = false;
      } else {
        alert("please enter valide latitude & longitude");
      }
    } catch (err) {
      alert(err);
    }
  };

  document.querySelector("#btn-custom").onclick = () => {
    const inputField = document.querySelector("#input-field");
    if (showInput) {
      inputField.className = "input-container-hidden";
    } else {
      inputField.className = "input-container";
    }
    showInput = !showInput;
  };

  document.querySelector(".info-header").onclick = () => {
    if (show) {
      infoDescription.className = "info-details-hidden";
      arrow.style.transform = "rotate(360deg)";
    } else {
      infoDescription.className = "info-details";
      arrow.style.transform = "rotate(180deg)";
    }
    show = !show;
  };

  // first get current user location

  const handleCurrentPos = (position) => {
    try {
      // then use it to load from remote APIs some places nearby

      const {
        latitude: userLatitude,
        longitude: userLongitude,
        altitude: userAltitude,
      } = position.coords;

      const latitudeText = document.querySelector("#latitude-text");
      const longitudeText = document.querySelector("#longitude-text");
      const altitudeText = document.querySelector("#altitude-text");
      const objectLatitudeText = document.querySelector(
        "#object-latitude-text"
      );
      const objectLongitudeText = document.querySelector(
        "#object-longitude-text"
      );
      latitudeText.innerHTML = `Latitude: ${userLatitude}`;
      longitudeText.innerHTML = `Longitude: ${userLongitude}`;
      altitudeText.innerHTML = `Altitude: ${userAltitude}`;
      objectLatitudeText.innerHTML = `Obj. Latitude: ${object.location.lat}`;
      objectLongitudeText.innerHTML = `Obj. Longitude: ${object.location.lng}`;

      const scene = document.querySelector("a-scene");
      const icon = document.createElement("a-box");
      icon.setAttribute("id", "aEntity");
      icon.setAttribute(
        "gps-entity-place",
        `latitude: ${object.location.lat}; longitude: ${object.location.lng};`
      );

      // icon.setAttribute("animation-mixer", "loop: repeat");
      // icon.setAttribute(
      //   "gltf-model",
      //   "https://cdn.glitch.me/fc511399-d148-4898-ad51-f0b6fafd32a6/scene.gltf"
      // );
      icon.setAttribute("color", "red");
      icon.setAttribute("scale", "10 10 10");
      icon.setAttribute("position", "0 100 -5");
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
      console.log("[DEBUG] :: ", { icon });
      scene.appendChild(icon);
      objectExists = true;
    } catch (err) {
      alert(err);
    }
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

    if (objectExists) {
      const distanceMsg = document
        .querySelector("[gps-entity-place]")
        .getAttribute("distanceMsg");
      console.log(distanceMsg);
      distanceText.innerHTML = `Distance: ${distanceMsg}`;
    }
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
