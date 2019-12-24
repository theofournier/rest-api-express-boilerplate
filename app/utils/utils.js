const { filtering, mongoQuery } = require("../utils/constants");

const initOptions = ({ page, limit, sort }) => {
  const options = {};
  if (limit) options.limit = limit;
  if (limit && page) options.skip = limit * (page - 1);

  if (sort) {
    const optionsSort = {};
    for (const sortItem in sort) {
      optionsSort[sortItem] = sort[sortItem] || 1;
    }
    options.sort = optionsSort;
  }
  return options;
};

const initFilters = filters => {
  const finalFilters = {};
  for (const filterItem in filters) {
    if (typeof filters[filterItem] !== "object") {
      finalFilters[filterItem] = filters[filterItem];
    } else {
      const operators = {};
      for (const operator in filters[filterItem]) {
        const value = filters[filterItem][operator];
        switch (operator) {
          case filtering.REGEX:
            operators[mongoQuery[filtering.REGEX]] = new RegExp(value, "i");
            break;
          case filtering.BEFORE:
            operators[mongoQuery[filtering.LTE]] = new Date(value);
            break;
          case filtering.AFTER:
            operators[mongoQuery[filtering.GTE]] = new Date(value);
            break;
          default:
            operators[mongoQuery[operator]] = value;
            break;
        }
      }
      finalFilters[filterItem] = operators;
    }
  }
  return finalFilters;
};

const example = {
  options: {
    page: 1,
    limit: 100,
    sort: {
      _id: 1,
      createdDate: -1
    }
  },
  filters: {
    _id: "user1",
    createdAt: {
      after: "2019-10-21",
      before: "2019-10-30"
    },
    name: {
      regex: "theo"
    },
    role: {
      in: ["admin", "user"]
    },
    "size.h": {
      gte: 10,
      lte: 50
    },
    $or: {
      verified: true,
      age: {
        exists: true,
        gt: 10
      }
    }
  }
};

exports.parseMongoQuery = queryBase64 => {
  if (!queryBase64) {
    return {};
  }
  const query = JSON.parse(
    Buffer.from(queryBase64, "base64").toString("ascii")
  );
  const data = {};
  if (query.options) {
    data.options = initOptions(query.options);
  }
  if (query.filters) {
    const filters = query.filters;
    // Extract filter or
    if (filters[filtering.OR]) {
      const filterOr = initFilters(filters[filtering.OR]);
      const finalFilterOr = [];
      // Transform object to list of obect
      for (const filterOrItem in filterOr) {
        finalFilterOr.push({ [filterOrItem]: filterOr[filterOrItem] });
      }
      data.filters = {
        ...data.filters,
        [mongoQuery[filtering.OR]]: finalFilterOr
      };
      delete filters[filtering.OR];
    }
    data.filters = Object.assign({}, data.filters, initFilters(filters));
  }
  return data;
};
