import hparser from 'node-html-parser';
import models from '../db/models/index.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE, UserAgent } from '../conf/constant.js';
import request from '../utils/request.js';

const { Novel, Chapter, Clutter } = models;

/**
 * 根據ID獲取novel
 * @param {number} id ID
 */
export async function novelInfo({ id, url, clutter }) {
  try {
    const where = {};
    if (id) {
      where.id = id;
    }
    if (url) {
      where.url = url;
    }

    const seach = {
      where,
    };
    if (clutter) {
      seach.include = Clutter;
    } else {
      seach.include = Chapter;
    }

    const result = await Novel.findOne(seach);

    if (result) {
      const data = result.dataValues;
      if (clutter) {
        data.Clutter = data.Clutter.dataValues;
      }
      return data;
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function novelList({ title, author, finish, content, page = 1, limit = PAGE_SIZE }) {
  try {
  // 查询条件
    const search = {
      include: Chapter,
    };
    const where = {};

    if (title) {
      where.title = {
        [Op.like]: title,
      };
    }
    if (author) {
      where.author = {
        [Op.like]: author,
      };
    }
    if (typeof finish === 'boolean') {
      where.finish = finish;
    }
    if (content) {
      where.content = {
        [Op.like]: content,
      };
    }
    if (page) {
      search.limit = limit;
      if (page > 1) {
        search.offset = limit * (page - 1);
      }
    }
    // 查询
    const result = await Novel.findAndCountAll(search);
    const list = result.rows.map((row) => row.dataValues);

    return {
      count: result.count,
      list,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function novelAdd({ url, title, content, clutter, author, finish, origin, loaded }) {
  try {
    const result = await Novel.create({ url, title, content, clutter, author, finish, origin, loaded });
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
}
export async function novelUpdate({ id, url, title, content, clutter, author, finish, origin, loaded }) {
  try {
    const where = {
      id,
    };
    const result = await Novel.update({ url, title, content, clutter, author, finish, origin, loaded }, {
      where,
    });
    return result[0] > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function novelDelete(id) {
  try {
    const where = {
      id,
    };

    const result = await Novel.destroy({
      where,
    });

    return result > 0;
  } catch (error) {
    throw new Error(error);
  }
}
export async function novelBulk(list) {
  try {
    const result = [];
    const dataes = [];
    const keys = ['url', 'title', 'content', 'clutter', 'author', 'finish', 'origin'];
    list.forEach((v) => {
      if (v.url) {
        const item = {};
        keys.forEach((key) => {
          item[key] = v[key];
        });
        dataes.push(item);
      }
    });
    let len = dataes.length;
    if (len) {
      while (len > 0) {
        const datas = dataes.splice(0, 100);
        let values = await Novel.bulkCreate(datas, { ignoreDuplicates: true });
        // console.log('list', values);
        values = values.map((row) => row.dataValues);
        result.push(...values);
        len = dataes.length;
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 文章目录内容
 */
export async function novelContent({ url, encode, title, author, content, lists, detailurl, listSort, multlist }) {
  try {
    const options = {
      url,
      header: {
        'User-Agent': UserAgent,
      },
      method: 'GET',
    };
    if (encode) {
      options.encode = encode;
    }
    const html = await request(options);
    const result = {
      url,
    };

    const root = hparser.parse(html);
    // 标题
    // console.log(' ----------     标题    ---------- ');
    const info = root.querySelector(title);
    result.title = info.text;
    if (author) {
      // 作者
      // console.log(' ----------     作者    ---------- ');
      const infos = root.querySelector(author);
      result.author = infos.text;
    }
    if (content) {
      // 內容簡介
      // console.log(' ----------     內容簡介    ---------- ');
      const contents = root.querySelector(content).text;
      result.content = contents.replace(/\s+/g, '\n');
    }

    // 目錄
    // console.log(' ----------     目錄    ---------- ');
    let list = root.querySelectorAll(lists);
    list = list.map((a) => {
      const src = a.getAttribute('href');
      const name = a.text;
      return {
        name,
        url: `${detailurl}${src}`,
      };
    });
    if (listSort) {
      list.sort((a, b) => parseInt(a.url, 10) - parseInt(b.url, 10));
    }
    result.list = list;

    if (multlist) {
      // 目录多页
      // console.log(' ----------     目录多页    ---------- ');
      const nextpage = root.querySelector(multlist);
      let page = '';
      if (nextpage) {
        page = nextpage.getAttribute('href');
        if (!page.includes(detailurl)) {
          page = `${detailurl}${page}`;
        }
      }
      result.multlist = page;
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * 文章章节
 */
export async function novelChapter({ url, encode, name, detail, detailex, arange, multpage }) {
  try {
    const options = {
      url,
      header: {
        'User-Agent': UserAgent,
      },
      method: 'GET',
    };
    if (encode) {
      options.encode = encode;
    }
    const html = await request(options);
    const result = {
      url,
      title: name,
    };

    const root = hparser.parse(html);
    let details = root.querySelector(detail);

    const dexs = details.querySelectorAll(detailex);
    dexs.forEach((v) => {
      v.remove();
    });

    details = details.innerHTML;
    details = details.replace(/&nbsp;/g, '');
    details = details.replace(/\r?\n?\s+?/g, '');
    details = details.replace(/<.+?>+/g, '{BR}');
    details = details.split('{BR}').filter((v) => !!v);

    if (arange && Array.isArray(arange)) {
      details = details.slice(...arange);
    }

    const title = name.replace(/\s+/, '');
    details = details.filter((v) => title !== v);

    // details = `\n${name}\n${details.join("\n")}`;
    result.detail = details.join('\n');

    if (multpage) {
      // 内容多页
      const nextpage = root.querySelector(multpage);
      result.multpage = nextpage.getAttribute('href');
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}
