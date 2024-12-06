<template>
  <button id="navigateTo" class="btn btn-outline-secondary">
    <span>Navigate</span>
    <img src="../assets/img/gps-arrow.svg" />
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'

@Component
export default class NavigateButtonComponent extends Vue {
  clickMe() {
    this.playInstruction('')
    this.navigateTo()
  }
  playInstruction(instruction) {
    if (!audioContextUnlocked) {
      unlockAudio()
    }

    if (!isMuted) {
      const utterance = new SpeechSynthesisUtterance(instruction)
      window.speechSynthesis.speak(utterance)
      console.log(instruction)
    } else {
      console.log('Sound is muted.')
    }
  }

  navigateTo() {
    //$("#map").css("pointer-events", "none");
    $('.banner').show()
    $('.annotation.route').remove()
    $('body').append($(routingMessage))

    if (trackActive) {
      map.removeControl(geolocateGlobal)
      map.addControl(geolocateGlobal)
    }
    prviprikaz = true
    isVratiPrikaz = true
    trackActive = false
    gpsActive = true
    isSetOrigin = false
    geolocateGlobal.trigger()

    $('#ModalObjekt').modal('hide')
    $('#ModalParcela').modal('hide')
    $('.selected-parameters').hide()

    $('#openTrazi').hide()
    $('#layers').hide()
    $('#date').hide()
    $('#lang').hide()
    $('body').addClass('gps-active')
    $('body').append(`${isAppleDetected ? '<button class="btn" id="audio"><i class="fas fa-volume-slash"></i></button>' : '<button class="btn active" id="audio"><i class="fas fa-volume"></i></button>'}`)
    $('#home, #nav-3d, #return, #car, #walk, #audio').css({
      opacity: '0.5',
      'pointer-events': 'none'
    })
  }

  var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    fitBoundsOptions: {
      maxZoom: 18,
    },
    trackUserLocation: true,
    showUserHeading: true,
  });

  map.addControl(geolocate);

  geolocateGlobal = geolocate;

  const directions = new MapboxDirections({
    accessToken: accessToken,
    unit: "metric",
    profile: "mapbox/driving",
    container: "directions",
    language: lng,
    geometries: "geojson",
    steps: true,
    modifier: true,
    voice_instructions: true,
    interactive: false,
    controls: {
      inputs: false,
      instructions: false,
      profileSwitcher: false,
    },
  });

  function unlockAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create a silent buffer
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);

    source.onended = () => {
      audioContextUnlocked = true;
      // Play and pause a silent sound to keep the context unlocked
      const silentSound = new Audio();
      silentSound.src = ""; // Empty source to create a silent audio
      silentSound
        .play()
        .then(() => {
          silentSound.pause();
          silentSound.currentTime = 0;
        })
        .catch((error) => console.error(error));
    };
  }

  // Add event listener to unlock audio on first interaction
  document.body.addEventListener("click", unlockAudio, { once: true });
document.body.addEventListener("touchstart", unlockAudio, { once: true });

