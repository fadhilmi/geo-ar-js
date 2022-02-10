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
  const errorText = document.querySelector("#error-text");
  const backdrop = document.querySelector("#input-field");
  const customBtn = document.querySelector("#btn-custom");

  let object = {
    name: "Your Object",
    location: {
      lat: 2.733615, // add here latitude if using static data
      lng: 101.894279, // add here longitude if using static data
      pos: "0 80 0",
    },
  };

  // backdrop.onclick = () => {
  //   try {
  //     backdrop.className = "input-container-hidden";
  //   } catch (err) {
  //     alert(err);
  //   }
  // };

  document.getElementById("btn-input").onclick = (event) => {
    try {
      const aBox = document.querySelector("a-box");
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
        console.log("[DEBUG] :: ", { aBox });
        aBox.setAttribute(
          "gps-entity-place",
          `latitude: ${latitude}; longitude:${longitude}`
        );
        objectLatitudeText.innerHTML = `Obj. Latitude: ${latitude}`;
        objectLongitudeText.innerHTML = `Obj. Longitude: ${longitude}`;
        inputField.className = "input-container-hidden";
        showInput = false;
      } else {
        alert("please enter valid latitude & longitude");
      }
    } catch (err) {
      errorText.innerHTML = `btnInput - onclick :: ${err}`;
    }
  };

  customBtn.onclick = () => {
    try {
      const inputField = document.querySelector("#input-field");
      const btnText = document.querySelector("#btn-text");
      if (showInput) {
        inputField.className = "input-container-hidden";
        btnText.innerHTML = "Custom";
      } else {
        inputField.className = "input-container";
        btnText.innerHTML = "Close";
      }
      showInput = !showInput;
    } catch (err) {
      errorText.innerHTML = `customBtn - onClick:: ${err}`;
    }
  };

  document.querySelector(".info-header").onclick = () => {
    try {
      if (show) {
        infoDescription.className = "info-details-hidden";
        arrow.style.transform = "rotate(360deg)";
      } else {
        infoDescription.className = "info-details";
        arrow.style.transform = "rotate(180deg)";
      }
      show = !show;
    } catch (err) {
      errorText.innerHTML = `infoHeader - onClick :: ${err}`;
    }
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
      objectLatitudeText.innerHTML = `Obj. Latitude: ${userLatitude + 0.0001}`;
      objectLongitudeText.innerHTML = `Obj. Longitude: ${
        userLongitude + 0.0001
      }`;

      const scene = document.querySelector("a-scene");
      const icon = document.createElement("a-box");
      icon.setAttribute("id", "aEntity");
      icon.setAttribute(
        "gps-entity-place",
        `latitude: ${userLatitude + 0.0001}; longitude: ${
          userLongitude + 0.0001
        };`
      );

      // icon.setAttribute("animation-mixer", "loop: repeat");
      // icon.setAttribute(
      //   "gltf-model",
      //   "https://cdn.glitch.me/fc511399-d148-4898-ad51-f0b6fafd32a6/scene.gltf"
      // );
      icon.setAttribute("width", "2");
      icon.setAttribute("height", "2");
      icon.setAttribute("depth", "2");
      icon.setAttribute("color", "red");
      icon.setAttribute("scale", "1 1 1");
      icon.setAttribute("position", `0 ${userAltitude + 1} 0`);
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
      errorText.innerHTML = `handleCurrentPos :: ${err}`;
    }
  };

  const handleGeoSuccess = (position) => {
    try {
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
    } catch (err) {
      errorText.innerHTML = `handleGeoSuccess :: ${err}`;
    }
  };

  const handleGeoError = (err) => {
    errorText.innerHTML = `handleGeoError :: ${err}`;
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
