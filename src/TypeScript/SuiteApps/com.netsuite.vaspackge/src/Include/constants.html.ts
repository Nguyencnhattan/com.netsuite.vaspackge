import * as record from "N/record"
import * as query from "N/query"
import * as currentRecord from "N/currentRecord"
import {
    CUSTOM_RECORD_TYPE,
    VAS_DEFINE
} from "./constants.fieldid";
import {
    checkNotNull
} from "./constants.helper";

export const mergeHTML = () => {
    let html = `
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <script src="https://code.iconify.design/3/3.1.0/iconify.min.js"></script>

    <script src="/ui/jquery/jquery-3.5.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js"></script>
    ${jsFunctionNotificationLib()}
    ${jsFunctionDataTablesExternals()}
 
    <style type = "text/css"> 
    #overlay{	
        position: fixed;
        top: 0;
        z-index: 100;
        width: 100%;
        height:100%;
        display: none;
        background: rgba(0,0,0,0.6);
    }

    .cv-spinner {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;  
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px #ddd solid;
        border-top: 4px #2e93e6 solid;
        border-radius: 50%;
        animation: sp-anime 0.8s infinite linear;
    }

    @keyframes sp-anime {
        100% { 
        transform: rotate(360deg); 
        }
    }

    .is-hide{
        display:none;
    }

    input[type="text"], input[type="search"], textarea, button {
        outline: none;
        box-shadow:none !important;
        border: 1px solid #ccc !important;
    }
    
    p, pre {
        font-size: 10pt;
    }
    
    td, th { 
        font-size: 10pt;
        border: 3px;
    }
    
    th {
        font-weight: bold;				
    }

    .preserve-whitespace {
        white-space: pre-wrap;
    }
    .sorting, .sorting_asc, .sorting_desc {
        background : none;
    }
    
</style>
<div id="resultsDiv" style="max-width: 100%; margin-top: 20px; overflow: auto; overflow-y: hidden;">
</div>  
`
   return html
}

export const bodyHTML = (customReportId: any) => {
    let reportRecord = record.load({
        id: customReportId,
        type: CUSTOM_RECORD_TYPE.VAS_DEFINE
    })
    let crr = currentRecord.get()

    const companyName = crr.getValue({
        fieldId: 'custpage_companyname'
    })
    const companyTaxNo = crr.getValue({
        fieldId: 'custpage_companytaxno'
    })
    const companyAddress = crr.getValue({
        fieldId: 'custpage_companyaddress'
    })

    let fromDate = jQuery('#custpage_p_from_date').val()
    let toDate = jQuery('#custpage_p_to_date').val()
    let body = `
        <table id="report-result" style="table-layout: fixed; width: 100%; border-spacing: 0px; border-collapse: separate;">
            <tr>
                <td colspan="2" style="vertical-align: top; overflow-x: scroll; border: 1.5px solid #000; padding: 1rem;">
                    <section id="report-header" class="d-flex flex-column">
                    <div id="report-information">
                    <div id="company-info" style="float: left;">
                    <p><b>Tên đơn vị: </b> ${companyName} </p>
                    <p><b>Địa chỉ: </b> ${companyAddress}</p>
                    <p><b>MST: </b> ${companyTaxNo} </p>
                    </div>
                    <div id="circular-info" style="float: right; text-align: right">
                    <p><b>Mẫu số ${reportRecord.getValue({ fieldId: VAS_DEFINE.REPORT_PATTERN.FIELD_ID })} </b></p>
                    <p>${reportRecord.getValue({ fieldId: VAS_DEFINE.REPORT_CIRCULAR.FIELD_ID })}</p>
                    </div>
                </div>
                        <div id="report-title" style="max-width: 400px; place-self: center;">
                            <h1 id="report-title-text" class="text-center" style="text-transform: uppercase">${reportRecord.getValue({ fieldId: VAS_DEFINE.REPORT_TITLE.FIELD_ID })}</h1>
                            <p id="report-sub-title" class="text-center">${reportRecord.getValue({ fieldId: VAS_DEFINE.REPORT_SUB_TITLE.FIELD_ID })}</p>`
    if (checkNotNull(fromDate) && checkNotNull(toDate)) {
        body += `<p id="period-section" class="text-center">Từ ngày <span id="from_date_title">${fromDate}</span> đến ngày <span id="to_date_title">${toDate}</span> </p>`
    } else if (!checkNotNull(fromDate) && checkNotNull(toDate)) {
        body += `  <p id="moment-section" class="text-center"">Tại thời điểm <span id="moment_date_title">${toDate}</span> </p>`
    }
    body += `           </div>
                    </section>
                    <section id="report-content">
                    <table id="report-table" style="margin-top: 10px; width: 100% !important;" class="display table-sm table-bordered table-hover table-responsive-sm table-striped">
                   
                            <thead> <tr>`
    let lineColumn = reportRecord.getLineCount({
        sublistId: 'recmachcustrecord_vas_column_define'
    })
    for (let i = 0; i < lineColumn; i++) {
        body += ` <th scope="col" class="text-center align-middle">${reportRecord.getSublistValue({ sublistId: 'recmachcustrecord_vas_column_define', fieldId: 'name', line: i })}</th>`
    }
    body += `</tr></thead>
    </table>
                    </section>
                    </td>
                </tr>
                </table>
                
            `;
    return body
}

function jsFunctionNotificationLib() {
    return `
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/styles/metro/notify-metro.min.css">
        <script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js"></script>		
    `;
}

function jsFunctionDataTablesExternals() {
    return `
    <link rel="stylesheet" href="https://cdn.datatables.net/2.0.3/css/dataTables.dataTables.css" />
    <script src="https://cdn.datatables.net/2.0.3/js/dataTables.js"></script>
        `;

}