$("#return").on("click", function () {
  //$('.hamburger-menu-trim').prop('disabled', true);
  stopMe(false);
  $(".home-button-pitch").css("display", "flex");
  //geolocate.trigger();
});
function stopMe(navigateAfter = true) {
  map.boxZoom.disable();
  map.dragPan.disable();
  map.doubleClickZoom.disable();
  map.scrollZoom.disable();
  $(".banner").hide();
  navStarted = false;
  //let element = document.getElementById('brojSobeButtons');
  //element.style.display = 'flex';
  prviprikaz = true;
  travelDone = false;
  odradjeno = false;
  trackActive = true;
  currentIndex = 0;
  waypointReached = false;

  // $(".banner").remove()
  $(".time-distance").remove();
  $(".annotation.route").remove();
  if (
    map.getLayer("route") != undefined &&
    map.getLayer("route2") != undefined &&
    map.getLayer("route-casing") != undefined &&
    map.getLayer("route2-casing") != undefined
  ) {
    map.removeLayer("route");
    map.removeLayer("route2");
    map.removeLayer("route-casing");
    map.removeLayer("route2-casing");
  }

  if (
    map.getSource("route") != undefined &&
    map.getSource("route2") != undefined
  ) {
    map.removeSource("route");
    map.removeSource("route2");
  }

  linestring = undefined;

  isVratiPrikaz = false;
  map.removeControl(geolocate);
  //map.removeControl(directions);
  directions.removeRoutes();

  setTimeout((_) => {
    console.log("in_use");
    if (map.getStyle().sources.directions.data.features.length > 0) {
      let getDirections = setInterval(function () {
        if (map.getStyle().sources.directions.data.features.length > 0) {
          directions.removeRoutes();
        }
        if (map.getStyle().sources.directions.data.features.length == 0) {
          clearInterval(getDirections);
        }
      }, 200);
    }
  }, 500);

  if ($("#nav-3d").is(".active")) {
    $("#nav-3d").toggleClass("active");
  }

  isSetOrigin = false;

  $(this).css("display", "none");
  $(".mobile-menu").hide();
  $(".mobile-menu-shade").hide();
  $("#audio").remove();
  $("#voice").remove();

  if ($("#date").is(".active")) {
    if ($(".filter-item.brand").is(".active")) {
      let isBrandActive = $(".filter-item.brand.active").text();
      coloringFilterDate(isBrandActive);
      hideInterestPoints();
    } else if ($(".filter-item:not(.brand)").is(".active")) {
      let isBrandActive = $(".filter-item.active").data("class-object");
      let isIconActive = $(".filter-item.active").data("class");
      isBrandActive != undefined
        ? coloringClassesDate(isBrandActive)
        : coloringClassesDate("x");
      isIconActive != undefined
        ? showInterestPointFilterClass(isIconActive)
        : showInterestPointFilterClassObject(isBrandActive);
    } else {
      $("#layers").removeClass("active");
      $(".filter-item").removeAttr("style");
      resetColoringFilterDate();
    }
  }
  if ($("#date").is(":not(.active)")) {
    if ($(".filter-item.brand").is(".active")) {
      let isBrandActive = $(".filter-item.brand.active").text();
      coloringFilter(isBrandActive);
      hideInterestPoints();
    } else if ($(".filter-item:not(.brand)").is(".active")) {
      let isBrandActive = $(".filter-item.active").data("class-object");
      let isIconActive = $(".filter-item.active").data("class");
      isBrandActive != undefined
        ? coloringClasses(isBrandActive)
        : coloringClasses("x");
      isIconActive != undefined
        ? showInterestPointFilterClass(isIconActive)
        : showInterestPointFilterClassObject(isBrandActive);
    } else {
      $("#layers").removeClass("active");
      $(".filter-item").removeAttr("style");
      showInterestPointsAll();
      resetingColors();
    }
  }

  $("#home").hide();
  $("#map").css("pointer-events", "none");

  map.fitBounds(bbox, {
    padding: {
      top: $(window).height() * 0.2,
      bottom: $(window).height() * 0.2,
      left: 10,
      right: 10,
    },
  });

  map.once("moveend", function () {
    //alert('4');
    map.addControl(geolocate);
    map.easeTo({
      center: map.getCenter(bbox),
      pitch: 0,
      duration: 1000,
    });
  });

  map.once("idle", function () {
    //alert('5')
    console.log("in_use");
    $("body").removeClass("gps-active");
    $("#home").show();
    $("#openTrazi").show();
    $("#layers").show();
    $("#lang").show();
    $("#date").show();
    $("#navigateTo").show();
    $(".mobile-menu").show();
    $(".mobile-menu-shade").show();
    $("#map").css("pointer-events", "auto");
    map.boxZoom.enable();
    map.dragPan.enable();
    map.doubleClickZoom.enable();
    map.scrollZoom.enable();
    if (navigateAfter) {
      navigateTo();
    } else {
      //$('.hamburger-menu-trim').prop('disabled', false);
      //updateButtonText()
    }
    //$("#brojSobeButtons").show()
  });
}

let pitch = false;

$("#nav-3d").on("click", function () {
  pitch = true;
  isVratiPrikaz = true;
  $(this).css("pointer-events", "none");
  if ($("#nav-3d").is(".active")) {
    $("#nav-3d").toggleClass("active");
    map.easeTo({
      center: map.getCenter(),
      pitch: 0,
      duration: 1000,
    });
  } else {
    $("#nav-3d").toggleClass("active");
    map.easeTo({
      center: map.getCenter(),
      pitch: 70,
      duration: 1000,
    });
  }
  setTimeout(function () {
    $("#nav-3d").css("pointer-events", "auto");
    if ($(".mapboxgl-ctrl-geolocate-background").is(":hidden")) {
      isVratiPrikaz = false;
    }
    if ($(".mapboxgl-ctrl-geolocate-background").is(":visible")) {
      isVratiPrikaz = true;
    }
  }, 1000);
});

