import models from '../db/models/index.js';
import { rollBack } from '../db/seq.js';
import { Op } from '../db/types.js';

const { Chapter } = models;
/**
 * 根據ID獲取chapter
 * @param {number} id ID
 */
export async function chapterInfo(id) {
  const result = await Chapter.findOne({
    where: {
      id,
    },
    raw: true,
  });
  if (result) {
    const { serial, media } = result;
    const where = {
      media,
    };
    if (serial) {
      where.serial = {
        [Op.in]: [+serial - 1, +serial + 1],
      };
    } else {
      where.id = {
        [Op.in]: [+id - 1, +id + 1],
      };
    }
    const chapters = await Chapter.findAll({
      attributes: ['id', 'title', 'url', 'serial'],
      order: ['serial'],
      where,
      raw: true,
    });
    const max = chapters.length;
    let [prev, next] = chapters;
    if (max <= 1 && prev) {
      if (where.serial && prev.serial > serial) {
        [prev, next] = [next, prev];
      } else if (prev.id > id) {
        [prev, next] = [next, prev];
      }
    }
    result.prev = prev;
    result.next = next;
  }
  return result;
}

async function addChapter({ url, title, content, clutter, media, serial, author, platform, tag }) {
  const item = { url, title, content, clutter, media, serial, author, platform, tag };
  const result = await Chapter.create(item);
  return result;
}

export async function newChapter(item) {
  const result = await rollBack(addChapter, item);
  return result;
}

export async function changeChapter({ id, url, title, content, clutter, media, serial, author, platform, tag }) {
  const item = await Chapter.findByPk(id);
  if (item) {
    const newItem = { url, title, content, clutter, media, serial, author, platform, tag };
    Object.keys(newItem).forEach((key) => {
      if (newItem[key] === undefined) {
        delete newItem[key];
      }
    });
    await item.update(newItem);
    await item.save();
  }
  return !!item;
}

// 刪除
async function delChapter(id) {
  const result = await Chapter.destroy({
    where: {
      id,
    },
  });

  return result > 0;
}
export async function deleteChapter(id) {
  const result = await rollBack(delChapter, id);
  return result;
}

export async function chaptersByMedia(media) {
  // 查询条件
  const search = {
    where: {
      media,
    },
    raw: true,
  };

  const result = await Chapter.findAndCountAll(search);
  return result;
}

// 排序
export async function sortChapters(sorts) {
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
  return result.some((v) => v);
}
