export const VAS_DEFINE: {
    [key: string | symbol]: {
        LABEL: string,
        FIELD_ID: string
    }
} = {
    NAME: {
        LABEL: 'NAME',
        FIELD_ID: 'name'
    },
    REPORT_NAME: {
        LABEL: 'REPORT NAME',
        FIELD_ID: 'custrecord_vas_define_report_name'
    },
    REPORT_PATTERN: {
        LABEL: 'NAME',
        FIELD_ID: 'custrecord_vas_define_report_pattern'
    },
    REPORT_PAGE_NAME: {
        LABEL: 'REPORT PAGE NAME',
        FIELD_ID: 'custrecord_vas_define_page_name'
    },
    REPORT_TITLE: {
        LABEL: 'REPORT TITLE',
        FIELD_ID: 'custrecord_vas_define_report_title'
    },
    REPORT_SUB_TITLE: {
        LABEL: 'REPORT SUB TITLE',
        FIELD_ID: 'custrecord_vas_define_rpt_subtitle'
    },
    REPORT_CIRCULAR: {
        LABEL: 'REPORT CIRCULAR',
        FIELD_ID: 'custrecord_vas_define_report_circula'
    },
    REPORT_PARAMETER: {
        LABEL: 'REPORT PARAMETER',
        FIELD_ID: 'custrecord_vas_report_parameter'
    },
}

export const VAS_DEFINE_PARAMETER: {
    [key: string | symbol]: {
        LABEL: string,
        FIELD_ID: string
    }
} = {
    NAME: {
        LABEL: 'NAME',
        FIELD_ID: 'name'
    },
    DISPLAYNAME: {
        LABEL: 'DISPLAYNAME',
        FIELD_ID: 'custrecord_param_display_name'
    },
    REQUIRE: {
        LABEL: 'REQUIRE',
        FIELD_ID: 'custrecord_param_is_required'
    },
    CODE: {
        LABEL: 'CODE',
        FIELD_ID: 'custrecord_param_code'
    },
    PARAMETER_TYPE: {
        LABEL: 'PARAMETER TYPE',
        FIELD_ID: 'custrecord_param_type'
    },
    SOURCE_SAVED_SEARCH: {
        LABEL: 'SOURCE SAVED SEARCH',
        FIELD_ID: 'custrecord_param_save_search'
    },
    SOURCE_RECORD: {
        LABEL: 'SOURCE RECORD',
        FIELD_ID: 'custrecord_param_source_record'
    },
    SOURCE_SQL: {
        LABEL: 'SOURCE SQL',
        FIELD_ID: 'custrecord_param_source_sql'
    },
    SOURCE_TYPE: {
        LABEL: 'SOURCE TYPE',
        FIELD_ID: 'custrecord_param_source_type'
    },
    ORDINAL_NUMBER: {
        LABEL: 'Ordinal number',
        FIELD_ID: 'custrecord_params_ordinal_number'
    },
}
export const VAS_DEFINE_COLUMNS: {
    [key: string | symbol]: {
        LABEL: string,
        FIELD_ID: string
    }
} = {
    NAME: {
        LABEL: 'NAME',
        FIELD_ID: 'name'
    },
    KEY: {
        LABEL: 'KEY',
        FIELD_ID: 'custrecord_vas_column_key'
    },
}

export const CUSTOM_RECORD_TYPE = {
    VAS_DEFINE : 'customrecord_vas_define',
    VAS_DEFINE_PARAMETER: 'customrecord_vas_define_parameter'
}