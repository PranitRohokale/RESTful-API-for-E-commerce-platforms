// base - Product.find()
// base - Product.find({email: {"hitesh@lco.dev"}})

//bigQ - //search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199&limit=5

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }
  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i", //case insensitive
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  pager(resultPerPage) {
    const currentpage = 1;
    if (this.base.page) {
      currentpage = this.base.page;
    }
    const skipVal = resultPerPage * (currentpage - 1);

    this.base = this.base.limit(resultPerPage).skip(skipVal);
    return this;
  }

  filter() {
    const copyQ = { ...this.bigQ };

    delete copyQ["search"];
    delete copyQ["page"];
    delete copyQ["category"];
    delete copyQ["limit"];

    let filterString = JSON.stringify(copyQ);

    filterString = filterString.replace(/\b(gte|lte|gt|lt)\b/g, (m) => `$${m}`);

    //creating obj
    filterString = JSON.parse(filterString);

    this.base = this.base.find(filterString);
    return this;
  }
}

module.exports = WhereClause;
