import * as query from "N/query"
import * as log from "N/log"

export const checkNotNull = (str: any) => {
  if (str !== undefined && str !== null && str !== '')
    return true;
  else
    return false;
}
export const getDDMMYYYY = (date: string) => {
  let arr = date.split(" ");
  let d = new Date(arr[0]+' '+arr[1]+' '+arr[2]+' '+arr[3]);
  return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()
}
export const hideLoading = () => {
  var overlay = $('#overlay');
  if (overlay.css('display') !== 'none') {
    overlay.fadeOut(300);
  }
}
export const createNestedStructure = (items) => {
  const map = items.reduce((acc, item) => {
    acc[item.acctnumber] = { ...item, children: {} };
    return acc;
  }, {});
  return items.reduce((result, item) => {
    const parentId = item.parent;
    const parent = parentId === null ? result : map[parentId].children;

    parent[item.acctnumber] = map[item.acctnumber].children;
    return result;
  }, {});
}
export const flattenTree = (tree, object, level = 1, output = []) => {
  for (const key in tree) {
    if (tree.hasOwnProperty(key)) {
      const item = object.find((data) => data.acctnumber == key);
      if(item){
      output.push({ ...item, level });
    }
      if (Object.keys(tree[key]).length > 0) {
        flattenTree(tree[key], object, level + 1, output);
      }
    }
  }

  return output;
}

export const calculateSummary = (objects) => {
  let index = objects.length - 1;
  var switchLoop = false;
  var summary = {};
  let level = null;

  do {
    let currentObject = objects[index];
    let currentLevel = currentObject.level;
    let currentNote = currentObject.note;

    if (!summary[currentLevel]) {
      summary[currentLevel] = {
        credit: 0,
        debit: 0,
      };
    }

    if (!level) {
      level = currentLevel;
    }

    if (level && level == currentLevel) {
      if (currentNote) {
        summary[currentLevel] = {
          credit: summary[currentLevel].credit + currentObject.credit,
          debit: summary[currentLevel].debit + currentObject.debit,
        };
      }
    }

    if (level && level > currentLevel) {
      if (currentLevel == level - 1) {
        currentObject.credit = summary[level].credit;
        currentObject.debit = summary[level].debit;

        summary[currentLevel] = {
          credit: summary[currentLevel].credit + currentObject.credit,
          debit: summary[currentLevel].debit + currentObject.debit,
        };

        summary[level] = {
          credit: 0,
          debit: 0,
        };
      }
    }

    if (level && level < currentLevel) {
      if (currentNote) {
        summary[currentLevel] = {
          credit: summary[currentLevel].credit + currentObject.credit,
          debit: summary[currentLevel].debit + currentObject.debit,
        };
      }
    }

    level = currentLevel;

    if (currentLevel == 1) {
      level = null;
      summary = {};
      currentObject.bold = true;
      if (!currentNote) {
        currentObject.credit = currentObject.credit ? currentObject.credit : 0;
        currentObject.debit = currentObject.debit ? currentObject.debit : 0;
      }
    }else{
      currentObject.bold = false;
    }

    index--;
  } while (index > -1);

  return objects;
}

export const formatNumberWithCommas = (number) => {
  if (isNaN(number)) {
    return null;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export const stopLoading = () => {
  var overlay = $('#overlay');
  if (overlay.css('display') !== 'none') {
    overlay.fadeOut(300);
  }
}
export const customSort = (a, b) => {
  const aId = a.createdfrom !== null ? a.createdfrom : a.id;
  const bId = b.createdfrom !== null ? b.createdfrom : b.id;

  return aId - bId;
}

export const separateComma = (val) => {
  // remove sign if negative
  var sign = 1;
  if (val < 0) {
    sign = -1;
    val = -val;
  }
  // trim the number decimal point if it exists
  let num = val.toString().includes('.') ? val.toString().split('.')[0] : val.toString();
  let len = num.toString().length;
  let result = '';
  let count = 1;

  for (let i = len - 1; i >= 0; i--) {
    result = num.toString()[i] + result;
    if (count % 3 === 0 && count !== 0 && i !== 0) {
      result = ',' + result;
    }
    count++;
  }

  // add number after decimal point
  if (val.toString().includes('.')) {
    result = result + '.' + val.toString().split('.')[1];
  }
  // return result with - sign if negative
  return sign < 0 ? '-' + result : result;
}

export const codeMap = (a, lv) => {
  try {
    var codeMap = {};
    for (var i = 0; i < a.length; i++) {
      var lev = a[i]["formula_level"];
      if (lev == lv) {
        var sdk = a[i]["so_ky_nay"];
        var sdn = a[i]["so_ky_truoc"];
        var ms = a[i]["ma_so"];
        codeMap[ms] = {
          dauky: sdk,
          daunam: sdn,
        };
      }
    }
    return codeMap;
  } catch (error) {
    log.error('error', error)
  }

}


export const summarizer = (a, level) => {
  try {
    var codeMapLevel = codeMap(a, level - 1);
    for (var i = 0; i < a.length; i++) {
      var lv = a[i]["formula_level"];
      var f = a[i]["formula"];

      if (lv == level && f) {
        var fm = f.split(" ");
        var dauky = fm.slice();
        var daunam = fm.slice();
        try {
          for (var j = 0; j < fm.length; j++) {
            if (codeMapLevel[fm[j]]) {
              dauky[j] = codeMapLevel[dauky[j]].dauky;
              daunam[j] = codeMapLevel[daunam[j]].daunam;
            }
          }
        } catch (error) {
          log.debug('error', error);
        }


        dauky = dauky.join(" ");
        daunam = daunam.join(" ");
        a[i]["so_ky_nay"] = addbits(dauky);
        a[i]["so_ky_truoc"] = addbits(daunam);
      }
    }
  } catch (error) {
    log.error('error', error)
  }
}


export const runQuery = (sql: any) => {
  //@ts-ignore
  var results = query.runSuiteQL({
    query: sql,
  }).asMappedResults();
  return results;
}
export const getLocalDate = () => {
  var date = new Date();
  date.setHours(date.getHours() + 7);
  return date;
}
export const dateObjToString = (dateObj, outputFormat) => {
  function pad2(n) {
    return n < 10 ? '0' + n : n;
  }
  if (outputFormat == 'YYYY-MM-DD') {
    return dateObj.toISOString().split('T')[0];
  } else if (outputFormat == 'yyyyMMddHHmmss') {
    return dateObj.getFullYear().toString() + pad2(dateObj.getMonth() + 1) + pad2(dateObj.getDate()) + pad2(dateObj.getHours()) +
      pad2(dateObj.getMinutes()) + pad2(dateObj.getSeconds());
  } else if (outputFormat == 'DD/MM/YYYY') {
    return pad2(dateObj.getDate()) + '/' + pad2(dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
  }
}

export const addbits = (s) => {
  return (s.replace(/\s/g, '').match(/[+\-]?([0-9\.]+)/g) || []).reduce(function (sum, value) {
    return parseFloat(sum) + parseFloat(value);
  }, 0);
}
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export const convertToYMD = (date) => {
  var dateArray = date.split("/");
  // log.debug('dateArray', dateArray)
  var dateObject = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
  return dateObject
}