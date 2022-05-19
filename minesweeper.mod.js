javascript: (function() {


const style = "style='margin-top: 2px; width: 60px;'";
const newBombArray = [25, 36, 49, 64, 81, 100, 144, 225, 256, 289, 324, 361, 400, 441];
const newBombCount = [5, 6, 7, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const newElem = [
	['5x5', '25'],
	['6x6', '36'],
	['7x7', '49'],
	['8x8', '64'],
	['9x9 (Small)', '81'],
	['10x10', '100'],
	['12x12', '144'],
	['15x15 (Medium)', '225'],
	['16x16', '256'],
	['17x17', '289'],
	['18x18', '324'],
	['19x19', '361'],
	['20x20', '400'],
	['21x21 (Large)', '441']
]
function init() {
  let thing = [0, 1, 0, 1, 0, 1];
	$('.modes').remove();

  $("body").append($("<table id='moddedModes' style='text-align: left; top: 10%; color: white; left: 0%; position: absolute;'></table>"));
  highscore = {}
  for (const elem of newElem) {
    $('#moddedModes').append($(`<button  class='moddedModes' id='blocks${elem[1]}' ${style}>${elem[0]}</button><br>`));
  	highscore[elem[1]] = 0;
  }
  $("#moddedModes").on("click", ".moddedModes", function() {
    let id = this.id;
    id = id.slice(6);
    placealeboard(id);
  });
  let bombLength = newBombArray.length;

  for (let i = 0; i < bombLength; i++) {
    bombArray[newBombArray[i]] = newBombCount[i];
  }
  placealeboard(25);
}
function drawaBoard() {
  let lane = 1;
  for (let i = 1; i <= blocks; i++) {
    if (board[i - 1].shown == true) {
      if (lane % 2 == 0 && i % 2 == (parseInt(blocks) + 1) % 2) $('#' + i).css('background-color', '#666');
      else if (lane % 2 == 1 && i % 2 == 0) $('#' + i).css('background-color', '#666');
      else $('#' + i).css('background-color', '#444');
      if (i % Math.sqrt(blocks) == 0) {
        if (lane == 1) lane = 2;
        else if (lane == 2) lane = 1;
      }
      if (board[i - 1].amntOfBombs != 0 && !board[i - 1].bomb) $(`#${i}p`).html(board[i - 1].amntOfBombs);
      switch (board[i - 1].amntOfBombs) {
        case 1:
          $(`#${i}p`).css("color", "#4287c5");
          break;
        case 2:
          $(`#${i}p`).css("color", "#069518");
          break;
        case 3:
          $(`#${i}p`).css("color", "#cc0000");
          break;
        case 4:
          $(`#${i}p`).css("color", "#7c0091");
          break;
        case 5:
          $(`#${i}p`).css("color", "#6e0000");
          break;
        case 6:
          $(`#${i}p`).css("color", "#00bf93");
          break;
        case 7:
          $(`#${i}p`).css("color", "#080808");
          break;
        case 8:
          $(`#${i}p`).css("color", "#424242");
          break;
        default:
      }
      if (board[i - 1].bomb == true) $("#" + i).css("background", "red");
    } else {
      if (lane % 2 == 0 && i % 2 == (parseInt(blocks) + 1) % 2) $('#' + i).css('background-color', '#060');
      else if (lane % 2 == 1 && i % 2 == 0) $('#' + i).css('background-color', '#060');
      else $('#' + i).css('background-color', '#040');
      if (i % Math.sqrt(blocks) == 0) {
        if (lane == 1) lane = 2;
        else if (lane == 2) lane = 1;
      }
    }
  }
}
function placealeboard(mode, redo, id) {
	$('#highscore').text(`Highscore: ${highscore[mode]}s`);
  clearInterval(timerval);
  timer = 0;
  $('#timer').text(`Time: ${timer}s`);
  flags = 0;
  $(`#flagCount`).text('Flags Left: ' + bombArray[mode]);
  $("html").removeClass('lost');
  $("html").removeClass('win');
  $("#result").text("");
  clicked = false;
  playing = true;
  board = [];
  for (let i = 1; i <= maxBlocks; i++) {
    $("#" + i).remove();
  }
  blocks = mode;
  check = [(Math.sqrt(blocks) * -1) - 1, Math.sqrt(blocks) * -1, (Math.sqrt(blocks) * -1) + 1, -1, 1, Math.sqrt(blocks) - 1, Math.sqrt(blocks), Math.sqrt(blocks) + 1];
  for (let i = 1; i <= blocks; i++) {
    board[i - 1] = {
      bomb: false,
      shown: false,
      amntOfBombs: 0,
      exposed: false,
      id: 0
    };
    $("body").append(
      $(
        `<div id=${i} class='modblock' style='height:calc(50vw/${Math.sqrt(blocks)}); width:calc(50vw/${Math.sqrt(blocks)}); max-width: ${540/Math.sqrt(blocks)}px;  max-height: ${540/Math.sqrt(blocks)}px;'><p id=${
        i + "p"
      }></p></div>`
      )
    );
  }
  createBombs(bombArray[mode]);
  for (let i = 1; i <= blocks; i++) {
    let row1 = Math.floor((i + Math.sqrt(blocks) - 1) / Math.sqrt(blocks));
    check.forEach((a) => {
      let row2 = Math.floor((i + a + Math.sqrt(blocks) - 1) / Math.sqrt(blocks));
      if (
        board[i - 1 + a] != null &&
        board[i - 1 + a].bomb == true &&
        ((a < -1 && row1 - 1 == row2) ||
          ((a == -1 || a == 1) && row1 == row2) ||
          (a > 1 && row1 + 1 == row2))
      )
        board[i - 1].amntOfBombs += 1;
    });
    board[i - 1].id = i;
  }
  drawaBoard();
}

$("body").on("mousedown", ".modblock", function(e) {
  if (e.button == 2) {
    if ($("#" + this.id + "i").length == 0 && !board[this.id-1].shown && flags < bombArray[blocks]) addFlag(this.id, this.id + "i");
    else if($("#" + this.id + "i").length != 0 ) removeFlag(this.id + "i");
  }
  else if(e.button == 0) mclick(this.id);
});

function mclick(id) {
  id = parseInt(id);
  if (!clicked && (board[id - 1].amntOfBombs != 0 || board[id - 1].bomb == true)) {
    redoBoard(blocks, id);
  }
  if(!clicked) startTimer()
  clicked = true;
  if ($("#" + id + "i").length != 0) return;
  if (!playing) return;
  if (board[id - 1].bomb == true) {
    board[id - 1].shown = true;
    drawaBoard();
    lost();
    return;
  }
  if (board[id - 1].amntOfBombs == 0) recurse(id, 0);
  board[id - 1].shown = true;
  let shownBlocks = 0;
  board.forEach((a) => {
    if (a.shown) shownBlocks++;
  });
  drawaBoard();
  if (shownBlocks == blocks - bombArray[blocks]) win();
}

init()

})()
