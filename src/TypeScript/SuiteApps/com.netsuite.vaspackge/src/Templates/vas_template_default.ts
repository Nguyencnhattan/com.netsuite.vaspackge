/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType Suitelet
 */

import {
    EntryPoints
} from "N/types";
import * as runtime from "N/runtime";
import * as serverWidget from "N/ui/serverWidget";
import * as record from "N/record";
import * as search from "N/search";
import * as log from "N/log";
import {
    checkNotNull,
    runQuery
} from "../Include/constants.helper";
import {
    CUSTOM_RECORD_TYPE,
    VAS_DEFINE,
    VAS_DEFINE_PARAMETER
} from "../Include/constants.fieldid";
import {
    mergeHTML
} from "../Include/constants.html";
import * as config from "N/config"

export function onRequest(context: EntryPoints.Suitelet.onRequestContext): void {
    let getCurrentParam = runtime.getCurrentScript();
    let reportId = getCurrentParam.getParameter({
        name: 'custscript_report_define_id'
    });
    let cilentUrl = getCurrentParam.getParameter({
        name: 'custscript_report_client_url'
    });
    let reportRecord = record.load({
        id: reportId,
        type: CUSTOM_RECORD_TYPE.VAS_DEFINE,
    });
    if (context.request.method == 'GET') {
        let form = serverWidget.createForm({
            title: reportRecord.getValue({
                fieldId: VAS_DEFINE.REPORT_PAGE_NAME.FIELD_ID
            }) as string
        });
        if(cilentUrl){
            form.clientScriptModulePath = cilentUrl as string
        }else{
            form.clientScriptModulePath = '../Client/vas_template_client'
        }
       
       
        let listParams = reportRecord.getValue({
            fieldId: VAS_DEFINE.REPORT_PARAMETER.FIELD_ID
        }) as any
        let listSearchParams = search.create({
            type: CUSTOM_RECORD_TYPE.VAS_DEFINE_PARAMETER,
            filters:
            [
               ["internalid","anyof",listParams]
            ],
            columns:
            [
               search.createColumn({
                  name: VAS_DEFINE_PARAMETER.NAME.FIELD_ID,
                  label: VAS_DEFINE_PARAMETER.NAME.LABEL
               }),
               search.createColumn({
                name:  VAS_DEFINE_PARAMETER.DISPLAYNAME.FIELD_ID,
                label: VAS_DEFINE_PARAMETER.DISPLAYNAME.LABEL
             }),
               search.createColumn({name: VAS_DEFINE_PARAMETER.REQUIRE.FIELD_ID, label: VAS_DEFINE_PARAMETER.REQUIRE.LABEL}),
               search.createColumn({name: VAS_DEFINE_PARAMETER.CODE.FIELD_ID, label: VAS_DEFINE_PARAMETER.CODE.LABEL}),
               search.createColumn({name: VAS_DEFINE_PARAMETER.PARAMETER_TYPE.FIELD_ID, label: VAS_DEFINE_PARAMETER.PARAMETER_TYPE.LABEL}),
               search.createColumn({name: VAS_DEFINE_PARAMETER.SOURCE_SAVED_SEARCH.FIELD_ID, label: VAS_DEFINE_PARAMETER.SOURCE_SAVED_SEARCH.LABEL}),
               search.createColumn({name: VAS_DEFINE_PARAMETER.SOURCE_RECORD.FIELD_ID, label: VAS_DEFINE_PARAMETER.SOURCE_RECORD.LABEL}),
               search.createColumn({name: VAS_DEFINE_PARAMETER.SOURCE_SQL.FIELD_ID, label: VAS_DEFINE_PARAMETER.SOURCE_SQL.LABEL}),
               search.createColumn({name: VAS_DEFINE_PARAMETER.SOURCE_TYPE.FIELD_ID, label: VAS_DEFINE_PARAMETER.SOURCE_TYPE.LABEL}),
               search.createColumn({
                name: VAS_DEFINE_PARAMETER.ORDINAL_NUMBER.FIELD_ID,
                sort: search.Sort.ASC,
                label: VAS_DEFINE_PARAMETER.ORDINAL_NUMBER.LABEL
             })
            ]
         });
         let count = 0
         listSearchParams.run().each(function(result){
            count++
            let newField = null
            let name = result.getValue(VAS_DEFINE_PARAMETER.DISPLAYNAME.FIELD_ID) as any
            let require = result.getValue(VAS_DEFINE_PARAMETER.REQUIRE.FIELD_ID) as any
            let sql =result.getValue(VAS_DEFINE_PARAMETER.SOURCE_SQL.FIELD_ID) as any
            let listRecord =result.getValue(VAS_DEFINE_PARAMETER.SOURCE_RECORD.FIELD_ID) as any
            let listSearch = result.getValue(VAS_DEFINE_PARAMETER.SOURCE_SAVED_SEARCH.FIELD_ID) as any
            let type = result.getText(VAS_DEFINE_PARAMETER.PARAMETER_TYPE.FIELD_ID) as any
            let sourceType = result.getValue(VAS_DEFINE_PARAMETER.SOURCE_TYPE.FIELD_ID) as any
            let code = result.getValue(VAS_DEFINE_PARAMETER.CODE.FIELD_ID) as any
            if (checkNotNull(sourceType)) {
                switch (Number(sourceType)) {
                    case 1:
                        const resultSql = runQuery(sql) as unknown as Array < object > ;
                        newField = form.addField({
                            id: 'custpage_' + code.toLowerCase(),
                            type: type,
                            label: name,
                        });
                        newField.addSelectOption({
                            value: '-1',
                            text: ''
                        });
                        for (let i = 0; i < resultSql.length; i++) {
                            newField.addSelectOption({
                                value: resultSql[i]['id'],
                                text: resultSql[i]['name']
                            });
                        }
                        break;
                    case 2:
                        newField = form.addField({
                            id: 'custpage_' + code.toLowerCase(),
                            type: type,
                            label: name,
                            source: listSearch
                        });
                        break;
                    case 3:
                        newField = form.addField({
                            id: 'custpage_' + code.toLowerCase(),
                            type: type,
                            label: name,
                            source: listRecord
                        });

                        break;
                }
            } else {
                newField = form.addField({
                    id: 'custpage_' + code.toLowerCase(),
                    type: type,
                    label: name
                });
            }
           
           
            if (require == true) {
                newField.isMandatory = true;
            }
            if(count == 2){
                newField.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTCOL
                });
                count = 0;
            }
            return true;
         });
        for (let i = 0; i < listParams.length; i++) {
         
        }
        const info = config.load({
            type: config.Type.COMPANY_INFORMATION
        });
        let companyName = form.addField({
            id: 'custpage_companyname',
            type: serverWidget.FieldType.TEXT,
            label: 'companyName'
        });
        companyName.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        companyName.defaultValue = info.getValue({
            fieldId: 'companyname'
        }) as any;

        let companyTaxNo = form.addField({
            id: 'custpage_companytaxno',
            type: serverWidget.FieldType.TEXT,
            label: 'companyTaxNo',

        });
        companyTaxNo.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        companyTaxNo.defaultValue = info.getValue({
            fieldId: 'employerid'
        }) as any;

        let companyAddress = form.addField({
            id: 'custpage_companyaddress',
            type: serverWidget.FieldType.TEXT,
            label: 'companyAddress'
        });
        companyAddress.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        companyAddress.defaultValue = info.getValue({
            fieldId: 'returnaddress_text'
        }) as any;

        let vasIdField = form.addField({
            id: 'custpage_vas_id',
            label: 'Vas define',
            type: serverWidget.FieldType.SELECT,
            source:'CUSTOMRECORD_VAS_DEFINE'
        }).updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        })
       
        vasIdField.defaultValue = reportId as string;
        var html = form.addField({
            id: 'custpage_html_vas',
            label: 'field disappear',
            type: serverWidget.FieldType.INLINEHTML,
        });

        html.defaultValue = mergeHTML()
        form.addButton({
            id: 'runReport',
            label: 'Tải Báo Cáo',
            functionName: `runReport(${reportId})`
        });

        form.addButton({
            id: 'exportExcel',
            label: 'Xuất Excel',
            functionName: `exportExcel(${reportId})`,
        });
        context.response.writePage(form);
    }
}