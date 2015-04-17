var displayResponse = function(container, response) {
  if (response.isError()) {
    container.text('Error!');
  } else {
    var data = response.getDataTable();
    var values = data.getDistinctValues(0);
    if (values.length == 0) {
      container.text('No results found');
    } else {
      for (var i = 0; i < values.length; i++) {
        container.text(values);
      };
    };
  };
};

var displayResponseAsTable = function(container, response) {
  if (response.isError()) {
    container.text('Error!');
  } else {
    var data = response.getDataTable();
    var numberOfColumns = data.getNumberOfColumns();
    var numberOfRows = data.getNumberOfRows();
    if (numberOfRows == 0) {
      container.text('No results found');
    } else {
      var table = $('<table>');
      var tableRow = $('<tr>');
      for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
        var columnHeading = data.getColumnLabel(columnIndex);
        var tableHeader = $('<th>');
        tableHeader.append(columnHeading);
        tableRow.append(tableHeader);
      };
      table.append(tableRow);
      for (var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        var tableRow = $('<tr>');
        for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
          var tableData = $('<td>');
          var text = data.getValue(rowIndex, columnIndex);
          tableData.append(text);
          tableRow.append(tableData);
        };
        tableRow.append(tableData);
        table.append(tableRow);
      };
      container.html(table);
    };
  };
};
