document.addEventListener('DOMContentLoaded', getAll)

const dodajBtn = document.getElementById('dodajBtn');
const izmeniBtn = document.getElementById('izmeniBtn');
const dodajForm = document.getElementById('dodajForm');
const izmeniForm = document.getElementById('izmeniForm');

let submitBtn = document.querySelector("#submitBtn")
submitBtn.addEventListener("click", function() {
  postNew(false, null, null)
})



let korisniciPoId = {};

// Prikazivanje forme za dodavanje
dodajBtn.addEventListener('click', () => {
    dodajForm.classList.remove('hidden'); // Prikazuje formu za dodavanje
    izmeniForm.classList.add('hidden'); // Sakriva formu za izmenu
});

// Prikazivanje forme za izmenu
izmeniBtn.addEventListener('click', () => {
    izmeniForm.classList.remove('hidden'); // Prikazuje formu za izmenu
    dodajForm.classList.add('hidden'); // Sakriva formu za dodavanje
});

document.addEventListener('DOMContentLoaded', () => {
    const dodajForm = document.getElementById('dodajForm');
    const izmeniForm = document.getElementById('izmeniForm');

    if (dodajForm) dodajForm.classList.add('hidden');
    if (izmeniForm) izmeniForm.classList.add('hidden');
})

function ispisiUsers(nizUsera) {
    let tabela = document.querySelector('#korisniciBody')
    tabela.innerHTML = ''; // Čisti prethodne redove

    for (let korisnik of nizUsera) {
        let noviRed = korisniciBody.insertRow();
        korisniciPoId[korisnik.id] = korisnik;

        
        // ID (readonly)
        let idCell = noviRed.insertCell();
        idCell.textContent = korisnik.id;

        // Korisnicko Ime (Editable)
        let korisnickoImeCell = noviRed.insertCell()
        let korisnickoImeInput = document.createElement('input')
        korisnickoImeInput.type = "text";
        korisnickoImeInput.value = korisnik.korisnickoIme;
        korisnickoImeCell.appendChild(korisnickoImeInput)

        // Ime (editable)
        let imeCell = noviRed.insertCell();
        let imeInput = document.createElement('input');
        imeInput.type = 'text';
        imeInput.value = korisnik.ime;
        imeCell.appendChild(imeInput);

        // Prezime (editable)
        let prezimeCell = noviRed.insertCell();
        let prezimeInput = document.createElement('input');
        prezimeInput.type = 'text';
        prezimeInput.value = korisnik.prezime;
        prezimeCell.appendChild(prezimeInput);

        // Datum Rodjenja (editable)
        let datumCell = noviRed.insertCell();
        let datumInput = document.createElement('input');
        datumInput.type = 'date';
        datumInput.value = korisnik.datumRodjenja;
        datumCell.appendChild(datumInput);

        let izmeniCell = noviRed.insertCell();
        let izmeniBtn = document.createElement('button');
        izmeniBtn.textContent = 'Izmeni';
        izmeniBtn.style.width = '190px'
        izmeniBtn.style.height = '50px'
        izmeniBtn.style.borderRadius = '5px'
        izmeniBtn.style.backgroundColor = '#0056b3'
        izmeniCell.appendChild(izmeniBtn);

        izmeniBtn.addEventListener('click', (event) => {
            const red = event.target.closest('tr');
            let indexZaIzmenu = red.cells[0].textContent;
            let korisnickoImeData = red.cells[1].querySelector("input").value;
            let imeData = red.cells[2].querySelector("input").value
            let prezimeData = red.cells[3].querySelector("input").value

            let datumRodjenjaInput = red.cells[4].querySelector("input").value;
            let datumRodjenja ;

            if (datumRodjenjaInput) {
                  datumRodjenja = new Date(datumRodjenjaInput); // Koristi uneti datum
            } else {
                  datumRodjenja = new Date(korisniciPoId[indexZaIzmenu].datumRodjenja); // Postavlja trenutni datum ako je polje prazno
            } // Pretvara string u Date objekat
            const godina = datumRodjenja.getFullYear(); // Dobija punu godinu
            const mesec = String(datumRodjenja.getMonth() + 1).padStart(2, '0'); // Meseci su 0-indeksirani, pa dodajemo 1
            const dan = String(datumRodjenja.getDate()).padStart(2, '0'); // Dodaje 0 ispred jednocifrenih dana
            const formatiranDatum = `${godina}-${mesec}-${dan}`; // Formatira datum u yyyy-MM-dd
            
            if (indexZaIzmenu !== -1) {
                const putData = {
                     id:indexZaIzmenu,
                     korisnickoIme: korisnickoImeData,
                     ime: imeData,
                     prezime: prezimeData,
                     datumRodjenja: formatiranDatum,
                }
                
                postNew(true,indexZaIzmenu ,putData);
            }
        });
        
    }
}


