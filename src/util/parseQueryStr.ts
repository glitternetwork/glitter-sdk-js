export interface Query {
  field: string;
  value: string | number;
  boost: number;
  prepareQuery: () => string;
}
export interface OperatorQuery extends Query {
  operator: string;
}

const reservedCharsReg = /[-+=&|><!(){}[\]^"~*?:\\/ ]/g;
const escapeCharReg = /\\/g;

export const reserveQuery = (value: string) => {
  const trimmedValue = value;

  return trimmedValue.replace(reservedCharsReg, '\\$&');
};

export const escapeQuery = (value: string) =>
  value.replace(escapeCharReg, '\\');
export const queryStringPrepare = (queries: Query[]) =>
  queries.map((query: Query) => query.toString()).join(' ');

const escapeTable: { [key: string]: string } = {};
escapeTable[String.fromCharCode(0)] = '\\0';
escapeTable['\\'] = '\\\\';
escapeTable['\n'] = '\\n';
escapeTable['\r'] = '\\r';
escapeTable[String.fromCharCode(26)] = '\\Z';
escapeTable['"'] = '\\"';
escapeTable["'"] = "\\'";

export const escapeString = (value: string): string => {
  return value
    .split('')
    .map(char => escapeTable[char] || char)
    .join('');
};

export const prepareSQL = (sql: string, sqlString: string): string => {
  const queryString = `'${escapeString(sqlString)}'`;
  return sql.replace('?', queryString);
};

// reserved
export class MatchQuery implements Query {
  constructor(
    public field: string,
    public value: string,
    public boost: number = 1.0
  ) {}
  prepareQuery() {
    return `${this.field}:${reserveQuery(this.value)}^${this.boost}`;
  }
  toString() {
    return this.prepareQuery();
  }
}

export class MatchPhraseQuery implements Query {
  constructor(
    public field: string,
    public value: string,
    public boost: number = 1.0
  ) {}
  prepareQuery() {
    return `${this.field}:"${this.value}"^${this.boost}`;
  }
  toString() {
    return this.prepareQuery();
  }
}

export class RegexpQuery implements Query {
  constructor(
    public field: string,
    public value: string,
    public boost: number = 1.0
  ) {}
  prepareQuery() {
    return `${this.field}:/${this.value}/^${this.boost}`;
  }
  toString() {
    return this.prepareQuery();
  }
}

export class NumericRangeQuery implements OperatorQuery {
  constructor(
    public field: string,
    public operator: string,
    public value: number,
    public boost: number = 1.0
  ) {}
  prepareQuery() {
    return `${this.field}:${this.operator}${this.value}^${this.boost}`;
  }
  toString() {
    return this.prepareQuery();
  }
}

export class DateRangeQuery implements OperatorQuery {
  constructor(
    public field: string,
    public operator: string,
    public value: string,
    public boost: number = 1.0
  ) {}
  prepareQuery() {
    return `${this.field}:${this.operator}"${this.value}"^${this.boost}`;
  }
  toString() {
    return this.prepareQuery();
  }
}
