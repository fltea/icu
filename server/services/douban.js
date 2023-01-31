import hparser from 'node-html-parser';
import { UserAgent, DOUBAN_CONF } from '../conf/constant.js';
import request from '../utils/request.js';

export async function doulist(id, page) {
  const result = {};
  try {
    let url = DOUBAN_CONF.list.replace(/{id}/g, id);
    if (page > 1) {
      url += `?start=${(page - 1) * 25}&sort=time&playable=0&sub_type=`;
    }
    const html = await request({
      url,
      header: {
        'User-Agent': UserAgent,
      // cookie: wcookie,
      },
      method: 'GET',
    });
    // console.log(html);
    const root = hparser.parse(html);
    let pageList = root.querySelectorAll('.doulist-item[id]');
    pageList = pageList.map((p) => {
      let text;
      let a = p.querySelector('.title a');
      if (a) {
        text = p.querySelector('.abstract');
      } else {
        text = p.querySelector('.status-content');
        a = text.querySelector('a');
      }
      const link = a.getAttribute('href');
      return {
        id: p.getAttribute('id'),
        title: a.text.replace(/\r?\n?\s+?/g, ''),
        url: link,
        text: text.text.replace(/\r?\n?\s+?/g, ''),
      };
    });
    console.log(pageList);
    result.list = pageList;
  } catch (error) {
    result.error = error;
  }

  return result;
}
