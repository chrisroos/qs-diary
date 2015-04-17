var displaySearchingMessage = function(container) {
  var list = $('<ul><li>Searching...</li></ul>');
  container.html(list);
};

var queryData = function(url, gql, responseHandler) {
  var query = new google.visualization.Query(url);
  query.setQuery(gql);
  query.send(responseHandler);
};

var displayResponseAsList = function(container, response) {
  var list = $('<ul>');
  if (response.isError()) {
    list.append('<li>Error!</li>');
  } else {
    var data = response.getDataTable();
    var numberOfRows = data.getNumberOfRows();
    if (numberOfRows == 0) {
      list.append('<li>No results found</li>');
    } else {
      for (var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        var text = data.getValue(rowIndex, 0);

        // Handle cells with multiple lines (e.g. places visited)
        var regexp = /\n/;
        if (regexp.test(text)) {
          var lines = text.split("\n");
          $(lines).each(function(index, value) {
            if (value != '') {
              // Remove markdown list notation from beginning of the line
              value = value.replace(/^\* /, '')
              var listItem = $('<li>');
              listItem.append(value);
              list.append(listItem);
            };
          });
        } else {
          var listItem = $('<li>');
          listItem.append(text);
          list.append(listItem);
        };
      };
    };
  };
  container.html(list);
};

var search = function(container, url, gql) {
  displaySearchingMessage(container);
  queryData(url, gql, function(response) {
    displayResponseAsList(container, response);
  });
}

var searchForDate = function() {
  var date = $('#date').val();
  if (date) {
    var friendlyDateContainer = $('#friendlyDate');
    var friendlyDate = new Date(date).toDateString();
    friendlyDateContainer.text(friendlyDate);

    var beginningOfDay = date + ' ' + '00:00:00';
    var endOfDay       = date + ' ' + '23:59:59';

    var container = $('#placesVisited');
    var url       = 'https://docs.google.com/spreadsheets/d/1V20nI4e4cxwWA38W_OsMFNE4Awi2bw2-vWUww7TN15A/edit#gid=598997620';
    var gql       = "SELECT C WHERE B = DATE '" + date + "'";
    search(container, url, gql);

    var container = $('#filmAndTV');
    var url       = 'https://docs.google.com/spreadsheets/d/1rPu68Md7s1UtAlt5HzJetvZqdVw9vaoT40csoky_CE0/edit#gid=1713510473';
    var gql       = "SELECT C WHERE B = DATE '" + date + "'";
    search(container, url, gql);

    var container = $('#weight');
    var url       = 'https://docs.google.com/spreadsheets/d/19VdV4YlHrzREt4GnSOTGtNNe9scz7b0rUdzRA1m08Dk/edit#gid=8';
    var gql       = "SELECT D WHERE B = DATE '" + date + "'";
    search(container, url, gql);

    var container = $('#standingDesk');
    var url       = 'https://docs.google.com/spreadsheets/d/1G-apP_j0AsZHafvXIWUn_VZhE5_x1XcnjwrPk52xO3E/edit#gid=362670987';
    var gql       = "SELECT B, D WHERE C = DATE '" + date + "'";
    search(container, url, gql);

    var container = $('#readingDiary');
    var url       = 'https://docs.google.com/spreadsheets/d/1RYVmiHp4C_b87Y1x8n1aRvmFbwQ7NT9J5iyjtO2UtnA/edit#gid=0';
    var gql       = "SELECT B WHERE D <= DATE '" + date + "' AND (E >= DATE '" + date + "' OR E IS NULL)";
    search(container, url, gql);

    var container = $('#oysterJourneyHistory');
    var url       = 'https://docs.google.com/spreadsheets/d/1JWXVQsY_witdggNQDCqLNr_Xx2og5pugQTOnXBZYTcY/edit#gid=0';
    var gql       = "SELECT D WHERE A = DATE '" + date + "'";
    search(container, url, gql);

    var container = $('#barclaysCycleHire');
    var url       = 'https://docs.google.com/spreadsheets/d/1gWyvFzsNlOzTNM8wy8Vtz7D4VMD1Dw-ZVCeUAIeoOeE/edit#gid=549189213';
    var gql       = "SELECT C, D WHERE A = 'rental' AND B >= DATETIME '" + beginningOfDay + "' AND B <= DATETIME '" + endOfDay + "'";
    search(container, url, gql);
  };
};

var dateToYMD = function(date) {
  return date.toISOString().slice(0,10);
};

google.load('visualization', '1', {'packages':['corechart']});

google.setOnLoadCallback(function() {
  var today = new Date();
  var todayString = dateToYMD(today);
  $('#date').val(todayString);
  searchForDate();
});

$(function() {
  $('#previousDay').click(function() {
    var dateString = $('#date').val();
    var date = new Date(dateString);
    var previousDay = new Date(date.setDate(date.getDate() - 1));
    var previousDayString = dateToYMD(previousDay);
    $('#date').val(previousDayString);
    searchForDate();
  });

  $('#nextDay').click(function() {
    var dateString = $('#date').val();
    var date = new Date(dateString);
    var nextDay = new Date(date.setDate(date.getDate() + 1));
    var nextDayString = dateToYMD(nextDay);
    $('#date').val(nextDayString);
    searchForDate();
  });

  $('#date').change(function() {
    searchForDate();
  });
});