$("#nav-3d").mouseup(function () {
  setTimeout(function () {
    pitch = false;
  }, 1000);
});

function playInstruction(instruction) {
  if (!audioContextUnlocked) {
    unlockAudio();
  }

  if (!isMuted) {
    const utterance = new SpeechSynthesisUtterance(instruction);
    window.speechSynthesis.speak(utterance);
    console.log(instruction);
  } else {
    console.log("Sound is muted.");
  }
}

function updateAudioIcon(playAudio = true) {
  if (isMuted) {
    $("#audio").html(`<i class="fas fa-volume-slash"></i>`);
    $("#audio").removeClass("active");
  } else {
    $("#audio").html(`<i class="fas fa-volume"></i>`);
    $("#audio").addClass("active");
    if (playAudio) playInstruction(translations["sound"][0][lng]);
  }
}

$(document).on("click", "#audio", function () {
  isMuted = !isMuted; // Toggle the isMuted variable
  updateAudioIcon();
});

if (pitch !== true) {
  geolocate.on("geolocate", function (e) {
    if (trackActive == true) return;

    let userBearing = e.coords.heading;
    map.rotateTo(userBearing, { duration: 1000 });

    if (prviprikaz == true) {
      handleFirstCommand();
    } else if (odradjeno === false) {
      handleInitialSetup();
    }

    if (linestring != undefined && odradjeno == true) {
      handleLineStringProcessing(e);
    }

    handleRouteSetup(e);

    return [e.coords.longitude, e.coords.latitude];
  });
}

function handleFirstCommand() {
  updateAudioIcon(false);
  prviprikaz = false;
  map.once("idle", function () {
    $("#map").css("pointer-events", "auto");
    isVratiPrikaz = false;
    $("#voice").remove();
    $(".banner-text").text(
      poly.route[0].legs[legCount].steps[0].instructions
    );
    playInstruction(poly.route[0].legs[legCount].steps[0].instructions);
    //$('.hamburger-menu-trim').prop('disabled', false);
  });
}

function handleInitialSetup() {
  odradjeno = true;
  $("#home, #nav-3d, #return, #stopMe, #car, #walk, #audio").removeAttr(
    "style"
  );
  map.boxZoom.enable();
  map.dragPan.enable();
  map.doubleClickZoom.enable();
  map.scrollZoom.enable();
  $("#return").show();
  setupGeolocateClickHandler();
  updateMapProperties();
}

function updateMapProperties() {
  map.setPaintProperty("directions-route-line", "line-color", "#d3d3d3");
  map.setPaintProperty(
    "directions-route-line-casing",
    "line-color",
    "#a9a9a9"
  );
}

function handleLineStringProcessing(e) {
  console.log("testing line string");
  let line = turf.lineString([...linestring]);
  let pt = turf.point([e.coords.longitude, e.coords.latitude]);
  let snapped = turf.nearestPointOnLine(line, pt, { units: "meters" });
  gpsLok = [snapped.geometry.coordinates[0], snapped.geometry.coordinates[1]];

  processCurrentSegment();
  updateRouteDisplay(e, snapped, line);
  handleWaypointNavigation(e, snapped);
}

function processCurrentSegment() {
  //let segment = poly.route[0].legs[legCount].steps[tockeIteracija].geometry.coordinates;
  let segmentCisti =
    poly.route[0].legs[legCount].steps[tockeIteracija].geometry;
  //segment = turf.lineString([...segment]);

  let snappedNovo = turf.nearestPointOnLine(segmentCisti, gpsLok, {
    units: "meters",
  });
  snappedNovo = [
    snappedNovo.geometry.coordinates[0],
    snappedNovo.geometry.coordinates[1],
  ];

  checkNextSegment(snappedNovo, segmentCisti);
}

