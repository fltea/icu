import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Chapter, Clutter } = models;

function formatClutter(data) {
  const result = data.dataValues;
  const content = JSON.parse(result.content);
  return { id: result.id, ...content };
}

// 獲取列表
export async function novelList({ title, author, page = 1, limit = PAGE_SIZE }) {
  const where = {
    type: 'novel',
    typeId: null,
  };
  if (title) {
    where.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (author) {
    where.author = {
      [Op.like]: `%${author}%`,
    };
  }
  const search = {
    where,
  };
  if (page) {
    search.limit = limit;
    if (page > 1) {
      search.offset = limit * (page - 1);
    }
  }
  // console.log(search);
  const result = await Chapter.findAndCountAll(search);
  const list = result.rows.map((row) => row.dataValues);

  const data = {
    count: result.count,
    list,
  };
  if (page) {
    data.page = page;
    data.limit = limit;
  }
  return data;
}

// 獲取詳情
export async function chapterInfo({ id, novel, slide }) {
  let where = {
    id,
  };
  const search = {
    where,
  };
  search.include = Clutter;
  let result = await Chapter.findOne(search);
  if (result) {
    result = result.dataValues;
    if (result.Clutter) {
      result.clutter = formatClutter(result.Clutter);
      delete result.Clutter;
    }
    if (novel || slide) {
      const { type, typeId, serial } = result;
      where = {
        type,
        typeId: novel ? id : typeId,
      };

      if (slide) {
        if (serial) {
          where.serial = {
            [Op.in]: [+serial - 1, +serial + 1],
          };
        } else {
          where.id = {
            [Op.in]: [+id - 1, +id + 1],
          };
        }
      }

      // console.log(where);
      const chapters = await Chapter.findAll({
        attributes: ['id', 'title', 'url', 'serial'],
        order: ['serial'],
        where,
        raw: true,
      });
      if (slide) {
        const max = chapters.length;
        let [prev, next] = chapters;
        if (max <= 1) {
          if (where.serial && prev.serial > serial) {
            [prev, next] = [next, prev];
          } else if (prev.id > id) {
            [prev, next] = [next, prev];
          }
        }
        result.prev = prev;
        result.next = next;
      } else {
        result.chapters = chapters;
      }
    }
  }
  return result;
}

// 新增
async function addchapter(chapter) {
  let result = await Chapter.create(chapter);
  if (result) {
    result = result.dataValues;
  }
  return result;
}
export async function chapterAdd({ url, title, author, content, type, typeId, serial, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag }) {
  const result = await rollBack(addchapter, { url, title, author, content, type, typeId, serial, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag });
  return result;
}

// 修改
export async function chapterMod({ id, url, title, author, content, authorId, authorLink, platform, authorIp, platformId, publishTime, tag }) {
  const chapter = { url, title, author, content, authorId, authorLink, platform, authorIp, platformId, publishTime, tag };
  const where = {
    id,
  };
  const result = await Chapter.update(chapter, {
    where,
  });

  return result[0] > 0;
}

// 刪除
async function deleteChapter(id) {
  const where = {
    id,
  };
  const result = await Chapter.destroy({
    where,
  });

  return result > 0;
}
export async function chapterDel(id) {
  const result = await rollBack(deleteChapter, id);
  return result;
}

// noveler
// 新增
async function addNoveler({ domain, content }) {
  const clutter = {
    type: 'noveler',
    phrase: domain,
    content,
  };
  let result = await Clutter.create(clutter);
  if (result) {
    result = formatClutter(result);
  }
  return result;
}
export async function novelerAdd({ domain, content }) {
  const result = await rollBack(addNoveler, { domain, content });
  return result;
}

// 修改
export async function novelerMod({ id, content }) {
  const where = {
    id,
  };
  const result = await Clutter.update({
    content,
  }, {
    where,
  });

  return result[0] > 0;
}

// 詳情
export async function novelerInfo({ id, domain }) {
  let where;
  if (id) {
    where = {
      id,
    };
  } else {
    where = {
      type: 'noveler',
      phrase: domain,
    };
  }
  let result = await Clutter.findOne({
    where,
  });
  if (result) {
    result = formatClutter(result);
  }
  return result;
}
// 排序
export async function chapterSort(sorts) {
  let max = sorts.length;
  const result = [];
  while (max) {
    const item = sorts.shift();
    max = sorts.length;
    const curId = item.id;
    delete item.id;
    const mresult = await Chapter.update(item, {
      where: {
        id: curId,
      },
    });
    result.push(mresult[0] > 0);
  }
  // const result = await Chapter.bulkCreate(sorts, { updateOnDuplicate: ['serial'] });
  // console.log(result);
  return result.some((v) => v);
}
