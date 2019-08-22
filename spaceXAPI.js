// Setting up constants that will be used later
const baseURL = 'https://api.spacexdata.com/v3/launches/';
const row = document.querySelector('.row');
let selectTerm = document.querySelector('.rockets');

addEventListener('onchange', fetchResults); //Event listener for when select option is toggled

function fetchDropDownData(){ //Function will get json data on page load to populate launch sites in dropdown
    fetch(baseURL).then(function(results){
        return results.json();
    }).then(function(json){        
        populateDropDown(json); //calls populateDropDown function
    })
};

function populateDropDown(json){ //Populate dropdown with launch sites
    let launchSite = []; //empty array to store sites for each launch
    for (i=0; i<json.length; i++){    
        let current = json[i];
        if (current.links.flickr_images.length>0){ //filters out any launch that doesn't have image
            
            launchSite.push(json[i].launch_site.site_name); //adds site to launchsite array
        }        
    }

    let unique = launchSite.filter((v, i, a) => a.indexOf(v) === i); //returns only unique launch site values

    unique.forEach(element =>{ //loops through each unique launch site and adds option to dropdown menu
        let option = document.createElement('option');
        option.value = element;
        option.innerText = element;
        selectTerm.appendChild(option);
    })
    
}

function fetchResults(e){ //fetches json data again from api when option from drop is selected
    e.preventDefault();
    
    fetch(baseURL).then(function(results){
        return results.json();
    }).then(function(json){
        // console.log(json);
        displayResults(json); // calls display results function
    })
}

function changedValue(){ //fetches data when a new option is selected from dropdown
    fetch(baseURL).then(function(results){
        return results.json();
    }).then(function(json){
        // console.log(json);
        displayResults(json);
    })
}

function displayResults(json){ //This function is responsible for displaying everything on the page
    while (row.firstChild){ //Removes images before populating results section in html
        row.removeChild(row.firstChild); 
    }
    // console.log(selectTerm.value);
    initMap(selectTerm.value); //call to google map api to update map location

    for (i=0; i<json.length; i++){ //looping through each launch 

        current = json[i]; 

        if (json[i].launch_site.site_name === selectTerm.value){ //Checks if launch site matches selected dropdown value

            if (current.links.flickr_images.length>0){ //Checks for only launches with images
                //Creating all elements to populate page
                let col = document.createElement('div');
                let card = document.createElement('div');
                let overlay = document.createElement('div');
                let text = document.createElement('div');
                let paraRocketName = document.createElement('h2');
                let paraPayloadKg = document.createElement('p');
                let paraPayloadLb = document.createElement('p');
                let img = document.createElement('img');
                
                //Collecting data about launches
                let rocketName = current.rocket.rocket_name;
                let payloadMassKg = current.rocket.second_stage.payloads[0].payload_mass_kg;
                let payloadMassLb = current.rocket.second_stage.payloads[0].payload_mass_lbs;

                //Setting up overlay class to allow for mouseover feature
                overlay.setAttribute("class", "overlay");
                overlay.setAttribute("onmouseover", "overlayVisible(this)");
                overlay.setAttribute("onmouseout", "overlayHidden(this)");
                overlay.style.position = 'absolute';
                overlay.style.height = '100%';
                overlay.style.width = '100%';
                overlay.style.opacity = '0';
                overlay.style.transition = '.1s ease';
                overlay.style.backgroundColor = ' #48dbfb';
                overlay.style.backgroundImage = 'linear-gradient(315deg, #48dbfb 0%, #d3d3d3 74%)';
                
                //Assigning data that will show up when image is hovered over
                paraRocketName.innerText = rocketName;
                paraPayloadKg.innerText = `Payload Mass: ${payloadMassKg} kg`;
                paraPayloadLb.innerText = `Payload Mass: ${payloadMassLb} Freedom Units`;

                //Assigning class names for bootstrap components 
                col.className = 'col-md-4';
                card.className = 'card mb-4 shadow-sm';

                //Setting up image content
                img.src = current.links.flickr_images[0];
                img.className = 'bd-placeholder-img card-img-top';

                //Updating each element to display correctly
                overlay.appendChild(paraRocketName);
                overlay.appendChild(paraPayloadKg);
                overlay.appendChild(paraPayloadLb);    
                card.appendChild(img);
                card.appendChild(overlay);            
                col.appendChild(card);  
                row.appendChild(col);
            }
        }
    }
}

function overlayVisible(x){ //mouseover opacity
    x.style.opacity = 1;
}

function overlayHidden(x){ //mouseout opacity
    x.style.opacity = 0;
}


//Google Maps setup

let map;
let uluru;
let marker;

function initMap(selected) {
    console.log(selected);
    if(selected === 'VAFB SLC 4E'){
         uluru = {lat: 34.5590053, lng: -120.5451795};
         map = new google.maps.Map(
            document.getElementById('map'), {zoom: 10, center: uluru});
         marker = new google.maps.Marker({position: uluru, map: map});
    }else if (selected === 'CCAFS SLC 40'){
         uluru = {lat:28.396837, lng:-80.605659};
         map = new google.maps.Map(
            document.getElementById('map'), {zoom: 10, center: uluru});
         marker = new google.maps.Marker({position: uluru, map: map});
    }else if (selected === 'KSC LC 39A'){
         uluru = {lat:28.5728722, lng:-80.6489808};
         map = new google.maps.Map(
            document.getElementById('map'), {zoom: 10, center: uluru});
         marker = new google.maps.Marker({position: uluru, map: map});    
         }else{
            uluru = {lat:39.966760, lng:-86.008640}; //Eleven Fifty lat/long...
            map = new google.maps.Map(
               document.getElementById('map'), {zoom: 10, center: uluru});
            marker = new google.maps.Marker({position: uluru, map: map});
        }
    }





