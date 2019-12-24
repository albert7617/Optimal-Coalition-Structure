$(function() {
  $('#players').on('change', function(event) {
    $('#characteristic').html('');
    $('#shapley .cell-players').remove();
    combinations(Array.apply(undefined, Array(parseInt($('#players :selected').val()))).map(function(x,y) { return String.fromCharCode(y + 65); }).join('')).sort(function(a, b) {return a.length - b.length || a.localeCompare(b)}).forEach(element => $('#characteristic').append(`<div class="cell-container"><div class="cell-top">${element}</div><div class="cell-bottom"><input id="${element}" type="number" value="0"></div></div>`));
  });
  $('#random').on('click', function(event) {
    $('#characteristic .cell-container').toArray().forEach((elem, idx) => $(elem).find('input').val(randomIntFromInterval(0, $(elem).find('.cell-top').html().length*10)));
  });
  $('#load').on('click', function(event) {
    var data = [30, 40, 25, 45, 50, 60, 80, 55, 70, 80, 90, 120, 100, 115, 140];
    $('input[type="number"]').toArray().forEach((elem, idx) => $(elem).val(data[idx]));
  });
  $('#calculate').on('click', function(event) {
    var all_combinations = combinations(Array.apply(undefined, Array(parseInt($('#players :selected').val()))).map(function(x,y) { return String.fromCharCode(y + 65); }).join('')).sort(function(a, b) {return a.length - b.length || a.localeCompare(b)});
    var all_combinations_payoff = [];
    var result = {};
    var players = parseInt($('#players').find(':selected').val());
    var players_str = Array.apply(undefined, Array(players)).map((x,y) => String.fromCharCode(y + 65)).join('');
    all_combinations.forEach(element => all_combinations_payoff[element] = parseInt($('#'+element).val()));
    $('#coalition').html('');
    $('#coalition').append('<div class="row-container"><div class="row"><div class="col col-1 header">C</div><div class="col col-2 header">Values must be compared before setting t(C)&f(C)</div><div class="col col-3 header">t(C)</div><div class="col col-4 header">f(C)</div></div></div>');
    var row = '';
    var highlight = [];
    // console.log(all_combinations_payoff);
    all_combinations.forEach((element, idx, arr) => {
      var sub_coalitions = getSubCoalition(element);
      var spans = `<span id='sub-${element}'>v({${element}})=${all_combinations_payoff[element]}</span>`;
      var tobe_compared = [];
      tobe_compared[element] = all_combinations_payoff[element];
      sub_coalitions.forEach(elem => {
        var payoff = elem.reduce((a, b) => all_combinations_payoff[a] + all_combinations_payoff[b]);
        tobe_compared[elem] = payoff;
        spans += `<span id='sub-${elem.join('-')}'>v({${elem.join('}+{')}})=${payoff}</span>`;
      });
      all_combinations_payoff[element] = Math.max(...Object.values(tobe_compared));
      row += `<div class="row"><div class="col col-1" id="c-${element}" data-tc="${Object.keys(tobe_compared).find(key => tobe_compared[key] === all_combinations_payoff[element])}">${element}</div><div class="col col-2">${spans}</div><div class="col col-3">{${Object.keys(tobe_compared).find(key => tobe_compared[key] === all_combinations_payoff[element]).split(',').join('}+{')}}</div><div class="col col-4">${all_combinations_payoff[element]}</div></div>`;
      highlight.push('#sub-'+Object.keys(tobe_compared).find(key => tobe_compared[key] === all_combinations_payoff[element]).split(',').join('-'));
      if (idx+1>=arr.length) {
        $('#coalition').append(`<div class="row-container">${row}</div>`)
        row = '';
      } else {
        if (arr[idx+1].length != arr[idx].length) {
          $('#coalition').append(`<div class="row-container">${row}</div>`)
          row = '';
        }
      }
    });
    highlight.forEach(elem => $(elem).addClass('highlight'));
    $('#answer').html('Optimal Coalition Structure: ');
    $('#answer').append(findOptimal($('.row-container:last-child .col-1').data('tc')));
  });
  $('#players').trigger('change');
});

function combinations(str) {
  var fn = function(active, rest, a) {
    if(!active && !rest)
      return;
    if(!rest) {
      a.push(active);
    } else {
      fn(active + rest[0], rest.slice(1), a);
      fn(active, rest.slice(1), a);
    }
    return a;
  }
  return fn("", str, []);
}

function getSubCoalition(coalition) {
  if (coalition.length == 1) {
    return [];
  } else {
    var retval = [];
    combinations(coalition).sort((a, b) => a.length - b.length || a.localeCompare(b)).some((elem,idx,arr) => {retval.push([elem, arr[arr.length-2-idx]]);return Math.floor(arr.length/2)-1 == idx;})
    return retval;
  }
}

function findOptimal(coalition) {
  var [t1, t2] = coalition.split(',');
  var r1, r2;
  if ($('#c-'+t1).data('tc')==t1) {
    r1 = `{${t1}}`;
  } else {
    r1 = findOptimal($('#c-'+t1).data('tc'));
  }
  if (t2 != undefined) {
    if ($('#c-'+t2).data('tc')==t2) {
      r2 = `{${t2}}`;
    } else {
      r2 = findOptimal($('#c-'+t2).data('tc'));
    }
  }
  return `${r1}+${r2}`;
}

String.prototype.allReplace = function(str) {
  var retStr = this;
  for (var i = 0; i < str.length; i++) {
    retStr = retStr.replace(str[i], '');
  }
  return retStr;
};

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}