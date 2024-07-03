const parseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export function parseString({
  index,
  str,
  addi,
}: {
  str: string;
  addi?: string;
  index: number;
}) {
  const regex =
    /(\d{4}\.\d{1,2}\.\d{1,2}\/\d{1,2}:\d{1,2}:\d{1,2}) \[(.+)\] (\d+)개 총합 ([\d,]+) 메소(?:\n(.+))?/;
  const match = str.match(regex);

  if (match) {
    const [, date, name, count, price] = match;

    if (addi) {
      return {
        date: parseDate(date),
        name,
        count: parseInt(count, 10),
        price: parseInt(price.replace(/,/g, ''), 10),
        additional: addi,
      };
    } else {
      return {
        date: parseDate(date),
        name,
        count: parseInt(count, 10),
        price: parseInt(price.replace(/,/g, ''), 10),
      };
    }
  } else {
    console.log({ str, addi, index });
    throw new Error('hello world');
  }
}
