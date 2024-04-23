/**
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType Restlet
 */

import { EntryPoints } from "N/types";
import * as log from "N/log"
import * as query from "N/query"
import { calculateSummary, createNestedStructure, flattenTree, formatNumberWithCommas, getDDMMYYYY } from "../Include/constants.helper";

export function get(context: EntryPoints.RESTlet.get) {
  log.debug('context', context);
  switch (context.vasName) {
    case 'VAS-01: Trial Balance':
      const vfromDate2 = getDDMMYYYY(context.P_FROM_DATE);
      const vtoDate2 = getDDMMYYYY(context.P_TO_DATE);
      const accountLevel = Number(context.P_LEVEL);
      var resultObject = {};
      var reportData, outputTrialBalance, trialBalance;
      var totalSummary;
      var nestedSQL, paginatedSQL, queryResults;
      var moreRecords = true;
      var records = [];
      var queryParams = [];
      var paginatedRowBegin = 1;
      var paginatedRowEnd = 999999;
      nestedSQL = `
SELECT 
* 
FROM 
(
(
SELECT 
* 
FROM 
(
(
SELECT 
t1.acctnumber,
t1.accountname,
NVL(t0.obdebit,0) obdebit,
 NVL( t0.obcredit,0) obcredit,
 NVL(  t0.debit,0) debit ,
 NVL(   t0.credit,0) credit,
NVL(	 t0.ebdebit,0) ebdebit,
    NVL( t0.ebcredit,0) ebcredit,
t1.parent, 
t1.parentname, 
t1.note, 
0 AS type 
FROM 
(
SELECT 
t0.acctnumber acctnumber,
t0.accountsearchdisplaynamecopy accountname,
t1.acctnumber parent, 
t1.accountsearchdisplaynamecopy parentname, 
CASE WHEN t1.acctnumber IS NULL THEN 'first' WHEN t2.acctnumber IS NULL THEN 'last' ELSE 'mid' END AS note 
FROM 
account t0 
LEFT JOIN account t1 ON t0.parent = t1.id 
LEFT JOIN account t2 ON t2.parent = t0.id
Group by t0.acctnumber,
t0.accountsearchdisplaynamecopy, 
 t1.acctnumber, 
t1.accountsearchdisplaynamecopy, CASE WHEN t1.acctnumber IS NULL THEN 'first' WHEN t2.acctnumber IS NULL THEN 'last' ELSE 'mid' END
) t1 
LEFT JOIN (
SELECT 
  acctnumber, 
  accountsearchdisplaynamecopy accountname, 
  case when acctnumber = '999900' then case when Sum(obdebit) > 0 then Sum(obdebit) else 0 end else Sum(obdebit) end OBdebit, 
  case when acctnumber = '999900' then case when Sum(obcredit) < 0 then abs(
      Sum(obcredit)
  ) else 0 end else Sum(obcredit) end OBcredit, 
  Sum(indebit) debit, 
  Sum(incredit) credit, 
  case when acctnumber = '999900' then CASE WHEN Sum(indebit) + case when acctnumber = '999900' then case when Sum(obdebit) > 0 then Sum(obdebit) else 0 end else Sum(obdebit) end - Sum(incredit) - case when acctnumber = '999900' then case when Sum(obcredit) < 0 then abs(
      Sum(obcredit)
  ) else 0 end else Sum(obcredit) end < 0 then 0 else Sum(indebit) + case when acctnumber = '999900' then case when Sum(obdebit) > 0 then Sum(obdebit) else 0 end else Sum(obdebit) end - Sum(incredit) - case when acctnumber = '999900' then case when Sum(obcredit) < 0 then abs(
      Sum(obcredit)
  ) else 0 end else Sum(obcredit) end end else case when Sum(ebdebit) = 0 then case when Sum(indebit) + Sum(obdebit) - Sum(incredit) - Sum(obcredit) < 0 then 0 else Sum(indebit) + Sum(obdebit) - Sum(incredit) - Sum(obcredit) end else Sum(ebdebit) end end ebdebit, 
  case when acctnumber = '999900' then CASE WHEN Sum(incredit) + case when acctnumber = '999900' then case when Sum(obcredit) < 0 then abs(
      Sum(obcredit)
  ) else 0 end else Sum(obcredit) end - Sum(indebit) - case when acctnumber = '999900' then case when Sum(obdebit) > 0 then Sum(obdebit) else 0 end else Sum(obdebit) end < 0 then 0 else Sum(incredit) + case when acctnumber = '999900' then case when Sum(obcredit) < 0 then abs(
      Sum(obcredit)
  ) else 0 end else Sum(obcredit) end - Sum(indebit) - case when acctnumber = '999900' then case when Sum(obdebit) > 0 then Sum(obdebit) else 0 end else Sum(obdebit) end end else case when sum(ebcredit) = 0 then case when Sum(incredit) + Sum(obcredit) - Sum(indebit) - Sum(obdebit) < 0 then 0 else Sum(incredit) + Sum(obcredit) - Sum(indebit) - Sum(obdebit) end else sum(ebcredit) end end ebcredit, 
  -- sum(ebdebit)ebdebit,
  --  sum(ebcredit) ebcredit
FROM 
(
  select 
      *, 
      CASE WHEN (
          acctnumber LIKE '131%' 
          OR acctnumber LIKE '1381%' 
          OR acctnumber LIKE '1388%' 
          OR acctnumber LIKE '331%' 
          OR acctnumber LIKE '333%' 
          OR acctnumber LIKE '334%' 
          OR acctnumber LIKE '3388%'
          OR acctnumber LIKE '421%' 
      ) THEN CASE WHEN obdebit + indebit - incredit - obcredit < 0 THEN 0 ELSE obdebit + indebit - incredit - obcredit END else 0 end ebdebit, 
      CASE WHEN (
          acctnumber like '131%' 
          OR acctnumber LIKE '1381%'
          OR acctnumber LIKE '1388%' 
          OR acctnumber LIKE '331%' 
          OR acctnumber LIKE '333%' 
          OR acctnumber LIKE '334%' 
          OR acctnumber LIKE '3388%'
          OR acctnumber LIKE '421%' 
      ) THEN CASE WHEN obcredit + incredit - indebit - obdebit < 0 THEN 0 ELSE obcredit + incredit - indebit - obdebit END else 0 end ebcredit 
  FROM 
  (
      (
      SELECT 
          t3.acctnumber, 
          t3.accountsearchdisplaynamecopy, 
          NVL(t1.debit, 0) as indebit, 
          NVL(t1.credit, 0) as incredit, 
          0 AS obdebit, 
          0 AS obcredit 
      FROM 
          transactionline t0 
          JOIN TransactionAccountingLine t1 ON t0.transaction = t1.transaction 
          AND t0.id = t1.transactionline 
          JOIN transaction t2 on t2.id = t0.transaction 
          JOIN account t3 on t0.expenseaccount = t3.id 
      WHERE 
          t1.posting = 'T' 
          AND t2.trandate
          BETWEEN TO_DATE(?, 'DD/MM/YYYY') AND TO_DATE(?, 'DD/MM/YYYY') 
          AND acctnumber NOT like '131%' 
          AND acctnumber NOT like '1381%' 
          AND acctnumber NOT like '1388%' 
          AND acctnumber NOT like '331%' 
          AND acctnumber NOT like '333%' 
          AND acctnumber NOT like '334%' 
          AND acctnumber NOT like '3388%'
          AND acctnumber NOT like '421%'
      ) 
      UNION ALL 
      (
          SELECT 
              t3.acctnumber, 
              t3.accountsearchdisplaynamecopy, 
              0 AS indebit, 
              0 AS incredit, 
              NVL(
                  CASE WHEN t3.acctnumber = '999900' then t1.amount else t1.debit end, 
                  0
              ) as obdebit, 
              NVL(
                  CASE WHEN t3.acctnumber = '999900' then t1.amount else t1.credit end, 
                  0
              ) as obcredit 
          FROM 
              transactionline t0 
              JOIN TransactionAccountingLine t1 ON t0.transaction = t1.transaction 
              AND t0.id = t1.transactionline 
              JOIN transaction t2 ON t2.id = t0.transaction 
              JOIN account t3 ON t0.expenseaccount = t3.id 
          WHERE 
          t1.posting = 'T' 
          AND t2.trandate < TO_DATE(?, 'DD/MM/YYYY') 
          AND acctnumber NOT like '131%' 
          AND acctnumber NOT like '1381%' 
          AND acctnumber NOT like '1388%' 
          AND acctnumber NOT like '331%' 
          AND acctnumber NOT like '333%' 
          AND acctnumber NOT like '334%' 
          AND acctnumber NOT like '3388%'
          AND acctnumber NOT like '421%'
      ) 
      UNION ALL 
      (
          SELECT 
              acctnumber, 
              accountsearchdisplaynamecopy, 
              indebit , 
              incredit,
              (
                  CASE 
                      WHEN obcredit IS NOT NULL AND obcredit <> 0 
                      THEN 
                          CASE 
                              WHEN (obdebit - obcredit > 0) THEN obdebit - obcredit 
                              ELSE 0 
                          END
                      ELSE obdebit 
                  END
              )  AS obdebit,
              (
                  CASE 
                      WHEN obdebit IS NOT NULL AND obdebit <> 0 
                      THEN 
                          CASE 
                              WHEN (obcredit - obdebit > 0) THEN obcredit - obdebit 
                              ELSE 0 
                          END
                      ELSE obcredit 
                  END
              ) AS obcredit
              -- indebit, 
              -- incredit,
              -- obdebit,
              -- obcredit
          FROM 
          (
              SELECT 
                  A.id AS accountid,
                  E.id AS entityid,
                  E.entitytitle,
                  E.externalid,
                  A.acctnumber AS acctnumber, 
                  A.accountsearchdisplaynamecopy, 
                  
                  SUM(
                      (
                          CASE 
                              WHEN (T.trandate < to_date('${vfromDate2}', 'DD/MM/YYYY') AND AL.debit IS NOT NULL AND AL.debit <> 0)
                              THEN AL.debit 
                              ELSE 0 
                          END
                      )
                  ) AS obdebit, 
                  SUM(
                      (
                          CASE 
                              WHEN (T.trandate < to_date('${vfromDate2}', 'DD/MM/YYYY') AND AL.credit IS NOT NULL AND AL.credit <> 0)
                              THEN AL.credit 
                              ELSE 0 
                          END
                      )
                  ) AS obcredit, 
                  SUM(
                      (
                          CASE 
                              WHEN T.trandate >= to_date('${vfromDate2}', 'DD/MM/YYYY') AND T.trandate <= to_date('${vtoDate2}', 'DD/MM/YYYY') AND AL.debit IS NOT NULL AND AL.debit <> 0 
                              THEN AL.debit 
                              ELSE 0 
                          END
                      )
                  ) AS indebit, 
                  SUM(
                      (
                          CASE 
                              WHEN T.trandate >= to_date('${vfromDate2}', 'DD/MM/YYYY') AND T.trandate <= to_date('${vtoDate2}', 'DD/MM/YYYY') AND AL.credit IS NOT NULL AND AL.credit <> 0 
                              THEN AL.credit 
                              ELSE 0 
                          END
                      )
                  ) AS incredit
              FROM 
                  TRANSACTION T 
                  JOIN TRANSACTIONLINE TL ON T.ID = TL.TRANSACTION
                  JOIN TRANSACTIONACCOUNTINGLINE AL ON TL.TRANSACTION = AL.TRANSACTION AND TL.ID = AL.TRANSACTIONLINE
                  JOIN ACCOUNT A ON AL.ACCOUNT = A.ID
                  JOIN ENTITY E ON TL.entity = E.id 
              WHERE 
                  T.POSTING = 'T' 
                  AND AL.amount != 0 
                  AND (
                      A.acctnumber LIKE '131%' 
                      OR A.acctnumber LIKE '331%' 
                      OR A.acctnumber LIKE '1381%' 
                      OR A.acctnumber LIKE '1388%' 
                      OR A.acctnumber LIKE '3388%' 
                  ) 
              GROUP BY 
                      A.id ,
                      E.id ,
                      E.entitytitle,
                      E.externalid,
                      A.acctnumber, 
                      A.accountsearchdisplaynamecopy
          )
      )
      UNION ALL 
      (
          SELECT 
              acctnumber, 
              accountsearchdisplaynamecopy, 
              indebit, 
              incredit,
              obdebit,
              obcredit
          FROM 
          (
              SELECT 
                  A.acctnumber AS acctnumber, 
                  A.accountsearchdisplaynamecopy, 
                  A.id AS accountid, 
                  (
                      CASE 
                          WHEN (T.trandate < to_date('${vfromDate2}', 'DD/MM/YYYY') AND AL.debit IS NOT NULL AND AL.debit <> 0) 
                          THEN
                              CASE 
                                  WHEN AL.credit IS NOT NULL AND AL.credit <> 0 
                                  THEN 
                                      CASE 
                                          WHEN (AL.debit - AL.credit > 0) THEN AL.debit - AL.credit 
                                          ELSE 0 
                                      END
                                  ELSE AL.debit 
                              END
                          ELSE 0 
                      END
                  ) AS obdebit, 
                  (
                      CASE 
                          WHEN (T.trandate < to_date('${vfromDate2}', 'DD/MM/YYYY') AND AL.credit IS NOT NULL AND AL.credit <> 0) 
                          THEN
                              CASE 
                                  WHEN AL.debit IS NOT NULL AND AL.debit <> 0 
                                  THEN 
                                      CASE 
                                          WHEN (AL.credit - AL.debit > 0) THEN AL.credit - AL.debit 
                                          ELSE 0 
                                      END
                                  ELSE AL.credit 
                              END
                          ELSE 0 
                      END
                  ) AS obcredit, 
                  (
                      CASE 
                          WHEN T.trandate >= to_date('${vfromDate2}', 'DD/MM/YYYY') AND T.trandate <= to_date('${vtoDate2}', 'DD/MM/YYYY') AND AL.debit IS NOT NULL AND AL.debit <> 0 
                          THEN AL.debit 
                          ELSE 0 
                      END
                  ) AS indebit, 
                  (
                      CASE 
                          WHEN T.trandate >= to_date('${vfromDate2}', 'DD/MM/YYYY') AND T.trandate <= to_date('${vtoDate2}', 'DD/MM/YYYY') AND AL.credit IS NOT NULL AND AL.credit <> 0 
                          THEN AL.credit 
                          ELSE 0 
                      END
                  ) AS incredit
              FROM 
                  TRANSACTION T 
                  JOIN TRANSACTIONLINE TL ON T.ID = TL.TRANSACTION
                  JOIN TRANSACTIONACCOUNTINGLINE AL ON TL.TRANSACTION = AL.TRANSACTION AND TL.ID = AL.TRANSACTIONLINE
                  JOIN ACCOUNT A ON AL.ACCOUNT = A.ID
                  LEFT JOIN ENTITY E ON TL.entity = E.id 
              WHERE 
                  T.POSTING = 'T' 
                  AND AL.amount != 0 
                  AND (
                      A.acctnumber LIKE '333%' 
                      OR A.acctnumber LIKE '334%' 
                      OR A.acctnumber LIKE '421%' 
                  ) 
          )
      )
  )
) 
GROUP BY 
acctnumber, 
accountsearchdisplaynamecopy
) t0 ON t0.acctnumber = t1.acctnumber 
ORDER BY 
t0.acctnumber
)
)
) 
UNION 
(
SELECT 
* 
FROM 
(
SELECT 
a1.acctnumber, 
a1.accountsearchdisplaynamecopy as accountname, 
0 AS obdebit, 
0 AS obcredit, 
0 AS debit, 
0 AS credit, 
0 AS ebdebit, 
0 AS ebcredit, 
a2.acctnumber AS parent, 
a2.accountsearchdisplaynamecopy AS parentname, 
'' AS note, 
1 AS type 
FROM 
account a1 
LEFT JOIN account a2 ON a1.parent = a2.id
)
)
)


    
      `;

      if (vfromDate2) {
        queryParams.push(vfromDate2);
      }
      if (vtoDate2) {
        queryParams.push(vtoDate2);
      }
      if (vfromDate2) {
        queryParams.push(vfromDate2);
      }
      log.debug('queryParams',queryParams)
      do {
        paginatedSQL =
          `SELECT *,
               FROM ( SELECT ROWNUM AS ROWNUMBER, * FROM (` +
          nestedSQL +
          ' ) )as vas WHERE ( ROWNUMBER BETWEEN ' +
          paginatedRowBegin +
          ' AND ' +
          paginatedRowEnd +
          ')';

        queryResults = query
          .runSuiteQL({ query: paginatedSQL, params: queryParams })
          .asMappedResults();

        log.debug('paginatedSQL vas 02', paginatedSQL)
        records = records.concat(queryResults);

        if (queryResults.length < 5000) {
          moreRecords = false;
        }

        paginatedRowBegin = paginatedRowBegin + 5000;
      } while (moreRecords);

      if(records.length > 0){
        let tempData = records.filter((record) => record.type == 0);
        let accountData = records.filter((record) => record.type == 1);
        const transformedTempData = {};

        for (const obj of tempData) {
            transformedTempData[obj.acctnumber] = obj;
        }

        const accountKeys = Object.keys(transformedTempData);
        let filteredData = accountData.filter((obj) => {
            return accountKeys.some((key) => key.startsWith(obj.acctnumber));
        });

        filteredData = filteredData.map((obj) => {
            const matchingKey = accountKeys.find((key) => key == obj.acctnumber);

            if (matchingKey) {
                return transformedTempData[matchingKey];
            } else {
                return obj;
            }
        });
        const tempResult1 = createNestedStructure(filteredData);
        const tempResult2 = flattenTree(tempResult1, filteredData);
        outputTrialBalance = calculateSummary(tempResult2);
        totalSummary = {
            totalObDebit: 0,
            totalObCrebit: 0,
            totalDebit: 0,
            totalCredit: 0,
            totalEbCredit: 0,
            totalEbDedit: 0,
        };
       
        outputTrialBalance.forEach((item) => {
            if (item.level == 1) {
                totalSummary.totalObDebit += item.obdebit;
                totalSummary.totalObCrebit += item.obcredit;
                totalSummary.totalDebit += item.debit;
                totalSummary.totalCredit += item.credit;
                totalSummary.totalEbDedit += item.ebdebit;
                totalSummary.totalEbCredit += item.ebcredit;
            }
        });
        if (accountLevel) {
            outputTrialBalance = outputTrialBalance.filter(function (obj) {
                return obj.level <= accountLevel;
            });
        }
       
        let result = outputTrialBalance.map((item) => ({
          
                'account':item.acctnumber,
                'account_name':item.accountname,
                'no_dau_ky':formatNumberWithCommas(Number(Number(item.obdebit)).toFixed(2)) || 0,
               'co_dau_ky': formatNumberWithCommas(Number(Number(item.obcredit)).toFixed(2)) || 0,
                'phat_sinh_no':formatNumberWithCommas(Number(Number(item.debit)).toFixed(2)) || 0,
                'phat_sinh_co':formatNumberWithCommas(Number(Number(item.credit)).toFixed(2)) || 0,
                'du_no_cuoi_ky':formatNumberWithCommas(Number(Number(item.ebdebit)).toFixed(2)) || 0,
                'du_co_cuoi_ky':formatNumberWithCommas(Number(Number(item.ebcredit)).toFixed(2)) || 0,
                'bold': item.bold
            
        }));

        var activeColumnIndexes = [];

        log.debug('result',result);
        return JSON.stringify(result)
      }
      break;
  }
}
