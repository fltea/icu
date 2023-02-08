const { fetchDetail } = require("../service/crawler");
const { modifyNovel } = require("../service/novel");
const { sleep } = require("../utils/tools");
const { setTxt } = require("../utils/files");

function getEqual(string1, string2) {
  let testStr = string1;
  let lasIndex = string1.length;
  let isIn = string2.includes(testStr);
  while (!isIn) {
    lasIndex -= 1;
    testStr = testStr.substring(0, lasIndex);
    isIn = string2.includes(testStr);
  }
  if (testStr.endsWith("(")) {
    testStr = testStr.substring(0, testStr.length - 1);
  }
  return testStr;
}

async function getDetails({ url, loadname, detailurl, encode, detail, detailex, multpage, listSort, arange }) {
  console.log("details url", url, detailurl);
  const result = await fetchDetail({
    url,
    name: "",
    loadname,
    encode,
    detail,
    detailex,
    multpage,
    arange,
    listSort,
  });
  if (result.error) {
    return result;
  }
  let nextPage = result.nextPage;
  while (nextPage.includes("_")) {
    await sleep(1000);
    console.log("nextPage nextUrl :", nextPage);
    const nextResult = await fetchDetail({
      url: nextPage,
      name: "",
      loadname,
      encode,
      detail,
      detailex,
      multpage,
      arange,
      listSort,
    });
    if (nextResult.detail) {
      result.detail += nextResult.detail;
    }
    if (nextResult.title) {
      result.title = getEqual(result.title, nextResult.title);
    }
    nextPage = nextResult.nextPage || "";
  }
  if (!nextPage.includes(detailurl)) {
    nextPage = `${detailurl}${nextPage}`;
  }

  // 最后一章
  if (nextPage.includes(".htm")) {
    result.loadpage = nextPage;
  }
  result.detail = `\n${result.title}${result.detail}`;
  // console.log("nextPage :", nextPage);
  delete result.title;
  delete result.nextPage;
  // console.log("result :", result);
  return result;
  // return {};
}

async function crawerList(loadpage, loadname, detailurl, oids, novelId, dstart, dend, encode, details, detailex, multpage, listSort, title) {
  if (loadpage && multpage) {
    let nextPage = !!loadpage;
    let arange;
    if (dstart || dend) {
      arange = [dstart];
      if (dend) {
        arange.push(dend);
      }
    }
    while (nextPage) {
      console.log("before getDetail loadpage", loadpage);
      const result = await getDetails({
        url: loadpage,
        loadname,
        detailurl,
        encode,
        detail: details,
        detailex,
        multpage,
        arange,
        listSort,
      });
      if (result.error) {
        return;
      }

      // 保存 detail
      setTxt(title, result.detail);
      oids++;
      await modifyNovel({
        oid: oids,
        loadpage,
        id: novelId,
      });
      if (result.loadpage) {
        await sleep(2000);
        loadpage = result.loadpage;
      }
      nextPage = !!result.loadpage;
    }
    await modifyNovel({
      oid: oids,
      id: novelId,
      loadpage,
      downing: false,
    });
  }
}

module.exports = crawerList;
