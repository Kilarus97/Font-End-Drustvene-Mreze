function GetGroups(){
  fetch('http://localhost:21271/api/grupe')
  .then(response => {
    if(!response.ok){
      throw new Error('Request failed. Status: ' + response.status)
    }
    return response.json();
  })
  .then(groups => ispisiGrupe(groups))
  .catch(error =>  {
     console.error('Error:', error.message)
        // Sakrij tabelu
        let table = document.querySelector('table')
        if (table) {
          table.style.display = 'none'
        }
        alert('An error occurred while loading the data. Please try again.')
  })
}

function getAll(id) {
  dohvatiKorisnikeIzGrupe(id)
    .then(users => ispisiUsers(users, id))
    .then(user =>  GetAllUsersWithoutGroup(id))
    .catch(error => {
      console.error('Error:', error.message);
      let table = document.querySelector('table');
      if (table) {
        table.style.display = 'none';
      }
      alert('An error occurred while loading the data. Please try again.');
    });
}


  function dohvatiKorisnikeIzGrupe(groupId) {
  return fetch(`http://localhost:21271/api/GrupeUsers/group/${groupId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Neuspešan zahtev za korisnike u grupi.');
      }
      return response.json();
    });
}

function ispisiGrupe(groups){
  let table = document.querySelector('#groupsBody')
  table.innerHTML = '';

  groups.forEach(group => {
    const row = document.createElement("tr");

    let newDate = new Date(group.datumOsnivanja)
    let day = String(newDate.getDate()).padStart(2, '0');
    let month = String(newDate.getMonth() + 1).padStart(2, '0');
    let year = newDate.getFullYear();
    let datum = `${day}/${month}/${year}`;

    row.innerHTML = `
      <td>${group.id}</td>
      <td>${group.naziv}</td>
      <td>${datum}</td>
      <td><button class="detalji" data-id="${group.id}">Detalji</button></td>
      <td><button class="izbrisi" data-id="${group.id}">Izbrisi</button></td>
    `;

    table.appendChild(row);
  });

  table.querySelectorAll(".detalji").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"))
      getAll(id);
    })
  });

  table.querySelectorAll(".izbrisi").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"))
      izbrisiGrupu(id)
    })
  });
}


function izbrisiGrupu(id){
   fetch(`http://localhost:21271/api/grupe/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Delete failed. Status: ' + response.status);
    }
    GetGroups();
  })
  .catch(error => {
    console.error('Error:', error.message);
    alert('An error occurred while deleting the group. Please try again.');
  });

}

function ispisiUsers(nizUsera, groupId){
    document.getElementById('users').style.display = 'block';
    document.getElementById('usersNoGroup').style.display = 'block';
    let tabela = document.querySelector('#usersBody')
    tabela.innerHTML = ''

    
    for(let user of nizUsera){
        let noviRed = tabela.insertRow()
    
        let idCell = noviRed.insertCell()
        idCell.textContent = user.id

        let korisnickoImeCell = noviRed.insertCell()
        korisnickoImeCell.textContent = user.korisnickoIme

        let imeCell = noviRed.insertCell()
        imeCell.textContent = user.ime

        let prezimeCell = noviRed.insertCell()
        prezimeCell.textContent = user.prezime

        let datumCell =noviRed.insertCell()
        let originalniDatum = new Date(user.datumRodjenja); // Pretvara string u Date objekat
        let dan = String(originalniDatum.getDate()).padStart(2, '0'); // Dodaje 0 ispred jednocifrenih dana
        let mesec = String(originalniDatum.getMonth() + 1).padStart(2, '0'); // Meseci su 0-indeksirani, pa dodajemo 1
        let godina = originalniDatum.getFullYear(); // Dobija punu godinu
        datumCell.textContent = `${dan}/${mesec}/${godina}`; // Formatira datum u dd/MM/yyyy

        let izbrisiCell = noviRed.insertCell();

        let dugme = document.createElement('button');
        dugme.textContent = 'Izbrisi iz grupe';
        dugme.classList.add('btn-izbrisi');

        dugme.addEventListener('click', () => {
            izbrisiKorisnikaIzGrupe(user.id, groupId);
        });

        izbrisiCell.appendChild(dugme);
    }
}

