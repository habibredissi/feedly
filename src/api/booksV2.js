import data from "./data.js"

export default class Books {
  askListBooks(searchTerm) {
    return this._mockServerRequest(searchTerm)
  }

  /** Maybe a better solution would be to filter the data in the back end
   *  I created a V2 of api/books.js that implements this improvment
   */
  _filterBooks = (books, searchTerm) => {
    let matches
    const regex = new RegExp(`${searchTerm}`, "gi")
    /** We use reduce() to create an object with 2 properties books & authors */
    /** Depending on the match (author or book title),
     *  We push the book to the right property */
    matches = books.reduce(
      (accumulator, book) => {
        if (book.title.match(regex)) accumulator["suggestionsBooks"].push(book)
        if (book.author.match(regex))
          accumulator["suggestionsAuthors"].push(book)
        return accumulator
      },
      { suggestionsBooks: [], suggestionsAuthors: [] }
    )
    return matches
  }

  _mockServerRequest = (searchTerm) => {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this._filterBooks(data.books, searchTerm))
      }, this._random())
    })
  }

  _random() {
    return Math.floor(Math.random() * 1200)
  }
}
