const fs = require('fs');

const dbJSON = {};

function createFileStructure(key) {
  dbJSON[key] = {};
  dbJSON[key]['SEG'] = {};
  dbJSON[key]['TER'] = {};
  dbJSON[key]['QUA'] = {};
  dbJSON[key]['QUI'] = {};
  dbJSON[key]['SEX'] = {};
  dbJSON[key]['SAB'] = {};
  createHoursStructure(key);
}

function createHoursStructure(key) {
  Object.keys(dbJSON[key]).forEach((day, index) => {
    dbJSON[key][day]['07-09'] = false;
    dbJSON[key][day]['09-11'] = false;
    dbJSON[key][day]['11-13'] = false;
    dbJSON[key][day]['13-15'] = false;
    dbJSON[key][day]['15-17'] = false;
    dbJSON[key][day]['17-19'] = false;
    dbJSON[key][day]['19-21'] = false;
    dbJSON[key][day]['21-23'] = false;
  })
}

fs.readFile('./result.json', (err, rawdata) => {
  if (err) console.log('err ' + err); 
  const data = JSON.parse(rawdata);
  data.forEach((value, index) => {
    const infoTotal = value['Horario/Sala/Local'].split('/');
    for(i = 0; i < infoTotal.length - 1; i++) {
      let info = infoTotal[i].trim().split(' ');
      if (info.length  > 3) {
        info = info.slice(2);
      }
      
      try {
        if(info[2] == undefined || info[0] == undefined || info[1] == undefined) {
          throw Error('error');
        }

        if (info[2] in dbJSON) {
          dbJSON[info[2]][info[0]][info[1]] = true;
        } else {
          createFileStructure(info[2]);
          dbJSON[info[2]][info[0]][info[1]] = true;
        }       
      } catch (err) {
        console.log('Error no Parser: ' + err);
        console.log(value);
        console.log(infoTotal)
        console.log(info)
      }
    }
  });

  const orderedDB = {};
  Object.keys(dbJSON).sort().forEach(function(key) {
    orderedDB[key] = dbJSON[key];
  });

  Object.keys(orderedDB).forEach(function (key, index){
    if (index == 0) {

    }
    
    else {
      console.log(key);
    }
  });

  fs.writeFile('./db.json', JSON.stringify(orderedDB), 'utf8', (err, data) => {
    if (err) console.log('err ' + err);
    else console.log('Finished');
  })
});

