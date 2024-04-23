var overlay = $("#overlay");

if (checkNotNull(jQuery("#custpage_p_at_date").val())) {
  overlay.fadeIn(300, function () {
    let html = `<tbody>
<tr class="table-danger">
<th scope="col"></th>
<th scope="col"></th>
<th scope="col"></th>
<th scope="col"></th>
<th scope="col"></th>
<th scope="col"></th>
</tr>
</tbody>`;
    html = bodyHTML(html, reportId);
    $("#resultsDiv").html(html);

    if (data) {
      data.forEach(function (result) {
        results.push([
          result.tai_san,
          result.chitieu2,
          result.ma_so,
          result.thuyet_minh || "",
          result.so_cuoi_ky,
          result.so_dau_ky,
          result.bold,
        ]);
      });
      $("#report-result").fadeIn();
      let activeColumnIndexes = [];
      let reportData = [...results];
      if (results.length > 0) {
        activeColumnIndexes = Array.from(
          { length: results[0].length - 1 },
          (_, index) => index
        );
        var isFirstColVis = true;
        //@ts-ignore
        let createdDataTable = $("#report-table").DataTable({
          data: results,
          ordering: true,
          order: [],
          paging: true,
          deferRender: true,
          lengthMenu: [
            [10, 25, 50, 100, 200, 500, 1000, -1],
            [10, 25, 50, 100, 200, 500, 1000, "Toàn bộ"],
          ],
          fixedHeader: false,
          columns: [
            {
              data: "0",
              render: function (data, type, row, meta) {
                console.log(row[6]);
                if (row[6] == "true") {
                  return `<p class="text-left my-0" style="font-weight: bold;">${data}</p>`;
                } else {
                  return `<p class="text-left my-0">${data}</p>`;
                }
              },
            },
            {
              data: "1",
              render: function (data, type, row, meta) {
                if (row[6] == "true") {
                  return `<p class="text-left my-0" style="font-weight: bold;">${data}</p>`;
                } else {
                  return `<p class="text-left my-0">${data}</p>`;
                }
              },
            },
            {
              data: "2",
              render: function (data, type, row, meta) {
                if (row[6] == "true") {
                  return `<p class="text-center my-0" style="font-weight: bold;">${data}</p>`;
                } else {
                  return `<p class="text-center my-0">${data}</p>`;
                }
              },
            },

            {
              data: "3",
              render: function (data, type, row, meta) {
                if (row[6] == "true") {
                  return `<p class="text-center my-0" style="font-weight: bold;">${data}</p>`;
                } else {
                  return `<p class="text-center my-0">${data}</p>`;
                }
              },
            },
            {
              data: "4",
              render: function (data, type, row, meta) {
                if (row[6] == "true") {
                  return data < 0
                    ? '<p class="text-right my-0" style="color:red; font-weight: bold;">(' +
                        Number(Math.abs(data)).toLocaleString() +
                        ")</p>"
                    : data
                    ? '<p class="text-right my-0" style="font-weight: bold;">' +
                      Number(data).toLocaleString() +
                      "</p>"
                    : '<p class="text-right my-0" style="font-weight: bold;">0</p>';
                } else {
                  return data < 0
                    ? '<p class="text-right my-0" style="color:red; ">(' +
                        Number(Math.abs(data)).toLocaleString() +
                        ")</p>"
                    : data
                    ? '<p class="text-right my-0" >' +
                      Number(data).toLocaleString() +
                      "</p>"
                    : '<p class="text-right my-0">0</p>';
                }
              },
            },
            {
              data: "5",
              render: function (data, type, row, meta) {
                if (row[6] == "true") {
                  return data < 0
                    ? '<p class="text-right my-0" style="color:red; font-weight: bold;">(' +
                        Number(Math.abs(data)).toLocaleString() +
                        ")</p>"
                    : data
                    ? '<p class="text-right my-0" style="font-weight: bold;">' +
                      Number(data).toLocaleString() +
                      "</p>"
                    : '<p class="text-right my-0" style="font-weight: bold;">0</p>';
                } else {
                  return data < 0
                    ? '<p class="text-right my-0" style="color:red; ">(' +
                        Number(Math.abs(data)).toLocaleString() +
                        ")</p>"
                    : data
                    ? '<p class="text-right my-0" >' +
                      Number(data).toLocaleString() +
                      "</p>"
                    : '<p class="text-right my-0">0</p>';
                }
              },
            },
          ],
          language: {
            lengthMenu: "Hiển thị _MENU_ dòng mỗi trang",
            zeroRecords: "Không tìm thấy",
            info: "Từ dòng _START_ đến _END_ của tổng _TOTAL_ dòng dữ liệu",
            infoEmpty: "Không có dữ liệu",
            emptyTable: "Báo cáo không có dữ liệu phù hợp",
            search: "Tìm kiếm:",
            paginate: {
              first: "Đầu",
              last: "Cuối",
              next: "Tiếp theo",
              previous: "Trước",
            },
            loadingRecords: "Đang tải...",
          },
          createdRow: function (row, data, index) {
            // Updated Schedule Week 1 - 07 Mar 22
            if (!checkNotNull(data[0])) {
              $(row).css({
                "background-color": "#FFC0CB",
                "font-weight": "bold",
                color: "#000000",
              });
            }
          },
          colResize: {
            isEnabled: true,
            saveState: true,
            hoverClass: "dt-colresizable-hover",
            hasBoundCheck: true,
            // minBoundClass: 'dt-colresizable-bound-min',
            // maxBoundClass: 'dt-colresizable-bound-max',
            isResizable: function (column) {
              return true;
            },
            // onResizeStart: function (column, columns) {
            // },
            onResize: function (column) {
              let index = column.idx;
              let currentWidth = column.width;
              console.log("Mảng active: ", activeColumnIndexes);
              console.log("Index", index);
              // let newWidth = 'calc(' + currentWidth + ' - 14px)';
              let newWidth = currentWidth;
              // let newWidth = 'calc(' + currentWidth + ' - 26.285px)';
              console.log("Width: ", currentWidth);
              // $('#report-table').css('width', newWidth);

              var existedColIndex = activeColumnIndexes.indexOf(index);

              // Kiểm tra xem giá trị có tồn tại trong mảng hay không
              if (existedColIndex !== -1) {
                var headerOuterWidth = $(
                  ".dataTables_scrollHead table thead tr th"
                )
                  .eq(existedColIndex)
                  .outerWidth(true);

                var headerInnerWidth =
                  $(".dataTables_scrollHead table thead tr th")
                    .eq(existedColIndex)
                    .width() + 16;

                var thElement = document.querySelector(
                  ".dataTables_scrollHead table thead tr th:nth-child(" +
                    (existedColIndex + 1) +
                    ")"
                );

                var headerWidth = thElement.clientWidth;

                console.log("Buồn rồi 1: ", headerOuterWidth);
                console.log("Buồn rồi 2: ", headerInnerWidth);
                console.log("Buồn rồi 3: ", headerWidth);

                // if (!isFirstColVis) {
                // Lấy tất cả các cột trong phần đầu bảng (thead)
                var theadColumns = $(
                  ".dataTables_scrollHead table thead tr th"
                );

                // Lấy hàng đầu tiên trong tbody
                var firstRowTds = $("#report-table tbody tr:first-child td");

                // Lặp qua từng cột
                theadColumns.each(function (index, th) {
                  // Lấy độ rộng của cột và thêm 16
                  var headerInnerWidth = $(th).width() + 16;

                  // Lấy ô tương ứng trong hàng đầu tiên của tbody và đặt min-width
                  var targetTd = firstRowTds.eq(index);

                  // Kiểm tra nếu targetTd và headerInnerWidth có giá trị hợp lý
                  if (targetTd && headerInnerWidth) {
                    // Đặt giá trị min-width cho phần tử td với !important
                    targetTd.attr(
                      "style",
                      "min-width: " + headerInnerWidth + "px !important"
                    );
                  } else {
                    console.error(
                      "Không thể đặt giá trị min-width. Kiểm tra giá trị của targetTd hoặc headerInnerWidth."
                    );
                  }
                });
                // }
              } else {
                console.log(index + " không tìm thấy.");
              }

              // let newTableWidth =
              //     $('.dataTables_scrollHead table').width() - 50;
              let newTableWidth = $(".dataTables_scrollHead table").width();
              console.log("Mệt rồi đó: ", newTableWidth);

              // Trừ thêm 15px nó dội ra
              $("#report-table").width(newTableWidth);
              // console.log("Hello: ", 'calc(100% +' + currentWidth +')');
            },
          },
          scrollCollapse: true,
          scroller: true,
          scrollY: 800,
          dom: "lBfrtip",
          buttons: [
            {
              extend: "colvis",
              text: "Ẩn/Hiện cột",
              // columnText: function(dt, idx, title){
              //     return names[idx];
              // }
            },
          ],
          initComplete: function () {
            // Thêm header tổng cho bảng
            var newHeaderRow = $('<tr class="table-success filters">').html(
              ` <th scope="col" class="text-center align-middle"></th>
              <th scope="col" class="text-center align-middle"></th>
              <th scope="col" class="text-center align-middle"></th>
              <th scope="col" class="text-center align-middle" ></th>
              <th scope="col" class="text-center align-middle"></th>
              <th scope="col" class="text-center align-middle"></th>
          `
            );

            $(".dataTables_scrollHead table thead").append(newHeaderRow);

            // $('#report-table thead tr')
            //     .clone(true)
            //     .addClass('filters')
            //     .appendTo('#report-table thead');

            var api = this.api();

            api
              .columns()
              .eq(0)
              .each(function (colIdx) {
                // Set the header cell to contain the input element
                var cell = $(".filters th").eq(
                  $(api.column(colIdx).header()).index()
                );
                var title = $(cell).text();
                $(cell).html(
                  '<input type="text" style="width: auto !important;" placeholder="' +
                    title +
                    '" />'
                );

                // On every keypress in this input
                $(
                  "input",
                  $(".filters th").eq($(api.column(colIdx).header()).index())
                )
                  .off("keyup change")
                  .on("change", function (e) {
                    // Get the search value
                    $(this).attr("title", $(this).val());
                    var regexr = "({search})"; //$(this).parents('th').find('select').val();

                    // Search the column for that value
                    api
                      .column(colIdx)
                      .search(
                        this.value != ""
                          ? regexr.replace(
                              "{search}",
                              "(((" + this.value + ")))"
                            )
                          : "",
                        this.value != "",
                        this.value == ""
                      )
                      .draw();
                  })
                  .on("keyup", function (e) {
                    e.stopPropagation();

                    $(this).trigger("change");
                    // $(this)
                    //     .focus()[0]
                    //     .setSelectionRange(
                    //         cursorPosition,
                    //         cursorPosition
                    //     );
                  });
              });

            // Thêm này để fix độ rộng không bằng nhau ban đầu
            $("#report-table").width($(".dataTables_scrollHead table").width());

            var theadColumns = $(".dataTables_scrollHead table thead tr th");

            // Lấy hàng đầu tiên trong tbody
            var firstRowTds = $("#report-table tbody tr:first-child td");

            // Lặp qua từng cột
            theadColumns.each(function (index, th) {
              // Lấy độ rộng của cột và thêm 16
              var headerInnerWidth = $(th).width();

              // Lấy ô tương ứng trong hàng đầu tiên của tbody và đặt min-width
              var targetTd = firstRowTds.eq(index);

              // Kiểm tra nếu targetTd và headerInnerWidth có giá trị hợp lý
              if (targetTd && headerInnerWidth) {
                // Đặt giá trị min-width cho phần tử td với !important
                targetTd.attr(
                  "style",
                  "min-width: " + headerInnerWidth + "px !important"
                );
              } else {
                console.error(
                  "Không thể đặt giá trị min-width. Kiểm tra giá trị của targetTd hoặc headerInnerWidth."
                );
              }
            });
          },
          drawCallback: function (settings) {
            var api = this.api();
            var currentLength = api.rows({ page: "current" })[0].length;

            if (currentLength == 0) {
              $("#report-table").width(
                $(".dataTables_scrollHead table").width()
              );
            }
          },
        });

        // Này test thêm nút reset order
        var resetButton = $("<button/>", {
          text: "Khôi phục",
          class: "reset-button dt-button buttons-collection",
          click: function (event) {
            event.preventDefault();
            createdDataTable.order([]).draw();
            createdDataTable.clear().draw();
            createdDataTable.rows.add(reportData).draw();
          },
        });

        $(".dt-buttons").append(resetButton);

        // Thực hiện xoá thead của bảng report table
        var reportTableElement = document.getElementById("report-table");

        // Tạo một MutationObserver với hàm callback
        var observer = new MutationObserver(function (mutationsList) {
          // Lặp qua danh sách mutations
          for (var mutation of mutationsList) {
            // Kiểm tra mỗi phần tử được thêm vào
            mutation.addedNodes.forEach(function (addedNode) {
              // Kiểm tra nếu là phần tử <thead> và thuộc bảng có id là 'report-table'
              if (
                addedNode instanceof HTMLElement &&
                addedNode.matches("thead") &&
                addedNode.closest("#report-table")
              ) {
                // Xoá phần tử <thead>
                addedNode.remove();
                console.log("Đã xoá!");
              }
            });
          }
        });

        // Bắt đầu quan sát các thay đổi trong DOM
        observer.observe(reportTableElement, { childList: true });

        // Reset lại độ rộng của toàn bộ cột mỗi khi page length thay đổi
        $("#report-table").on("length.dt", function (e, settings, len) {
          // console.log('New page length: ' + len);
          var firstRow = $("#report-table tbody tr:first");

          firstRow.find("td").each(function () {
            $(this).css("width", "");
          });
        });

        // Đặt overflow auto thành scroll
        $(".dataTables_scrollBody").css("overflow", "scroll");

        // Xoá header duplicated từ colvis
        $(".buttons-colvis").on("click", function () {
          // console.log('Có vào đây không nhỉ? 1');
          // $('.buttons-columnVisibility').each(function () {
          $(".dt-button-collection button").each(function (colIndex) {
            $(this).on("click", function () {
              console.log("Vào: ", colIndex);
              $("#report-table thead").remove();

              // Scroll chuột header và table
              $(".dataTables_scrollHead").on("scroll", function () {
                var scrollLeft = $(this).scrollLeft();

                $(".dataTables_scrollBody").scrollLeft(scrollLeft);
              });

              $(".dataTables_scrollBody").on("scroll", function () {
                var scrollLeft = $(this).scrollLeft();

                $(".dataTables_scrollHead").scrollLeft(scrollLeft);
              });

              // Đặt này làm gì vậy ta?
              $(".dataTables_scrollHeadInner").css("width", "auto");
              $(".dataTables_scrollHead table").css("width", "auto");
              $(".dataTables_scrollHead table").css("overflow-y", "scroll");
              $(".dataTables_scrollHead table").css("overflow-x", "hidden");

              var firstRow = $("#report-table").find("tbody tr:first");

              // Xoá inline style của toàn bộ td trong tr đầu tiên
              firstRow.find("td").removeAttr("style");

              var index = activeColumnIndexes.indexOf(colIndex);

              // console.log("Hmmm: ", $('#report-table').width());

              $(".dataTables_scrollHead table").width(
                $("#report-table").width()
              );

              var theadColumns = $(".dataTables_scrollHead table thead tr th");

              // Lấy hàng đầu tiên trong tbody
              var firstRowTds = $("#report-table tbody tr:first-child td");

              // Lặp qua từng cột
              theadColumns.each(function (index, th) {
                // Lấy độ rộng của cột và thêm 16
                var headerInnerWidth = $(th).width();

                // Lấy ô tương ứng trong hàng đầu tiên của tbody và đặt min-width
                var targetTd = firstRowTds.eq(index);

                // Kiểm tra nếu targetTd và headerInnerWidth có giá trị hợp lý
                if (targetTd && headerInnerWidth) {
                  // Đặt giá trị min-width cho phần tử td với !important
                  targetTd.attr(
                    "style",
                    "min-width: " + headerInnerWidth + "px !important"
                  );
                } else {
                  console.error(
                    "Không thể đặt giá trị min-width. Kiểm tra giá trị của targetTd hoặc headerInnerWidth."
                  );
                }
              });

              // Đồng thời thực hiện ẩn/hiện ô dưa thừa của search và tổng cộng ở header
              if ($(this).hasClass("dt-button-active")) {
                console.log("Đang active");

                if (index == -1) {
                  // Nếu colIndex không tồn tại, thêm nó vào mảng và sắp xếp lại mảng
                  activeColumnIndexes.push(colIndex);
                  activeColumnIndexes.sort((a, b) => a - b); // Sắp xếp tăng dần
                }

                $(".dataTables_scrollHead table thead tr").each(function (
                  rowIndex
                ) {
                  // $(this).find('th').css('width', '138px');
                  if (
                    rowIndex == 1 ||
                    rowIndex == 2 ||
                    rowIndex == 3 ||
                    rowIndex == 4
                  ) {
                    // Hiển thị cột
                    $(this)
                      .find("th:eq(" + colIndex + ")")
                      .css("display", "table-cell");
                  } else if (rowIndex == 0) {
                    // $(this).find('th').css('width', '138px');
                  }
                });
              } else {
                console.log("Không active");

                isFirstColVis = false;

                if (index !== -1) {
                  activeColumnIndexes.splice(index, 1);
                }

                // $('#report-table').DataTable().draw();

                $(".dataTables_scrollHead table thead tr").each(function (
                  rowIndex
                ) {
                  // $(this).find('th').css('width', '138px');
                  if (
                    rowIndex == 1 ||
                    rowIndex == 2 ||
                    rowIndex == 3 ||
                    rowIndex == 4
                  ) {
                    // Ẩn cột
                    $(this)
                      .find("th:eq(" + colIndex + ")")
                      .css("display", "none");
                  } else if (rowIndex == 0) {
                    // $(this).find('th').css('width', '138px');
                  }
                });
              }
            });
          });
        });

        $("#report-table_length").css("margin-right", "1rem");

        $(".dataTables_scrollHead").css({
          "overflow-x": "hidden",
          "overflow-y": "scroll",
        });

        // Scroll chuột header và table
        $(".dataTables_scrollHead").on("scroll", function () {
          var scrollLeft = $(this).scrollLeft();

          $(".dataTables_scrollBody").scrollLeft(scrollLeft);
        });

        $(".dataTables_scrollBody").on("scroll", function () {
          var scrollLeft = $(this).scrollLeft();

          $(".dataTables_scrollHead").scrollLeft(scrollLeft);
        });
      } else {
        $("#report-result").fadeIn();
        $("#report-table tbody").html(
          '<tr id="no-data"><td colspan="24"><h5 class="text-warning text-center">Không Tìm Thấy Dữ Liệu Phù Hợp</h5></td></tr>'
        );
      }
    } else {
      $("#report-result").fadeIn();
      $("#report-table tbody").html(
        '<tr id="no-data"><td colspan="24"><h5 class="text-warning text-center">Không Tìm Thấy Dữ Liệu Phù Hợp</h5></td></tr>'
      );
    }
  });
  stopLoading();
} else {
  $.notify("Vui lòng lựa chọn ngày tháng.", "info", { position: "bottom" });
  return;
}
