// Import required modules
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Dynamically import fetch for use in Node.js
const fs = require('fs'); // Module for file system operations
const path = require('path'); // Module for handling file paths

// Define the API key for accessing the OpenCageData API
const apiKey = process.env.OpenCageData_API;

// Define a list of cities, states, and corresponding aquarium names to fetch geolocation for
const cities = [
  { city: 'Dauphin Island', state: 'Alabama', aquarium: 'Alabama Aquarium at Dauphin Island Sea Lab' },
  { city: 'Decatur', state: 'Alabama', aquarium: 'Cook Museum of Natural Science' },
  { city: 'Seward', state: 'Alaska', aquarium: 'Alaska SeaLife Center' },
  { city: 'Sitka', state: 'Alaska', aquarium: 'Sitka Sound Science Center' },
  { city: 'Scottsdale', state: 'Arizona', aquarium: 'OdySea Aquarium' },
  { city: 'Tempe', state: 'Arizona', aquarium: 'Sea Life Arizona' },
  { city: 'San Francisco', state: 'California', aquarium: 'Aquarium of the Bay' },
  { city: 'Long Beach', state: 'California', aquarium: 'Aquarium of the Pacific' },
  { city: 'La Jolla', state: 'California', aquarium: 'Birch Aquarium' },
  { city: 'San Pedro', state: 'California', aquarium: 'Cabrillo Marine Aquarium' },
  { city: 'Los Angeles', state: 'California', aquarium: 'California Science Center' },
  { city: 'Avila Beach', state: 'California', aquarium: 'Central Coast Aquarium' },
  { city: 'Santa Monica', state: 'California', aquarium: 'Heal the Bay Aquarium' },
  { city: 'Monterey', state: 'California', aquarium: 'Monterey Bay Aquarium' },
  { city: 'Crescent City', state: 'California', aquarium: 'Ocean World' },
  { city: 'Manhattan Beach', state: 'California', aquarium: 'Roundhouse Aquarium' },
  { city: 'Santa Barbara', state: 'California', aquarium: 'Santa Barbara Museum of Natural History Sea Center' },
  { city: 'Carlsbad', state: 'California', aquarium: 'Sea Life Aquarium at Legoland California' },
  { city: 'Folsom', state: 'California', aquarium: 'SeaQuest Folsom' },
  { city: 'San Diego', state: 'California', aquarium: 'SeaWorld San Diego' },
  { city: 'Santa Cruz', state: 'California', aquarium: 'Seymour Marine Discovery Center' },
  { city: 'San Francisco', state: 'California', aquarium: 'Steinhart Aquarium (California Academy of Sciences)' },
  { city: 'Denver', state: 'Colorado', aquarium: 'Downtown Aquarium' },
  { city: 'Littleton', state: 'Colorado', aquarium: 'SeaQuest Littleton' },
  { city: 'Norwalk', state: 'Connecticut', aquarium: 'Maritime Aquarium at Norwalk' },
  { city: 'Mystic', state: 'Connecticut', aquarium: 'Mystic Aquarium' },
  { city: 'Trumbull', state: 'Connecticut', aquarium: 'SeaQuest Trumbull' },
  { city: 'Clearwater', state: 'Florida', aquarium: 'Clearwater Marine Aquarium' },
  { city: 'Grassy Key', state: 'Florida', aquarium: 'Dolphin Research Center' },
  { city: 'Tampa', state: 'Florida', aquarium: 'Florida Aquarium' },
  { city: 'Marathon', state: 'Florida', aquarium: 'Florida Keys Aquarium Encounters' },
  { city: 'Panacea', state: 'Florida', aquarium: 'Gulf Specimen Marine Laboratory, Inc' },
  { city: 'Fort Walton Beach', state: 'Florida', aquarium: 'Gulfarium Marine Adventure Park' },
  { city: 'Panama City Beach', state: 'Florida', aquarium: 'Gulf World Marine Park' },
  { city: 'Key West', state: 'Florida', aquarium: 'Key West Aquarium' },
  { city: 'Marineland', state: 'Florida', aquarium: 'Marineland Dolphin Adventure' },
  { city: 'Miami', state: 'Florida', aquarium: 'Miami Seaquarium' },
  { city: 'Sarasota', state: 'Florida', aquarium: 'Mote Marine Laboratory & Aquarium' },
  { city: 'Orlando', state: 'Florida', aquarium: 'SEA LIFE Orlando Aquarium' },
  { city: 'Orlando', state: 'Florida', aquarium: 'SeaWorld Orlando' },
  { city: 'Tampa', state: 'Florida', aquarium: 'The Florida Aquarium' },
  { city: 'Key Largo', state: 'Florida', aquarium: 'Island Dolphin Care' },
  { city: 'Jupiter', state: 'Florida', aquarium: 'Loggerhead Marinelife Center' },
  { city: 'Juniper', state: 'Florida', aquarium: 'The Seas with Nemo & Friends' },
  { city: 'Fort Pierce', state: 'Florida', aquarium: 'Smithsonian Marine Station at Fort Pierce' },
  { city: 'Marathon', state: 'Florida', aquarium: 'Turtle Hospital' },
  { city: 'Tarpon Springs', state: 'Florida', aquarium: 'Tarpon Springs Aquarium' },
  { city: 'St. Augustine', state: 'Florida', aquarium: 'St. Augustine Aquarium' },
  { city: 'Fort Myers', state: 'Florida', aquarium: 'Ostego Bay Marine Science Center' },
  { city: 'Albany', state: 'Georgia', aquarium: 'Flint RiverQuarium' },
  { city: 'Atlanta', state: 'Georgia', aquarium: 'Georgia Aquarium' },
  { city: 'Maui', state: 'Hawaii', aquarium: 'Maui Ocean Center' },
  { city: 'Honolulu', state: 'Hawaii', aquarium: 'Sea Life Park Hawaii' },
  { city: 'Honolulu', state: 'Hawaii', aquarium: 'Waikiki Aquarium' },
  { city: 'Boise', state: 'Idaho', aquarium: 'Aquarium of Boise' },
  { city: 'Idaho Falls', state: 'Idaho', aquarium: 'East Idaho Aquarium' },
  { city: 'Chicago', state: 'Illinois', aquarium: 'Shedd Aquarium' },
  { city: 'Dubuque', state: 'Iowa', aquarium: 'National Mississippi River Museum & Aquarium' },
  { city: 'Newport', state: 'Kentucky', aquarium: 'Newport Aquarium' },
  { city: 'New Orleans', state: 'Louisiana', aquarium: 'Audubon Aquarium of the Americas' },
  { city: 'Natchitoches', state: 'Louisiana', aquarium: 'Natchitoches National Fish Hatchery and Aquarium' },
  { city: 'Shreveport', state: 'Louisiana', aquarium: 'Shreveport Aquarium' },
  { city: 'Bar Harbor', state: 'Maine', aquarium: 'Mount Desert Oceanarium' },
  { city: 'Boothbay Harbor', state: 'Maine', aquarium: 'Maine State Aquarium' },
  { city: 'Portland', state: 'Maine', aquarium: 'Gulf of Maine Research Institute' },
  { city: 'Baltimore', state: 'Maryland', aquarium: 'National Aquarium' },
  { city: 'Solomons', state: 'Maryland', aquarium: 'Calvert Marine Museum' },
  { city: 'Ocean City', state: 'Maryland', aquarium: 'Ocean City Life-Saving Station Museum' },
  { city: 'Glen Echo', state: 'Maryland', aquarium: 'Glen Echo Park Aquarium' },
  { city: 'Boston', state: 'Massachusetts', aquarium: 'New England Aquarium' },
  { city: 'Woods Hole', state: 'Massachusetts', aquarium: 'Woods Hole Science Aquarium' },
  { city: 'Pittsfield', state: 'Massachusetts', aquarium: 'Berkshire Museum Aquarium' },
  { city: 'Quincy', state: 'Massachusetts', aquarium: 'Aquarium of the National Marine Fisheries' },
  { city: 'Nantucket', state: 'Massachusetts', aquarium: 'Maria Mitchell Association Aquarium' },
  { city: 'Detroit', state: 'Michigan', aquarium: 'Belle Isle Aquarium' },
  { city: 'Grand Rapids', state: 'Michigan', aquarium: 'John Ball Zoo' }, // Note: John Ball Zoo includes an aquarium as part of its exhibits.
  { city: 'Auburn Hills', state: 'Michigan', aquarium: 'Michigan Sea Life Aquarium' },
  { city: 'Duluth', state: 'Minnesota', aquarium: 'Great Lakes Aquarium' },
  { city: 'Bloomington', state: 'Minnesota', aquarium: 'SEA LIFE Minnesota Aquarium' },
  { city: 'Apple Valley', state: 'Minnesota', aquarium: 'Minnesota Zoo' }, // Note: Contains an aquarium section known as Discovery Bay.
  { city: 'Rochester', state: 'Minnesota', aquarium: "Minnesota Children's Museum Rochester" }, // Note: May have aquatic exhibits; traditionally not an aquarium.
  { city: 'Gulfport', state: 'Mississippi', aquarium: 'Institute for Marine Mammal Studies' },
  { city: 'Gulfport', state: 'Mississippi', aquarium: 'Mississippi Aquarium' },
  { city: 'Jackson', state: 'Mississippi', aquarium: 'Mississippi Museum of Natural Science' },
  { city: 'Gulfport', state: 'Mississippi', aquarium: 'Ocean Adventures Marine Park' },
  { city: 'Branson', state: 'Missouri', aquarium: 'Aquarium at the Boardwalk' },
  { city: 'Kansas City', state: 'Missouri', aquarium: 'Sea Life Kansas City' },
  { city: 'St. Louis', state: 'Missouri', aquarium: 'St. Louis Aquarium at Union Station' },
  { city: 'St. Louis', state: 'Missouri', aquarium: 'World Aquarium' },
  { city: 'Springfield', state: 'Missouri', aquarium: 'Wonders of Wildlife National Museum & Aquarium' },
  { city: 'Omaha', state: 'Nebraska', aquarium: "Omaha's Henry Doorly Zoo and Aquarium" },
  { city: 'Ashland', state: 'Nebraska', aquarium: 'Schramm Education Center' },
  { city: 'Las Vegas', state: 'Nevada', aquarium: 'Shark Reef at Mandalay Bay' },
  { city: 'Las Vegas', state: 'Nevada', aquarium: 'The Aquarium at the Silverton' },
  { city: 'Las Vegas', state: 'Nevada', aquarium: 'SeaQuest Las Vegas' },
  { city: 'Camden', state: 'New Jersey', aquarium: 'Adventure Aquarium' },
  { city: 'Atlantic City', state: 'New Jersey', aquarium: 'Atlantic City Aquarium' },
  { city: 'Point Pleasant Beach', state: 'New Jersey', aquarium: "Jenkinson's Aquarium" },
  { city: 'Brigantine', state: 'New Jersey', aquarium: 'Marine Mammal Stranding Center' },
  { city: 'West Orange', state: 'New Jersey', aquarium: 'Turtle Back Zoo' },
  { city: 'Paramus', state: 'New Jersey', aquarium: 'Bergen County Zoo' },
  { city: 'Cape May', state: 'New Jersey', aquarium: 'Cape May County Park & Zoo' },
  { city: 'Albuquerque', state: 'New Mexico', aquarium: 'ABQ BioPark Aquarium' },
  { city: 'Brooklyn', state: 'New York', aquarium: 'New York Aquarium' },
  { city: 'Riverhead', state: 'New York', aquarium: 'Long Island Aquarium' },
  { city: 'Niagara Falls', state: 'New York', aquarium: 'Aquarium of Niagara' },
  { city: 'Utica', state: 'New York', aquarium: 'Utica Zoo' },
  { city: 'Buffalo', state: 'New York', aquarium: 'Buffalo Zoo' },
  { city: 'Kure Beach', state: 'North Carolina', aquarium: 'North Carolina Aquarium at Fort Fisher' },
  { city: 'Pine Knoll Shores', state: 'North Carolina', aquarium: 'North Carolina Aquarium at Pine Knoll Shores' },
  { city: 'Manteo', state: 'North Carolina', aquarium: 'North Carolina Aquarium on Roanoke Island' },
  { city: 'Charlotte', state: 'North Carolina', aquarium: 'SEA LIFE Charlotte-Concord' },
  { city: 'Greensboro', state: 'North Carolina', aquarium: 'SciQuarium at the Greensboro Science Center' },
  { city: 'Hendersonville', state: 'North Carolina', aquarium: 'Team ECCO Aquarium & Shark Lab' },
  { city: 'Raleigh', state: 'North Carolina', aquarium: 'North Carolina Museum of Natural Sciences' },
  { city: 'Cleveland', state: 'Ohio', aquarium: 'Greater Cleveland Aquarium' },
  { city: 'Cincinnati', state: 'Ohio', aquarium: 'Cincinnati Zoo & Botanical Garden' },
  { city: 'Columbus', state: 'Ohio', aquarium: 'Columbus Zoo and Aquarium' },
  { city: 'Jenks', state: 'Oklahoma', aquarium: 'Oklahoma Aquarium' },
  { city: 'Tulsa', state: 'Oklahoma', aquarium: 'Tulsa Zoo' },
  { city: 'Newport', state: 'Oregon', aquarium: 'Oregon Coast Aquarium' },
  { city: 'Portland', state: 'Oregon', aquarium: 'Oregon Zoo' },
  { city: 'Seaside', state: 'Oregon', aquarium: 'Seaside Aquarium' },
  { city: 'Charleston', state: 'Oregon', aquarium: 'Charleston Marine Life Center' },
  { city: 'Philadelphia', state: 'Pennsylvania', aquarium: 'Adventure Aquarium' },
  { city: 'Pittsburgh', state: 'Pennsylvania', aquarium: 'Pittsburgh Zoo & PPG Aquarium' },
  { city: 'Newport', state: 'Rhode Island', aquarium: 'Save The Bay Exploration Center and Aquarium' },
  { city: 'North Kingstown', state: 'Rhode Island', aquarium: 'Biomes Marine Biology Center' },
  { city: 'Charleston', state: 'South Carolina', aquarium: 'South Carolina Aquarium' },
  { city: 'Myrtle Beach', state: 'South Carolina', aquarium: "Ripley's Aquarium of Myrtle Beach" },
  { city: 'Sioux Falls', state: 'South Dakota', aquarium: 'Butterfly House & Aquarium' },
  { city: 'Yankton', state: 'South Dakota', aquarium: 'Gavins Point National Fish Hatchery' },
  { city: 'Rapid City', state: 'South Dakota', aquarium: 'The Outdoor Campus-West' },
  { city: 'Gatlinburg', state: 'Tennessee', aquarium: "Ripley's Aquarium of the Smokies" },
  { city: 'Memphis', state: 'Tennessee', aquarium: 'Memphis Zoo Aquarium' },
  { city: 'Nashville', state: 'Tennessee', aquarium: 'Nashville Zoo at Grassmere' },
  { city: 'Chattanooga', state: 'Tennessee', aquarium: 'Tennessee Aquarium' },
  { city: 'Chattanooga', state: 'Tennessee', aquarium: 'Tennessee Aquarium Conservation Institute' },
  { city: 'Austin', state: 'Texas', aquarium: 'Austin Aquarium' },
  { city: 'Corpus Christi', state: 'Texas', aquarium: 'Texas State Aquarium' },
  { city: 'Dallas', state: 'Texas', aquarium: 'Dallas World Aquarium' },
  { city: 'Fort Worth', state: 'Texas', aquarium: 'SeaQuest Fort Worth' },
  { city: 'Galveston', state: 'Texas', aquarium: 'Moody Gardens Aquarium Pyramid' },
  { city: 'Grapevine', state: 'Texas', aquarium: 'SEA LIFE Grapevine Aquarium' },
  { city: 'Houston', state: 'Texas', aquarium: 'Downtown Aquarium, Houston' },
  { city: 'Kemah', state: 'Texas', aquarium: 'Aquarium Restaurant, Kemah' },
  { city: 'San Antonio', state: 'Texas', aquarium: 'San Antonio Aquarium' },
  { city: 'El Paso', state: 'Texas', aquarium: 'El Paso Zoo' },
  { city: 'Houston', state: 'Texas', aquarium: 'Houston Zoo' },
  { city: 'San Antonio', state: 'Texas', aquarium: 'San Antonio Zoo' },
  { city: 'Waco', state: 'Texas', aquarium: 'Cameron Park Zoo' },
  { city: 'Brownsville', state: 'Texas', aquarium: 'Gladys Porter Zoo' },
  { city: 'Spring', state: 'Texas', aquarium: "The Woodlands Children's Museum" },
  { city: 'Port Arthur', state: 'Texas', aquarium: 'Texas Artists Museum' },
  { city: 'Draper', state: 'Utah', aquarium: 'Loveland Living Planet Aquarium' },
  { city: 'Burlington', state: 'Vermont', aquarium: 'ECHO, Leahy Center for Lake Champlain' },
  { city: 'Virginia Beach', state: 'Virginia', aquarium: 'Virginia Aquarium & Marine Science Center' },
  { city: 'Newport News', state: 'Virginia', aquarium: 'Virginia Living Museum' },
  { city: 'Seattle', state: 'Washington', aquarium: 'Seattle Aquarium' },
  { city: 'Tacoma', state: 'Washington', aquarium: 'Point Defiance Zoo & Aquarium' },
  { city: 'Des Moines', state: 'Washington', aquarium: 'MaST Center Aquarium' },
  { city: 'Bellingham', state: 'Washington', aquarium: 'Marine Life Center' },
  { city: 'Port Townsend', state: 'Washington', aquarium: 'Port Townsend Marine Science Center' },
  { city: 'Friday Harbor', state: 'Washington', aquarium: 'The Whale Museum' }, // While primarily focused on whales, it offers significant marine education.
  { city: 'Olympia', state: 'Washington', aquarium: 'Puget Sound Estuarium' },
  { city: 'Anacortes', state: 'Washington', aquarium: 'Padilla Bay National Estuarine Research Reserve' }, // Offers educational exhibits on marine life in estuaries.
  { city: 'Wisconsin Dells', state: 'Wisconsin', aquarium: 'Timbavati Wildlife Park' }, // Offers an aquarium section within the wildlife park.
  { city: 'Milwaukee', state: 'Wisconsin', aquarium: 'Discovery World' }, // Features an aquarium as part of its science and technology center.
];