function getAll() {
    fetch('http://localhost:21271/api/users') // Pravi GET zahtev da dobavi sve usere sa servera
      .then(response => {
        if (!response.ok) {
          // Ako se vrati statusni kod koji nije iz 2xx, tretiraj kao grešku
          throw new Error('Request failed. Status: ' + response.status)
        }
        return response.json()
      })
      .then(users =>  {
        nizUsera = users; // Postavlja dobijene korisnike u globalni niz
        ispisiUsers(users); // Prikazuje korisnike u tabeli
        })  // Ako su podaci ispravni, prikaži ih u HTMLu
      .catch(error => {                  // Ako podaci nisu ispravni, sakrij tabelu i prikaži poruku o grešci
        console.error('Error:', error.message)
        // Sakrij tabelu
        let table = document.querySelector('table')
        if (table) {
          table.style.display = 'none'
        }
        // Prikaži poruku o grešci
        alert('An error occurred while loading the data. Please try again.')
      })
  }

function postNew(isUpdate = false, userId = null, jsonData = null){
  const form = document.querySelector('#dodajForm')
  const formData = new FormData(form)

    const datumRodjenja = new Date(formData.get('datumRodjenja')); // Pretvara string u Date objekat
    const godina = datumRodjenja.getFullYear(); // Dobija punu godinu
    const mesec = String(datumRodjenja.getMonth() + 1).padStart(2, '0'); // Meseci su 0-indeksirani, pa dodajemo 1
    const dan = String(datumRodjenja.getDate()).padStart(2, '0'); // Dodaje 0 ispred jednocifrenih dana
    const formatiranDatum = `${godina}-${mesec}-${dan}`; // Formatira datum u yyyy-MM-dd

    const formData1 = {
        id: document.getElementById("dodajId").value,
        korisnickoIme: document.getElementById("dodajKorisnickoIme").value,
        ime: document.getElementById("dodajIme").value,
        prezime: document.getElementById("dodajPrezime").value,
        datumRodjenja: formatiranDatum
    };
     
    let url = 'http://localhost:21271/api/users';
    let method ='POST';

    if (userId != null){
      url = `http://localhost:21271/api/users/${userId}`
      method = 'PUT';
    }


    

    let bodyData = formData1

        if(userId != null) {
            bodyData = jsonData;
        }

        console.log(JSON.stringify(bodyData))
  fetch(url, { // Pravi POST zahtev da se sačuva knjiga
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => {
      if (!response.ok) {
        // Ako statusni kod nije iz 2xx (npr. 400), kreiramo grešku
        const error = new Error('Request failed. Status: ' + response.status)
        error.response = response // Dodajemo ceo response objekat u grešku
        throw error  // Bacamo grešku
      }
      return response.text(); // Uzimamo kao tekst
    })
    .then(text => {
        // Ako je odgovor prazan, vrati prazan objekat ili null prema tvom izboru
        const data = text ? JSON.parse(text) : {};
        return data;
    })
    .then(data => {
        window.location.href = '../index.html';
    })
    .catch(error => {
      console.error('Error:', error.message)
      if(error.response && error.response.status === 400) {
        alert('Data is invalid!')
      }
      else {
        alert('An error occurred while updating the data. Please try again.')
      }
    })
}