function checkNextSegment(snappedNovo, segmentCisti, tolerance = 10) {
  if (poly.route[0].legs[legCount].steps.length > tockeIteracija + 1) {
    //if(legCount === 1){alert('inside1')}

    let segmentSlijedeci =
      poly.route[0].legs[legCount].steps[tockeIteracija + 1].geometry
        .coordinates;
    if (segmentSlijedeci.length > 1) {
      //if(legCount === 1 && tocketIteracija > 0){alert('inside2')}

      let segmentLineString = turf.lineString([...segmentSlijedeci]);

      // Buffer the segment to create a tolerance area
      let bufferedSegment = turf.buffer(segmentLineString, tolerance, {
        units: "meters",
      });

      // Check if the snapped point is within the buffered segment
      if (turf.booleanPointInPolygon(snappedNovo, bufferedSegment)) {
        //if(legCount === 1 && tockeIteracija > 1){alert('inside3')}
        tockeIteracija++;
      }
    }
  }
}

function updateRouteDisplay(e, snapped, line) {
  if (snapped.properties.dist < 10) {
    geolocate._userLocationDotMarker.setLngLat([
      snapped.geometry.coordinates[0],
      snapped.geometry.coordinates[1],
    ]);
    geolocate._accuracyCircleMarker.setLngLat([
      snapped.geometry.coordinates[0],
      snapped.geometry.coordinates[1],
    ]);
  }

  let start = turf.point([e.coords.longitude, e.coords.latitude]);
  let stop =
    map.getStyle().sources.directions.data.features[1].geometry[
      "coordinates"
      ];
  let sliced = turf.lineSlice(start, stop, line);

  if (map.getLayer("route2") != undefined) {
    map.getSource("route2").setData(sliced);
  }
}

function handleWaypointNavigation(e, snapped) {
  let qwer = { units: "meters" };
  let arrivedMostLikely = false;

  let prvaTocka = tockeLegs[tockeIteracija].maneuver.location;
  let slijedecaTocka =
    tockeLegs.length > tockeIteracija + 1
      ? tockeLegs[tockeIteracija + 1].maneuver.location
      : null;

  if (!slijedecaTocka) {
    console.log("nema sljedece tocke" + legCount);
    arrivedMostLikely = true;
  }

  if (tockeIteracija < 1 && legCount === 1) {
    let d2 = Math.trunc(
      turf.distance(
        gpsLok,
        poly.route[0].legs[legCount].steps[tockeIteracija + 1].maneuver
          .location,
        qwer
      )
    );
    //tockeIteracija++;
    handleNextWaypoint(
      d2,
      poly.route[0].legs[legCount].steps[tockeIteracija + 1]
    );
  } else if (!arrivedMostLikely) {
    let d = Math.trunc(turf.distance(prvaTocka, slijedecaTocka, qwer));
    let d1 = Math.trunc(turf.distance(gpsLok, prvaTocka, qwer));
    let d2 = Math.trunc(turf.distance(gpsLok, slijedecaTocka, qwer));

    if (d1 > d) {
      [prvaTocka, slijedecaTocka] = [
        tockeLegs[tockeIteracija].maneuver.location,
        tockeLegs[tockeIteracija + 1].maneuver.location,
      ];
      d = Math.trunc(turf.distance(prvaTocka, slijedecaTocka, qwer));
      d1 = Math.trunc(turf.distance(gpsLok, prvaTocka, qwer));
      d2 = Math.trunc(turf.distance(gpsLok, slijedecaTocka, qwer));
    }

    if (d2 < d && d1 < d) {
      handleNextWaypoint(d2);
    }
  } else if (arrivedMostLikely && !travelDone) {
    handleArrival();
  }
}

function handleNextWaypoint(
  distance,
  nextWaypoint = tockeLegs[tockeIteracija + 1]
) {
  let modifier = nextWaypoint.maneuver.modifier;
  let type = nextWaypoint.maneuver.type;

  if (type === "arrive" && distance < 8 && !travelDone) {
    console.log("testingNAv1");
    handleArrival(distance);
  }
  if (legCount === 0 && poly.route[0].legs.length > 1 && type === "arrive") {
    //alert('test')
    nextWaypoint.instructions = poly.route[0].legs[1].steps[1].instructions;
  }
  updateBannerText(modifier, type, nextWaypoint.instructions, distance);

  if (nextWaypoint.voice_done != 1) {
    playInstruction(nextWaypoint.instructions);
    nextWaypoint.voice_done = 1;
  }
}

function updateBannerText(modifier, type, instructions, distance) {
  $(".banner-text").html(`
    <div class="banner-top banner-text">
      <img src="assets/img/arrows/${
    modifier == undefined && type == "" ? type : modifier
  }.svg"/>
      <div>${instructions}</div>
    </div>
    <div class="banner-bottom">${formatGPSDistance["metric"](
    Math.floor(distance)
  )}</div>
  `);
}

