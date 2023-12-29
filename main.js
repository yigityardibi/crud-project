/* HTML Elementleri */
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//Düzenleme seçenekleri.
let editElement; //Düzenleme yapılan ögeyi temsil eder.
let editFlag = false; //Düzenleme modunda olup, olmadığını belirtir.
let editID = ""; //Benzersiz ID.

//Form gönderildiğinde addItem fonksiyonunu çağır.
form.addEventListener("submit", addItem);
// temizle düğmesine tıklanıldığında clearItems fonksiyonunu çağır
clearBtn.addEventListener("click", clearItems);
//sayfa yüklendiğinde setupıtems fonksiyonunu çağır.
window.addEventListener("DOMContentLoaded",setupItems);

//!Functions
function addItem(e) {
    e.preventDefault();
    const value = grocery.value; //Inputun giriş  değerini al.
    const id = new Date().getTime().toString();

    if(value !== "" && !editFlag){
        const element = document.createElement("article");
        let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluşturur.
        attr.value = id;
        element.classList.add("grocery-item");
        element.setAttributeNode(attr);
       // console.log(element);
       element.innerHTML = `
       <p class="title">${value}</p>
       <div class="btn-container">
         <button class="edit-btn" type="button">
           <i class="fa-solid fa-pen-to-square"></i>
         </button>
         <button class="delete-btn" type="button">
           <i class="fa-solid fa-trash"></i>
         </button>
       </div>
       `;

       const deleteBtn = element.querySelector(".delete-btn");
       deleteBtn.addEventListener("click",deleteItem)

       const editBtn = element.querySelector(".edit-btn")
       editBtn.addEventListener("click", editItem)

       list.appendChild(element);
       //Alert
       displayAlert("Başarıyla Eklendi","success");
       //Show Container
       container.classList.add("show-container");
       //LocalStorage'a Ekleme
       addToLocalStorage(id,value);
       // içeriği temizleme
       setBackToDefault();
    }else if(value !== "" && editFlag){
      editElement.innerHTML = value;
      displayAlert("Değer değiştirildi", "success");
      setBackToDefault();
    }else{
      displayAlert("Lütfen bir değer giriniz.","danger");
    }
}

//Alert Function
function displayAlert(text,action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    console.log(alert);
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 2000);
}

//Clear
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
//DeleteItem
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
//  console.log(element);
const id = element.dataset.id;

list.removeChild(element);

if(list.children.length == 0){
  container.classList.remove("show-container");
}
displayAlert("Eleman kaldırıldı", "danger");
}
//Düzenleme Fonksiyonu
function editItem(e){
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //console.log(editElement);
  // form değeri düzenlenen ögenin metniyle doldur
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id; // düzenlenen elementin kimliği
  submitBtn.textContent = "edit";
}
// listeyi temizleme
function clearItems(){
  const items = document.querySelectorAll(".grocery-item");
  if(items.length > 0){
    items.forEach(function(item){
      list.removeChild(item); //her ögeyi listeden kaldırır
    })
  }
  container.classList.remove("show-container");
  displayAlert("Liste temizlendi", "danger");
  setBackToDefault();
}

//Yerel Depoya öge ekleme.
function addToLocalStorage(id,value){
    const grocery = {id,value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
}

//Local storagedan verileri alma işlemi
function getLocalStorage(){
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function setupItems(){
  let items = getLocalStorage();
}