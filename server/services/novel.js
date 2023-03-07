import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';
import { PAGE_SIZE } from '../conf/constant.js';

const { Chapter, Clutter } = models;

// 獲取列表
export async function novelList({ title, aurthor, page = 1, limit = PAGE_SIZE }) {
  const where = {
    type: 'novel',
  };
  if (title) {
    where.title = {
      [Op.like]: `%${title}%`,
    };
  }
  if (aurthor) {
    where.aurthor = {
      [Op.like]: `%${aurthor}%`,
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
  console.log(search);
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
export async function chapterInfo(id, novel = false) {
  const where = {
    id,
  };
  let result = await Chapter.findOne({
    where,
  });
  if (result) {
    result = result.dataValues;
    if (novel) {
      const chapters = await Chapter.findAndCountAll({
        where: {
          type: 'novel',
          typeId: id,
        },
      });
      result.chapters = chapters.rows.map((row) => row.dataValues);
      result.chapterCount = chapters.count;
    }
  }
  return result;
}

// 新增
async function addchapter({ url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag }) {
  const chapter = { url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag };
  let result = await Chapter.create(chapter);
  if (result) {
    result = result.dataValues;
  }
  return result;
}
export async function chapterAdd({ url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag }) {
  const result = await rollBack(addchapter, { url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag });
  return result;
}

// 修改
export async function chapterMod({ id, url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag }) {
  const chapter = { url, title, author, content, type, typeId, authorId, authorLink, clutter, platform, authorIp, platformId, publishTime, tag };
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
    result = result.dataValues;
    const contents = JSON.parse(result.content);
    result = { id: result.id, ...contents };
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
    result = result.dataValues;
    console.log(result);
    const content = JSON.parse(result.content);
    result = { id: result.id, ...content };
  }
  return result;
}
