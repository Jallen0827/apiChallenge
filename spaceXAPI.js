const baseURL = 'https://api.spacexdata.com/v3/launches/';
const selection = document.getElementsByTagName('select');
const row = document.querySelector('.row');

let selectTerm = document.querySelector('.rockets');

addEventListener('onchange', fetchResults);

function dropDown(){
    fetch(baseURL).then(function(results){
        return results.json();
    }).then(function(json){        
        populateSelect(json);
    })
};

function populateSelect(json){
    let launchSite = [];
    for (i=0; i<json.length; i++){    
        let current = json[i];
        if (current.links.flickr_images.length>0){
            
            launchSite.push(json[i].launch_site.site_name);
        }        
    }

    let unique = launchSite.filter((v, i, a) => a.indexOf(v) === i);

    let option = document.createElement('option');

    unique.forEach(element =>{
        let option = document.createElement('option');
        option.value = element;
        option.innerText = element;
        selectTerm.appendChild(option);
    })
    
}

function fetchResults(e){
    e.preventDefault();
    
    fetch(baseURL).then(function(results){
        return results.json();
    }).then(function(json){
        // console.log(json);
        displayResults(json);
    })
}

function changedValue(){
    fetch(baseURL).then(function(results){
        return results.json();
    }).then(function(json){
        // console.log(json);
        displayResults(json);
    })
}

function displayResults(json){
    while (row.firstChild){
        row.removeChild(row.firstChild);
    }  

    for (i=0; i<json.length; i++){ 

        current = json[i]; 

        if (json[i].launch_site.site_name === selectTerm.value){

            if (current.links.flickr_images.length>0){

                let col = document.createElement('div');
                let card = document.createElement('div');
                let overlay = document.createElement('div');
                let text = document.createElement('div');
                let paraRocketName = document.createElement('h2');
                let paraPayloadKg = document.createElement('p');
                let paraPayloadLb = document.createElement('p');
                let img = document.createElement('img');
                
                let rocketName = current.rocket.rocket_name;
                let payloadMassKg = current.rocket.second_stage.payloads[0].payload_mass_kg;
                let payloadMassLb = current.rocket.second_stage.payloads[0].payload_mass_lbs;

                overlayClassName = `overlay${i}`;
                overlay.setAttribute("class", "overlay");
                overlay.setAttribute("onmouseover", "overlayVisible(this)");
                overlay.setAttribute("onmouseout", "overlayHidden(this)");
                overlay.style.position = 'absolute';
                overlay.style.height = '100%';
                overlay.style.width = '100%';
                overlay.style.opacity = '0';
                overlay.style.transition = '.1s ease';
                overlay.style.backgroundColor = '#b8c6db';
                overlay.style.backgroundImage = 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)';
                

                paraRocketName.innerText = rocketName;
                paraPayloadKg.innerText = `Payload Mass: ${payloadMassKg} kg`;
                paraPayloadLb.innerText = `Payload Mass: ${payloadMassLb} Freedom Units`;

                col.className = 'col-md-4';
                card.className = 'card mb-4 shadow-sm';

                img.src = current.links.flickr_images[0];
                img.className = 'bd-placeholder-img card-img-top';

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

function overlayVisible(x){
    x.style.opacity = 1;
}

function overlayHidden(x){
    x.style.opacity = 0;
}