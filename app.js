const addBtn = document.getElementById('addCar');
const editBtn = document.getElementById('editCar');
const deleteBtn = document.getElementById('deleteCar');
let tableContent = document.getElementById('table-content');
let brands = document.getElementById('brands');
let sortingOptions = document.getElementById('sorting-options');
const clear = document.getElementById('clear');


let htmlBrand='';
let filters= [];


const Car = function(id, brand, model, year){
    this.id = id;
    this.brand= brand;
    this.model = model;
    this.year = year;
  };
  const data = {
    cars: getCars(),
    currentcar: null
  };




//UI-----------------------------------------------------------
function deleteInHtml(id){
  const carID = `#car-${id}`;
      const car = document.querySelector(carID);
      car.remove();
}


function printCars () {
    let html = '';

      data.cars.forEach(function(car){
        if(car!== undefined){
          html += `<tr id="car-${car.id}">
        <td>${car.brand}</td>
        <td>${car.model}</td>
        <td>${car.year}</td>
        <td> <i data-bs-toggle="modal" data-bs-target="#myModal" id="car-${car.id}" class="edit-car far fa-edit fa-2x"></i>  </td>
      </tr>
        `;
        }
        
      });
      tableContent.innerHTML = html;
}




//Event listeners ---------------------------
addBtn.addEventListener('click', e => {

    let ID;
    if(data.cars.length > 0){
      ID = data.cars[data.cars.length - 1].id + 1;
    } else {
      ID = 0;
    }
    const brand= document.getElementById('brand');
    const model= document.getElementById('model');
    const year= document.getElementById('year');
    if(brand.value!=='' && model.value!=='' && year.value!=='')
    {
          newCar = new Car(ID,brand.value,model.value,year.value);
          storeCar(newCar);
    }
    
    brand.value='';
    model.value='';
    year.value='';

   location.reload();
   e.preventDefault();
  
});
// when an edit icon is clicked, sets current car, gets the id
tableContent.addEventListener('click', e =>{
  data.cars = getCars();
    if(e.target.classList.contains('edit-car')) {
        const parentID = e.target.parentNode.parentNode.id;
        const splitID = parentID.split('-');
        const id = parseInt(splitID[1]) ;

        data.cars.forEach( car => {
          if(car.id === id) {
            data.currentcar = car;
            return;
          };
        })
       
        console.log(data.currentcar);
    }
});
// after the edit btn inside modal is clicked
//updates the data in ls
editBtn.addEventListener('click', e => {
    const brandE= document.getElementById('brand-edit');
    const modelE= document.getElementById('model-edit');
    const yearE= document.getElementById('year-edit');
    if(brandE.value!=='' && modelE.value!=='' && yearE.value!=='')
    {
           const updatedCar = changeUpdated(brandE.value, modelE.value, yearE.value);
            updateCar(updatedCar);
    }
 

    brandE.value='';
    modelE.value='';
    yearE.value='';
    location.reload();
    e.preventDefault();
});
// when delete btn is clicked inside a modal
//
deleteBtn.addEventListener('click', e => {

  const IDArr = data.cars.map(function(car){
    return car.id;
  });
  const index = IDArr.indexOf(data.currentcar);
  data.cars.splice(index, 1);

  deleteInHtml(data.currentcar.id);
  deleteCar(data.currentcar.id);

  //data.cars = getCars();

  location.reload();
  e.preventDefault();
})
// when something inside a filter dropdown is clicked 
// checks if its a dropdown car and then gets the value and maps through cars
brands.addEventListener('click', e =>{
  if(e.target.classList.contains('dropdown-item')){

    const filterBrand=e.target.text;
    // if all clicked just refresh 
    if(filterBrand === 'All') location.reload();

  data.cars = getCars().map( car => {
  if(car.brand === filterBrand) return car;
 });

 printCars();
 e.preventDefault();

  }
});
// clear all just erases the storage
clear.addEventListener('click', e =>{ 
  localStorage.clear();
  location.reload();
})
//sorting listener + logic
sortingOptions.addEventListener('click', e => {
    if(e.target.classList.contains('dropdown-item')){

      const sortingOption= e.target.text;
      if(sortingOption === 'Default'){
        
        location.reload();
        
      }
      if(sortingOption === 'Brand'){

        data.cars = getCars().sort((a,b) => a.brand.localeCompare(b.brand));

      }

      if(sortingOption === 'Year(oldest to youngest)'){
        data.cars = getCars().sort( (a,b) => {
         return a.year - b.year;
         });

      }
      if(sortingOption === 'Year(youngest to oldest)'){
        data.cars = getCars().sort( (a,b) => {
          return b.year - a.year;
          });

      }

  };

 printCars();
 e.preventDefault();

 });


//Window onloads-------------------------------------------------
window.onload =printCars();
window.onload =renderFilters();






//Storage----------------------------------------
// get cars FROM storage (parsed)
function getCars(){
  let cars;
  if(localStorage.getItem('cars') === null){
    cars = [];
  } else {
    cars = JSON.parse(localStorage.getItem('cars'));
  }
  return cars;
}

// store car INTO storage
function storeCar (car) {
 
    let cars;
    if(localStorage.getItem('cars') === null){
      cars = [];
    } else {
      cars = JSON.parse(localStorage.getItem('cars'));
    }
    cars.push(car);
    localStorage.setItem('cars', JSON.stringify(cars));
  
}

// update car already in storage
function updateCar(updatedCar){
  let cars = JSON.parse(localStorage.getItem('cars'));

      cars.forEach(function(car, index){
        if(updatedCar.id === car.id){
          cars.splice(index, 1, updatedCar);
        }
      });

      localStorage.setItem('cars', JSON.stringify(cars));
}

//delete car from storage
function deleteCar (id) {
  let cars = JSON.parse(localStorage.getItem('cars'));
      
  cars.forEach(function(car, index){
    if(id === car.id){
      cars.splice(index, 1);
    }
  });

  localStorage.setItem('cars', JSON.stringify(cars));
}

//FILTERS-------------------------------------------------------
// renders available brands from local storage and displays them in UI
function renderFilters (){

  if(getCars().length>0){
    getCars().forEach( car =>{
      if(!filters.includes(car.brand)){
            htmlBrand+=`
        <li><a id="brand-${car.brand}" class="dropdown-item" href="#">${car.brand}</a></li>
        `;
        brands.innerHTML = htmlBrand;
        filters.push(car.brand);
      }
     }     
    )
    brands.innerHTML+= `<li><a class="dropdown-item" href="#">All</a></li>
    `;
  }}

// EDIT FUNCTIONS
// helper function finds current car and changes it's values, returns the changed car
  function changeUpdated(brand, model, year) {
    let changed = null;
      getCars().forEach(function(car){
          if(car.id === data.currentcar.id){
            car.brand = brand;
            car.model = model;
            car.year = year;
            changed = car;
          }
        });
        return changed;
  }