function handleArrival(distance = 0) {
  console.log(legCount);
  console.log(poly.route[0].legs.length);
  $(".home-button-pitch").css("display", "flex");
  if (waypointReached) {
    return;
  }
  if (poly.route[0].legs.length > 1 && legCount === 0 && !waypointReached) {
    waypointReached = true;
    legCount = 1;
    const route = poly.route[0];
    speed = (route.distance / route.duration) * 3.6;
    tockeIteracija = 0;
    tockeLegs = poly.route[0].legs[legCount].steps;
    duzinaLegs = tockeLegs.length;
    return;
  } else if (
    (poly.route[0].legs.length > 1 && legCount === 1 && tockeIteracija > 0) ||
    (poly.route[0].legs.length < 2 && legCount === 0)
  ) {
    travelDone = true;
    $(".annotation.gps-done").remove();
    $("body").addClass("message");
    //console.log(distance)
    $("body").append(`
      <div class="annotation gps-done">
        <h3>${translations["Travel done"][0][lng]}</h3>
        <p>${translations["Destination reached"][0][lng]} ${
      distance ? formatGPSDistance["metric"](Math.floor(distance)) + "." : ""
    }</p>
        <div class="annotation-buttons"><div class="confirm">${
      translations["Fine"][0][lng]
    }</div></div>
      </div>
    `);
    $(".annotation.gps-done .confirm").on("click", function () {
      $("body").removeClass("message");
      $(".annotation.gps-done").remove();
      stopMe(false);
    });
  }
}

function setupGeolocateClickHandler() {
  $(".mapboxgl-ctrl-geolocate-background").on("click", function () {
    $(".time-distance").removeAttr("style");

    $(".mapboxgl-ctrl-top-right .mapboxgl-ctrl").hide();
    $("#nav-3d").css("pointer-events", "none");
    setTimeout(function () {
      isVratiPrikaz = false;
      $("#nav-3d").css("pointer-events", "auto");
    }, map._easeOptions.duration);
  });
}

function handleRouteSetup(e) {
  if (waypointReached) {
    waypointReached = false;
  } else if (!isSetOrigin) {
    legCount = 0;
    directions.setDestination(destinationLocation);
    directions.setOrigin([e.coords.longitude, e.coords.latitude]);

    if ($("#date").is(".active")) {
      coloringGPSDate(gpsParcela);
    } else {
      coloringGPS(gpsParcela);
    }
    isSetOrigin = true;
  } else if (checkPosition(e) && Date.now() - lastRun >= 10000) {
    legCount = 0;
    console.log("route changed");
    let userPosition = turf.point([e.coords.longitude, e.coords.latitude]);
    directions.removeRoutes();

    let bearing = e.coords.heading;
    directions.setOrigin([e.coords.longitude, e.coords.latitude]);

    let waypoint1 = turf.destination(userPosition, 15, bearing, {
      units: "meters",
    });
    directions.addWaypoint(0, [
      waypoint1.geometry.coordinates[0],
      waypoint1.geometry.coordinates[1],
    ]);
    directions.setDestination(destinationLocation);

    lastRun = Date.now();
    isSetOrigin = true;
  } else {
    geolocate.trigger();
  }
}

// Constants
const DISTANCE_THRESHOLD = 100;
const BEARING_THRESHOLD = 90;

// Helper functions
function calculateBearing(start, end) {
  return turf.bearing(turf.point(start), turf.point(end));
}

function calculateBearingDifference(userBearing, stepBearing) {
  let difference = Math.abs(userBearing - stepBearing);
  return difference > 180 ? 360 - difference : difference;
}

// Main function
function checkPosition(e) {
  const { longitude, latitude, heading: userBearing } = e.coords;
  const userPosition = turf.point([longitude, latitude]);

  /*console.log('Leg count:', legCount);
console.log('Current leg:', poly.route[0].legs[legCount]);*/
  //if(tockeLegs.length <= (tockeIteracija + 1)){return false;}
  const step = poly.route[0].legs[legCount].steps[tockeIteracija];
  const stepLine = turf.lineString(step.geometry.coordinates);
  const distanceToStep = turf.pointToLineDistance(userPosition, stepLine, {
    units: "meters",
  });

  if (distanceToStep >= DISTANCE_THRESHOLD) {
    //console.log("User is off course");
    return true;
  }

  const [start, end] = stepLine.geometry.coordinates;
  const stepBearing = calculateBearing(start, end);
  const bearingDifference = calculateBearingDifference(
    userBearing,
    stepBearing
  );

  if (bearingDifference >= BEARING_THRESHOLD) {
    //console.log("User is off course");
    return true;
  }

  //console.log("User is on course");
  return false;
}

