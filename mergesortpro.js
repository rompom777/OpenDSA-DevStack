// File: mergesortpro.js
/*global alert: true, console: true, ODSA */
$(document).ready(function() {
  "use strict";

  // Load the interpreter created by odsaAV.js
  var config = ODSA.UTILS.loadConfig();
  var interpret = config.interpreter;

  // Variables used by "setPosition()"
  var canvasWidth = $("#container").width();     // The width of the display
  var rowHeight = 70;        // Space required for each row to be displayed
  var blockWidth = 32;       // The width of an array element

  // Variables used to keep track of the index and array of
  // currently selected element
  var mergeValueIndex = -1;
  var mergeValueArr = null;

  // Settings for the AV
  var settings = config.getSettings();

  // … rest of existing mergesortPRO implementation …
});

// --- Add below this line ---



// Keeps the most recently saved state locally so a user can manually restore
var lastSavedState = null;

// Save state of the visualization so that the session can be restored
function saveState() {
  var state = {
    array: currentArray && currentArray.slice ? currentArray.slice() : [],
    low: typeof low !== 'undefined' ? low : 0,
    mid: typeof mid !== 'undefined' ? mid : 0,
    high: typeof high !== 'undefined' ? high : 0,
    mergeValueIndex: mergeValueIndex,
    mergeValueArr: mergeValueArr ? mergeValueArr.slice() : null
  };

  lastSavedState = state;

  ODSA.UTILS.sendMessage({
    type: 'splice-save',
    exercise: 'mergesortpro',
    state: state
  });
}

// Restore a previously saved state
function restoreState(msg) {
  if (!msg || !msg.state) { return; }

  var st = msg.state;
  if (st.array) { currentArray = st.array.slice(); }
  if (typeof st.low !== 'undefined') { low = st.low; }
  if (typeof st.mid !== 'undefined') { mid = st.mid; }
  if (typeof st.high !== 'undefined') { high = st.high; }

  mergeValueIndex = typeof st.mergeValueIndex !== 'undefined' ? st.mergeValueIndex : -1;
  mergeValueArr = st.mergeValueArr ? st.mergeValueArr.slice() : null;

  // Assuming drawArray() and updateMergeBounds() are part of the existing AV
  if (typeof drawArray === 'function') { drawArray(); }
  if (typeof updateMergeBounds === 'function') { updateMergeBounds(low, mid, high); }
}

// Listen for restore messages from parent
window.addEventListener('message', function(evt) {
  if (evt.data && evt.data.type === 'splice-restore' && evt.data.exercise === 'mergesortpro') {
    restoreState(evt.data);
  }
});

// Automatically save state after each merge step if a mergeStep function exists
if (typeof mergeStep === 'function') {
  var originalMergeStep = mergeStep;
  mergeStep = function() {
    var res = originalMergeStep.apply(this, arguments);
    saveState();
    return res;
  };
}

// Hook up Save/Restore buttons when present
$(function() {
  $("#saveBtn").on("click", saveState);
  $("#restoreBtn").on("click", function() {
    if (lastSavedState) {
      restoreState({ state: lastSavedState });
    }
  });
});

