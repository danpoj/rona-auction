'use server';

import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { parseString } from '@/lib/parse-string';
import { InferSelectModel, count, eq, isNull, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const linkd = [
  '콘센트',
  '미스릴 모울',
  '니암',
  '마나 엘릭서 알약',
  '삼지창',
  '스틸르노',
  '코코넛 열매',
  '실버 크로우',
  '얼음 조각',
  '그린 플레스티어',
  '화이트 아나카룬',
  '네오자드',
  '블루 제너럴 바지',
  '퍼플 쉐이드슈트',
  '퍼플 쉐이드슈트 바지',
  '나무 망치',
  '다크 스콜피오 바지',
  '주황버섯의 갓',
  '라이덴',
  '블루 오리엔타이칸 바지',
  '트라우스',
  '[마스터리북]연막탄 30',
  '미하일',
  '레드 숄더메일',
  '오리할콘 카멜부츠',
  '블루 너클베스트 바지',
  '메이플 건',
  '토파즈',
  '레드 아나카문',
  '퍼플 골든윈드슈즈',
  '[마스터리북]서포트 옥토퍼스 20',
  '[마스터리북]마인드 컨트롤 20',
  '블루 시아르',
  '다크 크리시아',
  '메이플 크로스보우',
  '그린 바루나',
  '베이아 크래쉬',
  '블루 카젠부츠',
  '화이트 아나카문',
  '헥터의 꼬리',
  '브라운 더블트 부츠',
  '미스릴 플라틴',
  '적선백궁',
  '데저트 이글',
  '신발 이동속도 주문서 100%',
  '[마스터리북]닌자 스톰 20',
  '[마스터리북]닌자 앰부쉬 20',
  '오렌지 칼라스',
  '황초로',
  '네펜데스의 씨앗',
  '메이플 글로리 소드',
  '핑크 골든윈드슈즈',
  '파란색 원라인 티셔츠',
  '헤클러',
  '퍼플 쉐도우부츠',
  '골든 샬리트',
  '브라운 라피스샌들',
  '청동',
  '송편',
  '다크 골든서클릿',
  '골든해머',
  '배틀 보우',
  '딸기',
  '두손둔기 제작의 촉진제',
  '다크 아데스',
  '블랙 로타네브',
  '다크 제너럴 바지',
  '다크 제너럴',
  '해골 어깨 보호대',
  '퍼플 네일슈즈',
  '블루 아나카룬',
  '레드 고니슈즈',
  '다크 칼라프',
  '다크 윌로우',
  '브라운 피에르슈즈',
  '[마스터리북]스내치 20',
  '펫장비 점프력 주문서 60%',
  '콜드마인드',
  '상의 방어력 주문서 10%',
  '수박맛 아이스바',
  '눈덩이',
  '실버 메이든',
  '다크 리네로스',
  '월비 표창',
  '라이트 스콜피오',
  '그린 스타라이트',
  '그린 리넥스슈즈',
  '그린 리네로스',
  '에메랄드 메일',
  '레드 오리엔트 헬멧',
  '그린 세라피스',
  '다크 허스크',
  '골드 와이어스',
  '메이플 데몬엑스',
  '그린 하프슈즈',
  '브라운 스니크 바지',
  '메이플 크로우',
  '레드 힌켈',
  '[마스터리북]몬스터 마그넷 30',
  '[마스터리북]몬스터 마그넷 20',
  '전신 갑옷 방어력 주문서 10%',
  '검정색 파오',
];

export const getTransactionsWithoutItemId = async () => {
  const itemsFromAPI = await fetch(
    `https://maplestory.io/api/kms/384/item`
  ).then((res) => res.json());

  const itemsWithName = itemsFromAPI
    .filter
    // (d) => !(!d.name || !d.name.trim())
    ();

  const obj: Record<
    string,
    {
      id: number;
      name: string;
      desc: string;
    }
  > = {};

  for (const item of itemsWithName) {
    obj[item.name.replace(/\s+/g, '')] = {
      id: item.id,
      name: item.name,
      desc: item.desc,
    };
  }

  const items = await db.query.transactionTable.findMany({
    where: isNull(transactionTable.itemId),
  });

  console.log(items);

  const itemsLinked = items.filter(
    (item) => !!obj[item.itemName.replace(/\s+/g, '')]
  );

  const dd = linkd
    .filter((link) => obj[link.replace(/\s+/g, '')])
    .map((l) => ({
      id: obj[l.replace(/\s+/g, '')].id,
      name: obj[l.replace(/\s+/g, '')].name,
      desc: obj[l.replace(/\s+/g, '')].desc,
      trimmedName: obj[l.replace(/\s+/g, '')].name.replace(/\s+/g, ''),
    }));

  // const itemsLinkedSet = [...new Set(itemsLinked.map((item) => item.itemName))];

  // for await (const transaction of itemsLinkedSet) {
  //   await db
  //     .update(transactionTable)
  //     .set({
  //       itemId: obj[transaction.replace(/\s+/g, '')].id,
  //     })
  //     .where(
  //       eq(transactionTable.itemName, obj[transaction.replace(/\s+/g, '')].name)
  //     );

  //   console.log(transaction);
  // }
};

export const updateTransactionsWithoutItemId = async () => {
  const items = await db.query.itemTable.findMany();

  const obj = items.reduce((acc: Record<string, number>, item) => {
    acc[item.trimmedName] = item.id;
    return acc;
  }, {});

  console.log(obj);

  // await db.update(transactionTable).set({
  //   itemId:
  // })
};

export const clearAction = async () => {
  await db.delete(transactionTable);
};

export const updateDate = async () => {
  await db
    .update(transactionTable)
    .set({
      date: sql`'2024-07-01 15:00:00'::timestamp at time zone 'Asia/Seoul' at time zone 'UTC'`,
    })
    .where(
      sql`${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' = '2024-07-04 03:00:00'::timestamp`
    );
};

export const query = async () => {
  const items = await db.query.transactionTable.findMany({
    where: isNull(transactionTable.itemId),
  });

  let obj: Record<string, InferSelectModel<typeof transactionTable>[]> = {};

  items.forEach((item) => {
    if (obj[item.itemName]) {
      obj[item.itemName].push(item);
    } else {
      obj[item.itemName] = [item];
    }
  });

  const entries = Object.entries(obj);

  let itemId = 666666663;

  for await (const entrie of entries) {
    console.log(entrie[0]);

    await db.insert(itemTable).values({
      id: itemId,
      name: entrie[0],
      trimmedName: entrie[0].replace(/\s+/g, ''),
      desc: '',
    });

    await db
      .update(transactionTable)
      .set({
        itemId: itemId,
      })
      .where(eq(transactionTable.itemName, entrie[0]));

    itemId += 1;
  }
};

export const deleteItemsWithoutTransactions = async () => {
  console.log('deleting... ');
  const deleteItemsWithoutTransactions = await db.execute(sql`
    DELETE FROM ${itemTable}
    WHERE ${itemTable.id} NOT IN (
      SELECT DISTINCT ${transactionTable.itemId}
      FROM ${transactionTable}
      WHERE ${transactionTable.itemId} IS NOT NULL
    )
  `);

  console.log('success!');
};

export const getItemsWithoutTransactions = async () => {
  const itemsWithTransactionCount = await db
    .select({
      id: itemTable.id,
      transactionCount: sql<number>`cast(count(${transactionTable.id}) as integer)`,
    })
    .from(itemTable)
    .leftJoin(transactionTable, eq(itemTable.id, transactionTable.itemId))
    .groupBy(itemTable.id);

  console.log(itemsWithTransactionCount);

  // const itemsLength = await db
  //   .select({
  //     count: count(),
  //   })
  //   .from(itemTable);

  // console.log(itemsLength);

  // const transactions = await db.select().from(transactionTable);

  // const obj: Record<string, boolean> = {};

  // transactions.forEach((t) => {
  //   if (t.itemId) {
  //     obj[t.itemId] = true;
  //   }
  // });

  // console.log(Object.keys(obj).length);
};

export const getTransactionsAction = async () => {
  const fullPath = path.join(process.cwd(), '/data/07.07.txt');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const arr = fileContents.split('\n\n');

  const newArr = arr
    .map((item, index) => {
      if (item.trim().length === 0) return;
      const temp = item.split('\n');

      if (temp.length === 1) {
        return parseString({
          str: temp[0],
          index,
        });
      } else if (temp.length === 2) {
        return parseString({
          str: temp[0],
          index,
          addi: temp[1],
        });
      }
    })
    .filter((i) => i?.count && i.date && i.name && i.price);

  return newArr;
};

export const saveTransactionsAction = async () => {
  const items = await db.query.itemTable.findMany();

  const obj = items.reduce((acc, item) => {
    // acc[item.trimmedName] = { ...item };
    return acc;
  }, {});

  const transactions = await getTransactionsAction();

  console.log(transactions);

  const batchSize = 1000;
  for (let i = 0; i < transactions.length; i += batchSize) {
    console.log(`${i} ~ ${i + 1000} start...`);
    const batch = transactions.slice(i, i + batchSize);
    const batchWithItemId = batch.map((b) => ({
      count: b?.count,
      date: b?.date && new Date(b?.date),
      name: b?.name.trim(),
      price: String(b?.price),
      additional: b?.additional || '',
      itemName: b?.name.trim(),
      // ...(obj[b?.name.trim()?.replace(/\s+/g, '')] && {
      //   itemId: obj[b?.name.trim()?.replace(/\s+/g, '')].id,
      // }),
    }));

    // await db.insert(transactionTable).values(batchWithItemId);

    console.log(`${i} ~ ${i + 1000} success!`);
  }
};

type Item = {
  name: string;
  id: number;
  desc: string;
};

export const saveItemsAction = async () => {
  console.log('saving...');

  const items = (await fetch('https://maplestory.io/api/kms/384/item').then(
    (res) => res.json()
  )) as Item[];

  const obj: Record<string, boolean> = {};

  const validItems = items.filter((item) => {
    if (!(item.name && typeof item.name === 'string' && !!item.name.trim()))
      return false;

    if (obj[item.name.trim()]) {
      return false;
    } else {
      obj[item.name.trim()] = true;
      return true;
    }
  });

  const batchSize = 1000; // Adjust this value based on your database limits
  for (let i = 0; i < validItems.length; i += batchSize) {
    console.log(`${i} ~ ${i + 1000} start...`);
    const batch = validItems.slice(i, i + batchSize);
    await db.insert(itemTable).values(
      batch.map((item) => ({
        id: item.id,
        name: item.name.trim(),
        trimmedName: item.name.trim().replace(/\s+/g, ''),
        desc: item.desc || '',
      }))
    );

    console.log(`${i} ~ ${i + 1000} success!`);
  }

  console.log('items saved! 🎉');
};

export const updateItemsAction = async () => {
  console.log('saving...');

  const allItems = await db.query.transactionTable.findMany();
  const allRealItems = await db.query.itemTable.findMany();

  let obj: Record<string, boolean> = {};
  let obj2: Record<string, boolean> = {};

  allItems.forEach((item) => {
    obj[item.itemId!] = true;
  });

  allRealItems.forEach((item) => {
    obj2[item.id] = true;
  });

  const ids = Object.keys(obj);
  const ids2 = Object.keys(obj2);

  for await (const id of ids) {
    if (!obj2[id]) {
      const data = await fetch(
        `https://maplestory.io/api/kms/389/item/${id}`
      ).then((res) => res.json());

      if (!data || !data.description) continue;

      // await db.insert(itemTable).values({
      //   desc: data.description.description,
      //   id,
      //   name: data.description.name,
      //   trimmedName: data.description.name.trim().replace(/\s+/g, ''),
      // });

      console.log(id);
    }
  }
};