// Event listener for route changes
directions.on("route", function (e) {
  //console.log('Route:', e);
  poly = e;

  if (poly.route.length === 0) {
    handleNoRoute();
    return;
  }

  const route = poly.route[0];
  speed = (route.distance / route.duration) * 3.6;

  updateUIForNewRoute();
  processRouteGeometry(route);
  updateMapLayers();
});

// Helper functions for route event handler
function handleNoRoute() {
  $(".annotation.route").remove();
  $("body").addClass("message");
  const message = `
    <div class="annotation">
      <h3>${translations["Important message"][0][langFromURL]}</h3>
      <p>${translations["Routing not available"][0][langFromURL]}
      ${
    $(".profile-switch.active").attr("id") == "car"
      ? translations["Switch walking"][0][langFromURL]
      : translations["Switch driving"][0][langFromURL]
  }</p>
      <div class="annotation-buttons"><div class="confirm">${
    translations["Fine"][0][langFromURL]
  }</div></div>
    </div>
  `;
  $("body").append(message);
  $(".confirm").on("click", function () {
    $("body").removeClass("message");
    $(".annotation").remove();
  });
}

function updateUIForNewRoute() {
  $(".annotation.route").remove();
  if ($(".mapboxgl-ctrl-geolocate-background").is(":visible")) {
    $(".time-distance").hide();
  }
}

function processRouteGeometry(route) {
  // Convert route geometry to GeoJSON
  if (typeof route.geometry === "string") {
    route.geometry = polylineCustom.toGeoJSONCustom(route.geometry, 5);
  }

  // Iterate over each leg in the route
  route.legs.forEach(function (leg) {
    // Iterate over each step in the leg
    leg.steps.forEach(function (step) {
      // Convert step geometry to GeoJSON
      if (typeof step.geometry === "string") {
        step.geometry = polylineCustom.toGeoJSONCustom(step.geometry, 5);
      }

      // Compile instructions and reset voice_done flag
      step.instructions = module("v5").compile(`${lng}`, step);
      step.voice_done = 0;
    });
  });
}

function updateMapLayers() {
  tockeIteracija = 0;
  linestring =
    map.getStyle().sources.directions.data.features[2].geometry.coordinates;
  tockeLegs = poly.route[0].legs[legCount].steps;
  duzinaLegs = tockeLegs.length;

  removeExistingLayers();
  addNewLayers(linestring);
}

function removeExistingLayers() {
  const layersToRemove = ["route2-casing", "route2", "route-casing", "route"];
  const sourcesToRemove = ["route2", "route"];

  layersToRemove.forEach((layer) => {
    if (map.getLayer(layer)) map.removeLayer(layer);
  });

  sourcesToRemove.forEach((source) => {
    if (map.getSource(source)) map.removeSource(source);
  });
}

function addNewLayers(linestring) {
  const routeData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: linestring,
        },
      },
    ],
  };

  addRouteLayer("route2", routeData, "#2d5f99", "#1da1f2");
  addRouteLayer("route", routeData, "#cccccc", "#eaeaea");

  const layersToMove = ["route-casing", "route2-casing", "route", "route2"];
  layersToMove.forEach((layer) => {
    map.moveLayer(layer, "directions-origin-point");
    map.moveLayer(layer, "poi-numbers");
  });
}

function addRouteLayer(id, data, casingColor, lineColor) {
  map.addSource(id, { type: "geojson", data: data });

  map.addLayer({
    id: `${id}-casing`,
    type: "line",
    source: id,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": casingColor, "line-width": 12 },
  });

  map.addLayer({
    id: id,
    type: "line",
    source: id,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": lineColor, "line-width": 8 },
  });
}

map.addControl(directions);
}
</script>

<style scoped>
#navigateTo,
#navigateToObjekt {
  outline: none;
}

button#navigateTo span {
  line-height: 1.2;
}

button#navigateTo img {
  margin-left: 15px;
  width: 16px;
}
</style>
