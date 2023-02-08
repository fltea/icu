const { fetchDetail } = require("../service/crawler");
const { modifyNovel } = require("../service/novel");
const { sleep, randInt } = require("../utils/tools");
const { setTxt } = require("../utils/files");

async function crawerList(list, oids, novelId, dstart, dend, encode, details, detailex, multpage, listSort, title) {
  const len = list.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      const item = list[i];
      if (i && i % 3 === 0) {
        const sleepTime = randInt(3, 12);
        console.log("before getDetail sleepTime", sleepTime);
        await sleep(sleepTime * 1000);
      }
      console.log("len", len, i, item.name);
      console.log("url :", item.url);
      let arange;
      if (dstart || dend) {
        arange = [dstart];
        if (dend) {
          arange.push(dend);
        }
      }
      const result = await fetchDetail({
        url: item.url,
        name: item.name,
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
      // console.log("multpage :", multpage);
      if (multpage) {
        let nextPage = result.nextPage;
        // console.log("nextPage :", nextPage);
        while (nextPage.includes("_")) {
          await sleep(1000);
          const arrs = item.url.split("/").slice(0, -1);
          const nextUrl = arrs.join("/") + "/" + nextPage.split("/").pop();
          console.log("nextPage nextUrl :", nextUrl);
          const nextResult = await fetchDetail({
            url: nextUrl,
            name: "",
            encode,
            detail: details,
            detailex,
            multpage,
            arange,
            listSort,
          });
          if (nextResult.detail) {
            result.detail += nextResult.detail;
          }
          nextPage = nextResult.nextPage || "";
        }
      }
      // 保存 detail
      setTxt(title, result.detail);
      oids++;
      await modifyNovel({
        oid: oids,
        id: novelId,
      });
    }

    await modifyNovel({
      oid: oids,
      id: novelId,
      downing: false,
    });
  }
}

module.exports = crawerList;
