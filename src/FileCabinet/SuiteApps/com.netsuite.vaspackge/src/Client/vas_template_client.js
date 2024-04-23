/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType ClientScript
 */
define(["require", "exports", "../Include/constants.html", "N/currentRecord", "N/record", "N/log", "N/search", "N/https", "N/url", "../Libraries/exceljs.min", "../Include/constants.helper", "../Include/constants.fieldid"], function (require, exports, constants_html_1, currentRecord, record, log, search, https, url, ExcelJS, constants_helper_1, constants_fieldid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.exportExcel = exports.runReport = exports.getLastDayOfMonth = exports.getFirstDayOfMonth = exports.pageInit = void 0;
    function pageInit(context) {
        var divToMove = $('div[data-walkthrough="Field:custpage_html_vas"]');
        var newTr = $('<tr></tr>');
        var closestTr = divToMove.closest('table').closest('tr');
        newTr.append($('<td colspan="2"></td>').append(divToMove));
        closestTr.after(newTr);
        var customCSS = '<style>#report-table tbody tr td { min-width: 176px !important; }</style>';
        $('head').append(customCSS);
        $('body').css('position', 'relative');
        var overlay = $('<div id="overlay"><div class="cv-spinner"><span class="spinner"></span></div></div>');
        overlay.hide();
        $('body').append(overlay);
    }
    exports.pageInit = pageInit;
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };
    exports.getFirstDayOfMonth = getFirstDayOfMonth;
    const getLastDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };
    exports.getLastDayOfMonth = getLastDayOfMonth;
    var data = null;
    var test = [{
            'co_dau_ky': 1,
            'du_co_cuoi_ky': 2,
            'du_no_cuoi_ky': 3,
            'no_dau_ky': 4,
            'phat_sinh_co': 5,
            'phat_sinh_no': 6,
            'account': 7,
            'account_name': 8,
            'bold': true
        }];
    const runReport = (reportId) => {
        try {
            var overlay = $('#overlay');
            let checkParams = true;
            let reportRecord = record.load({
                id: reportId,
                type: constants_fieldid_1.CUSTOM_RECORD_TYPE.VAS_DEFINE,
            });
            let listParams = reportRecord.getValue({
                fieldId: constants_fieldid_1.VAS_DEFINE.REPORT_PARAMETER.FIELD_ID
            });
            let obj = { 'vasName': reportRecord.getValue({ fieldId: constants_fieldid_1.VAS_DEFINE.NAME.FIELD_ID }) };
            search.create({
                type: constants_fieldid_1.CUSTOM_RECORD_TYPE.VAS_DEFINE_PARAMETER,
                filters: [
                    ["internalid", "anyof", listParams]
                ],
                columns: [
                    search.createColumn({ name: constants_fieldid_1.VAS_DEFINE_PARAMETER.CODE.FIELD_ID, label: constants_fieldid_1.VAS_DEFINE_PARAMETER.CODE.LABEL }),
                    search.createColumn({ name: constants_fieldid_1.VAS_DEFINE_PARAMETER.REQUIRE.FIELD_ID, label: constants_fieldid_1.VAS_DEFINE_PARAMETER.REQUIRE.LABEL }),
                    search.createColumn({ name: constants_fieldid_1.VAS_DEFINE_PARAMETER.DISPLAYNAME.FIELD_ID, label: constants_fieldid_1.VAS_DEFINE_PARAMETER.DISPLAYNAME.LABEL }),
                ]
            }).run().each(function (results) {
                let valueP = currentRecord.get().getValue({ fieldId: "custpage_" + results.getValue(constants_fieldid_1.VAS_DEFINE_PARAMETER.CODE.FIELD_ID) });
                if (results.getValue(constants_fieldid_1.VAS_DEFINE_PARAMETER.REQUIRE.FIELD_ID) == true && (!(0, constants_helper_1.checkNotNull)(valueP) || valueP == -1)) {
                    //@ts-ignore
                    $.notify('Vui lòng nhập thông tin ' + results.getValue(constants_fieldid_1.VAS_DEFINE_PARAMETER.DISPLAYNAME.FIELD_ID), 'info', { position: 'bottom' });
                    checkParams = false;
                }
                obj[results.getValue(constants_fieldid_1.VAS_DEFINE_PARAMETER.CODE.FIELD_ID).toString()] = currentRecord.get().getValue({ fieldId: "custpage_" + results.getValue(constants_fieldid_1.VAS_DEFINE_PARAMETER.CODE.FIELD_ID) });
                return true;
            });
            if (checkParams) {
                data = JSON.parse(https.get({
                    url: url.format({
                        domain: url.resolveScript({ deploymentId: 'customdeploy_vas_rl_data_01', scriptId: 'customscript_vas_rl_data_01' }),
                        params: obj,
                    })
                }).body);
                console.log(data)
                let columns = [];
                let listColumsCount = reportRecord.getLineCount({ sublistId: 'recmachcustrecord_vas_column_define' });
                for (let i = 0; i < listColumsCount; i++) {
                    columns.push({ data: reportRecord.getSublistValue({ sublistId: 'recmachcustrecord_vas_column_define', fieldId: constants_fieldid_1.VAS_DEFINE_COLUMNS.KEY.FIELD_ID, line: i }) });
                }
                overlay.fadeIn(300, function () {
                    let html = (0, constants_html_1.bodyHTML)(reportId);
                    $("#resultsDiv").html(html);
                    $("#report-result").fadeIn();
                    if (data.length) {
                        //@ts-ignore
                        $('#report-table').DataTable({
                            data: data,
                            ordering: true,
                            order: [],
                            columns: columns,
                            paging: true,
                            deferRender: true,
                            scrollCollapse: true,
                            scroller: true,
                            scrollY: 800,
                            scrollX: true,
                            createdRow: function (row, data, index) {
                                if ((0, constants_helper_1.checkNotNull)(data['bold'])) {
                                    if (data['bold'] == true) {
                                        $(row).css({
                                            'font-weight': 'bold',
                                            color: '#000000'
                                        });
                                    }
                                }
                            }
                        });
                    }
                    else {
                        $('#report-table').html('<tbody><tr id="no-data"><td colspan="24"><h5 class="text-warning text-center">Không Tìm Thấy Dữ Liệu Phù Hợp</h5></td></tr></tbody>');
                    }
                });
            }
            (0, constants_helper_1.stopLoading)();
        }
        catch (e) {
            // libError.handleError(e);
            console.log(e);
        }
    };
    exports.runReport = runReport;
    const exportExcel = (reportId) => {
        var headers = [];
        let reportRecord = record.load({
            id: reportId,
            type: constants_fieldid_1.CUSTOM_RECORD_TYPE.VAS_DEFINE,
        });
        let listColumsCount = reportRecord.getLineCount({ sublistId: 'recmachcustrecord_vas_column_define' });
        for (let i = 0; i < listColumsCount; i++) {
            headers.push(reportRecord.getSublistValue({ sublistId: 'recmachcustrecord_vas_column_define', fieldId: constants_fieldid_1.VAS_DEFINE_COLUMNS.name.FIELD_ID, line: i }));
        }
        var wb = new ExcelJS.Workbook();
        var ws = wb.addWorksheet('test', {
            views: [{
                    showGridLines: false
                }]
        });
        var columns = headers.length;
        var report_pattern = 'Mẫu số ' + reportRecord.getValue({ fieldId: constants_fieldid_1.VAS_DEFINE.REPORT_PATTERN.FIELD_ID });
        // report = report.toUpperCase();
        var widths = [{
                width: 50
            }, {
                width: 10
            }, {
                width: 20
            }, {
                width: 20
            }, {
                width: 20
            }];
        var title = {
            // border : true,
            money: false,
            height: 30,
            font: {
                name: 'Times New Roman',
                size: 16,
                bold: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: 'FFFFFF',
                },
            },
        };
        var header = {
            border: true,
            money: false,
            height: 30,
            font: {
                name: 'Times New Roman',
                size: 11,
                bold: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'bottom'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: 'DDDDDD',
                },
            },
        };
        var header1 = {
            border: true,
            money: false,
            height: 20,
            font: {
                name: 'Times New Roman',
                size: 11,
                bold: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'bottom'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: 'DDDDDD',
                },
            },
        };
        var data = {
            border: true,
            money: true,
            height: 0,
            font: {
                name: 'Times New Roman',
                size: 12,
                bold: false,
                color: {
                    argb: '000000'
                }
            },
            alignment: null,
            fill: null,
        };
        var footer = {
            border: true,
            money: true,
            height: 10,
            font: {
                name: 'Times New Roman',
                size: 15,
                bold: true,
                color: {
                    argb: 'FFFFFF'
                }
            },
            alignment: null,
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: '0000FF',
                },
            },
        };
        if (widths && widths.length > 0) {
            ws.columns = widths;
        }
        var row;
        // = addRow(ws, [ report ], title);
        // mergeCells(ws, row, 5, 6);
        var title1 = {
            money: false,
            height: 20,
            font: {
                name: 'Times New Roman',
                size: 11,
                italic: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: 'FFFFFF',
                },
            },
        };
        var title2 = {
            money: false,
            height: 20,
            font: {
                name: 'Times New Roman',
                bold: true,
                size: 10,
                italic: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: 'FFFFFF',
                },
            },
        };
        var title3 = {
            money: false,
            height: 20,
            font: {
                name: 'Times New Roman',
                size: 11,
                bold: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'left',
                vertical: 'middle'
            },
            fill: null,
        };
        var title4 = {
            money: false,
            height: 10,
            font: {
                name: 'Times New Roman',
                size: 9,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid', // darkVertical
                fgColor: {
                    argb: 'FFFFFF',
                },
            },
        };
        ws.getCell('A1').alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };
        ws.getCell('A1').font = title4.font;
        ws.getCell('A1').value = currentRecord.get().getValue({
            fieldId: 'custpage_companyname'
        });
        ws.getCell('A2').alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };
        // const companyLogo = crr.getValue({fieldId: 'custpage_companyName'})
        ws.getCell('A2').font = title4.font;
        ws.getCell('A2').value = currentRecord.get().getValue({
            fieldId: 'custpage_companyaddress'
        });
        //tax code
        ws.getCell('A3').font = title4.font;
        ws.getCell('A3').value = currentRecord.get().getValue({
            fieldId: 'custpage_companytaxno'
        });
        //
        ws.mergeCells('E1:F1');
        ws.getCell('E1').value = report;
        ws.getCell('F1').value = {
            richText: [{
                    text: 'Mẫu số '
                }, {
                    font: {
                        bold: true
                    },
                    text: 'B02'
                }, {
                    text: '– DN'
                },]
        };
        ws.getCell('E1').alignment = title4.alignment;
        ws.getCell('E1').font = title4.font;
        ws.mergeCells('E2:F2');
        ws.getCell('E2').value = "(Ban hành theo Thông tư số 200 /2014/TT-BTC";
        ws.getCell('E2').alignment = title4.alignment;
        ws.getCell('E2').font = title4.font;
        ws.mergeCells('E3:F3');
        ws.getCell('E3').value = "Ngày 22/12/2014 của Bộ Tài chính)";
        ws.getCell('E3').alignment = title4.alignment;
        ws.getCell('E3').font = title4.font;
        ws.mergeCells('A5:E5');
        ws.getCell('A5').value = "BẢNG CÂN ĐỐI KẾ TOÁN";
        ws.getCell('A5').alignment = title.alignment;
        ws.getCell('A5').font = title.font;
        ws.mergeCells('A6:E6');
        ws.getCell('A6').value = `TẠI THỜI ĐIỂM ${jQuery('#custpage_p_at_date').val()}`;
        ws.getCell('A6').alignment = title2.alignment;
        ws.getCell('A6').font = title2.font;
        // ws.mergeCells('A8:E8');
        // ws.getCell('A8').value = "Đơn vị tính: VNĐ";
        // ws.getCell('A8').alignment = {
        //   horizontal: 'right',
        //   vertical: 'middle'
        // };
        // ws.getCell('A8').font = {
        //   size: 11,
        //   // bold : true,
        //   name: 'Times New Roman',
        //   color: {
        //     argb: '000000'
        //   }
        // };
        // row = addRow(ws, [ "" ], "");
        addRow(ws, headers, header);
        // var cell = ws.getCell('A12');
        var array = ["(1)", "(2)", "(3)", "(4)", "(5)", "(6)"];
        // for (var i = 0; i < columns; i++) {
        // array.push(i);
        // }
        addRow(ws, array, header1);
        //var arrNegetiveMaso =["21","22","32","51","52"];
        content.forEach(function (row) {
            // addRow(ws, Object.values(row), data);
            // if(arrNegetiveMaso.indexOf(row.ma_so)!=-1){
            // 	row.so_dau_ky =row.so_dau_ky *-1;
            // 	row.so_dau_nam =row.so_dau_nam *-1;
            // }
            addRowDetail_CDKT(ws, row, data);
        });
        for (var i = 0; i < content.length; i++) {
            ws.getCell("A" + (15 + i)).numFmt = '0';
        }
        log.debug("content", content);
        // ws.mergeCells('A' + (content.length + 21) + ':B' + (content.length + 21));
        ws.getCell('A' + (content.length + 13)).value = "NGƯỜI LẬP BIỂU";
        ws.getCell('A' + (content.length + 13)).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
        ws.getCell('A' + (content.length + 13)).font = {
            size: 11,
            bold: true,
            name: "Times New Roman",
            color: {
                argb: '000000'
            }
        };
        // ws.mergeCells('A' + (content.length + 22) + ':B' + (content.length + 22));
        ws.getCell('A' + (content.length + 14)).value = "(Ký, ghi rõ họ tên)";
        ws.getCell('A' + (content.length + 14)).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
        ws.getCell('A' + (content.length + 14)).font = {
            size: 10,
            italic: true,
            name: "Times New Roman",
            color: {
                argb: '000000'
            }
        };
        ws.mergeCells('D' + (content.length + 13) + ':E' + (content.length + 13));
        ws.getCell('D' + (content.length + 13)).value = "KẾ TOÁN TRUỞNG";
        ws.getCell('D' + (content.length + 13)).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
        ws.getCell('D' + (content.length + 13)).font = {
            size: 11,
            bold: true,
            name: "Times New Roman",
            color: {
                argb: '000000'
            }
        };
        ws.mergeCells('D' + (content.length + 14) + ':E' + (content.length + 14));
        ws.getCell('D' + (content.length + 14)).value = "(Ký, họ tên)";
        ws.getCell('D' + (content.length + 14)).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
        ws.getCell('D' + (content.length + 14)).font = {
            size: 10,
            italic: true,
            name: "Times New Roman",
            color: {
                argb: '000000'
            }
        };
        var footer1 = {
            money: false,
            height: 20,
            font: {
                name: 'Times New Roman',
                size: 11,
                bold: true,
                color: {
                    argb: '000000'
                }
            },
            alignment: {
                horizontal: 'left',
                vertical: 'middle'
            },
            fill: null,
        };
        var buf = wb.xlsx.writeBuffer();
        buf.then(function (buf) {
            //@ts-ignore
            saveAs(new Blob([buf]), 'Bảng cân đối kế toán.xlsx');
        });
    };
    exports.exportExcel = exportExcel;
    function excelBCDKT(content) {
    }
    function addRow(ws, data, section) {
        const borderStyles = {
            top: {
                style: 'thin'
            },
            left: {
                style: 'thin'
            },
            bottom: {
                style: 'thin'
            },
            right: {
                style: 'thin'
            },
        };
        const row = ws.addRow(data);
        row.eachCell({
            includeEmpty: true
        }, function (cell, colNumber) {
            if (section.border) {
                cell.border = borderStyles;
            }
            if (section.money && typeof cell.value === 'number') {
                cell.alignment = {
                    horizontal: 'right',
                    vertical: 'middle'
                };
                cell.numFmt = '$#,##0.00;[Red]-$#,##0.00';
            }
            if (section.alignment) {
                cell.alignment = section.alignment;
            }
            else {
                cell.alignment = {
                    vertical: 'middle'
                };
            }
            if (section.font) {
                cell.font = section.font;
            }
            if (section.fill) {
                cell.fill = section.fill;
            }
        });
        if (section.height > 0) {
            row.height = section.height;
        }
        return row;
    }
    function addRowDetail_CDKT(ws, data, section) {
        const borderStyles = {
            top: {
                style: 'thin'
            },
            left: {
                style: 'thin'
            },
            bottom: {
                style: 'thin'
            },
            right: {
                style: 'thin'
            },
        };
        const row = ws.addRow([data.tai_san, data.chitieu2, data.ma_so, data.thuyet_minh, data.so_cuoi_ky, data.so_dau_nam]);
        row.eachCell({
            includeEmpty: true
        }, function (cell, colNumber) {
            if (section.border) {
                cell.border = borderStyles;
            }
            if (section.money && typeof cell.value === 'number') {
                cell.alignment = {
                    horizontal: 'right',
                    vertical: 'middle'
                };
                cell.numFmt = '#,##0;[Red](#,##0)';
            }
            if (section.alignment) {
                cell.alignment = section.alignment;
            }
            else {
                cell.alignment = {
                    vertical: 'middle'
                };
            }
            if (colNumber == 3) {
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                };
            }
            if (section.font) {
                cell.font = section.font;
                cell.font = {
                    name: 'Times New Roman',
                    size: 11,
                    bold: data.bold == 'true' ? true : false,
                    italic: data.italic == 'true' ? true : false,
                };
            }
            if (section.fill) {
                cell.fill = section.fill;
            }
        });
        if (section.height > 0) {
            row.height = section.height;
        }
        return row;
    }
});