// Asynchronously fetch geolocation data for a given city, state, and aquarium
async function getGeoInfo(city, state, aquarium, apiKey) {
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city + ', ' + state)}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl); // Fetch the geolocation data
    const data = await response.json(); // Parse the JSON response
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry; // Extract latitude and longitude
      return { city, state, aquarium, latitude: lat, longitude: lng };
    } else {
      console.log(`No results found for ${city}, ${state}`); // Log if no results found
      return null;
    }
  } catch (error) {
    console.error(`Error fetching geocode for ${city}, ${state}:`, error); // Log any errors
    return null;
  }
}

// Build a list of geolocation information for all cities
async function buildGeoInfoList(cities, apiKey) {
  const geoInfoList = [];
  for (const { city, state, aquarium } of cities) {
    const geoInfo = await getGeoInfo(city, state, aquarium, apiKey); // Fetch geolocation for each entry
    if (geoInfo) {
      geoInfoList.push(geoInfo); // Add the geolocation info to the list
    }
  }
  return geoInfoList;
}

// Save the geolocation information to a JavaScript file
async function saveToJavaScriptFile(data, filename) {
  const filePath = path.join(__dirname, filename); // Determine the file path
  const dataToSave = `module.exports = ${JSON.stringify(data, null, 2)};`; // Format the data as a module export
  fs.writeFile(filePath, dataToSave, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred:', err); // Log any file writing errors
    } else {
      console.log(`File saved successfully to ${filePath}`); // Confirm successful save
    }
  });
}

// Execute the process: Build geolocation list and save it
buildGeoInfoList(cities, apiKey).then((geoInfoList) => {
  saveToJavaScriptFile(geoInfoList, 'cities.js'); // Save the list to 'cities.js'
});
