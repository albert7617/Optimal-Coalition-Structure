const factorial = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800];
$(function() {
  $('#players').on('change', function(event) {
    $('#characteristic').html('');
    $('#shapley .cell-players').remove();
    combinations(Array.apply(undefined, Array(parseInt($('#players :selected').val()))).map(function(x,y) { return String.fromCharCode(y + 65); }).join('')).sort(function(a, b) {return a.length - b.length || a.localeCompare(b)}).forEach(element => $('#characteristic').append(`<div class="cell-container"><div class="cell-top">${element}</div><div class="cell-bottom"><input id="${element}" type="number" value="0"></div></div>`));
  });
  $('#calculate').on('click', function(event) {
    var all_combinations = combinations(Array.apply(undefined, Array(parseInt($('#players :selected').val()))).map(function(x,y) { return String.fromCharCode(y + 65); }).join('')).sort(function(a, b) {return a.length - b.length || a.localeCompare(b)});
    var result = {};
    var players = parseInt($('#players').find(':selected').val());
    var players_arr = Array();
    $('#shapley').html('');
    for (var i = 0; i < players; i++) {
      players_arr.push(String.fromCharCode(i + 65));
      result[String.fromCharCode(i + 65)] = "";
      $('#shapley').append(`<div class="cell-container" id="player-${String.fromCharCode(i + 65)}"><div class="cell-top cell-wide"><span>${String.fromCharCode(i + 65)}</span><div><span>{S}</span><span>MC</span></div></div></div>`);
    }
    var all_combinations_payoff = [];
    all_combinations.forEach(element => all_combinations_payoff[element] = $('#'+element).val());
    players_arr.forEach(element => result[players_arr[i]] += `<div class="cell-bottom cell-wide"><div><span>{∅}</span><span data-mc="${all_combinations_payoff[element]*factorial[players-1]}">${all_combinations_payoff[element]} X 1 X ${factorial[players-1]}</span></div></div>`);
    all_combinations.forEach(element => {
      for (var i = 0; i < players_arr.length; i++) {
        if (!element.includes(players_arr[i]))
          result[players_arr[i]] += `<div class="cell-bottom cell-wide"><div><span>{${element}}</span><span data-mc="${(all_combinations_payoff[(element+players_arr[i]).split('').sort().join('')] - all_combinations_payoff[element])*factorial[element.length]*factorial[players-element.length-1]}">${all_combinations_payoff[(element+players_arr[i]).split('').sort().join('')] - all_combinations_payoff[element]} X ${factorial[element.length]} X ${factorial[players-element.length-1]}</span></div></div>`;
      }
    });
    players_arr.forEach((e, i) => $('#player-'+e).append(result[e]));
    players_arr.forEach((e, i) => $('#player-'+e).append(`<div class="cell-bottom cell-wide"><div><span>Total</span><span>${$('#player-'+e+' .cell-bottom span:last-child').toArray().map((e)=>e.dataset.mc).reduce((a, b)=>parseInt(a)+parseInt(b)) / factorial[players]}</span></div></div>`));
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