function ispisiUsereBezGrupe(users, groupId){
  document.querySelector('#usersNoGroup').style.display = 'block';
    let tabela = document.querySelector('#usersNoGroupBody')
    tabela.innerHTML = ''
    
    for(let user of users){
        let noviRed = tabela.insertRow()
    
        let idCell = noviRed.insertCell()
        idCell.textContent = user.id

        let korisnickoImeCell = noviRed.insertCell()
        korisnickoImeCell.textContent = user.korisnickoIme

        let imeCell = noviRed.insertCell()
        imeCell.textContent = user.ime

        let prezimeCell = noviRed.insertCell()
        prezimeCell.textContent = user.prezime

        let datumCell =noviRed.insertCell()
        let originalniDatum = new Date(user.datumRodjenja); // Pretvara string u Date objekat
        let dan = String(originalniDatum.getDate()).padStart(2, '0'); // Dodaje 0 ispred jednocifrenih dana
        let mesec = String(originalniDatum.getMonth() + 1).padStart(2, '0'); // Meseci su 0-indeksirani, pa dodajemo 1
        let godina = originalniDatum.getFullYear(); // Dobija punu godinu
        datumCell.textContent = `${dan}/${mesec}/${godina}`; // Formatira datum u dd/MM/yyyy

        let izbrisiCell = noviRed.insertCell();

        let dugme = document.createElement('button');
        dugme.textContent = 'Dodaj u grupu';
        dugme.classList.add('btn-dodaj');

        dugme.addEventListener('click', () => {
          dodajKorisnikaUGrupu(user.id, groupId);
        });


        izbrisiCell.appendChild(dugme);
    }

}

function dodajKorisnikaUGrupu(userId, groupId) {
  let usersUGrupi = []; // ⬅️ dodaj ovde

  fetch(`http://localhost:21271/api/GrupeUsers/add/${groupId}/${userId}`, {
    method: 'PUT'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Greška prilikom dodavanja korisnika u grupu.');
      }
      return dohvatiKorisnikeIzGrupe(groupId);
    })
    .then(users => {
      usersUGrupi = users; // ⬅️ sačuvaj rezultat u promenljivu
      ispisiUsers(users, groupId);
      return fetch('http://localhost:21271/api/users');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Greška prilikom dohvatanja svih korisnika.');
      }
      return response.json();
    })
    .then(sviKorisnici => {
      const korisniciBezGrupe = sviKorisnici.filter(k =>
        !usersUGrupi.some(g => g.id === k.id)
      );
      ispisiUsereBezGrupe(korisniciBezGrupe, groupId);
    })
    .catch(error => {
      console.error('Greška:', error.message);
      alert('Greška prilikom dodavanja korisnika u grupu.');
    });
}



function GetAllUsersWithoutGroup(groupId) {
  Promise.all([
    fetch('http://localhost:21271/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Neuspešan zahtev za sve korisnike.');
        }
        return response.json();
      }),
    dohvatiKorisnikeIzGrupe(groupId)
  ])
  .then(([sviKorisnici, korisniciUGrupi]) => {
    const korisniciBezGrupe = sviKorisnici.filter(k =>
      !korisniciUGrupi.some(g => g.id === k.id)
    );
    ispisiUsereBezGrupe(korisniciBezGrupe, groupId);
  })
  .catch(error => {
    console.error('Greška prilikom dohvatanja korisnika:', error.message);
    alert('Greška pri učitavanju korisnika.');
  });
}


function izbrisiKorisnikaIzGrupe(id, groupId) {
  fetch(`http://localhost:21271/api/GrupeUsers/remove/${groupId}/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Delete failed. Status: ' + response.status);
    }
    return dohvatiKorisnikeIzGrupe(groupId);
  })
  .then(users => {
    ispisiUsers(users, groupId);

    return fetch('http://localhost:21271/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Neuspešan zahtev za sve korisnike.');
        }
        return response.json().then(sviKorisnici => {
          const korisniciBezGrupe = sviKorisnici.filter(k =>
            !users.some(g => g.id === k.id)
          );
          ispisiUsereBezGrupe(korisniciBezGrupe, groupId);
        });
      });
  })
  .catch(error => {
    console.error('Error:', error.message);
    alert('An error occurred while deleting the user from group. Please try again.');
  });
}


document.addEventListener('DOMContentLoaded', GetGroups)
document.addEventListener('DOMContentLoaded', document.querySelector('.dodajGrupu').addEventListener('click' , ()=>{
  window.location.href="../grupeForma/grupeForma.html"
}))