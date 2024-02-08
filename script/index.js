function showAvailableServices(services){
  let servicesContainer = document.getElementById('services-container');
  services.map((element)=>{
    let card = createServiceCard(element);
    console.log(card)
    servicesContainer.appendChild(card)
  })
}

function createServiceCard(service){
  console.log(service)
  const card = document.createElement('div');
  card.classList.add('service-card');
  card.classList.add('card');

  const title = document.createElement('h2')
  title.classList.add('service-title');
  card.classList.add('card-title');
  title.textContent = service.name;
  
  const description = document.createElement('h2')
  description.classList.add('service-description');
  card.classList.add('card-text');
  description.textContent = service.description;
  
  const cost = document.createElement('h4')
  cost.classList.add('service-cost');
  cost.textContent = service.cost;

  card.appendChild(title)
  card.appendChild(description)
  card.appendChild(cost)
  return card;
}

document.addEventListener('DOMContentLoaded',async (e)=>{
  const services = JSON.parse(localStorage.getItem('services')) || [];
  if(services.length === 0){
    const services = await fetchServices();
    localStorage.setItem('services',JSON.stringify(services));
    showAvailableServices(services);
  }else{
    showAvailableServices(services);
  }
})

async function fetchServices(){
  const res = await fetch('../data/services.json');
  const data = await res.json()
  return data;
}