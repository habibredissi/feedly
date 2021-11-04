import React, { useCallback, useEffect } from "react"
import "../styles/search.scss"
import Books from "../api/books"
import { useState } from "react"
import Suggestions from "./Suggestions"
import { debounce } from "lodash"

const Search = () => {
  const [suggestions, setSuggestions] = useState({
    suggestionsBooks: [],
    suggestionsAuthors: []
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  /** Create an instance of the Class Books */
  const api = new Books()

  const filterBooks = (books) => {
    let matches
    /** We use reduce() to create an object with 2 properties books & authors */
    /** Depending on the match (author or book title),
     *  We push the book to the right property */
    const regex = new RegExp(`${searchTerm}`, "gi")
    matches = books.reduce(
      (accumulator, book) => {
        if (book.title.match(regex)) accumulator["suggestionsBooks"].push(book)
        if (book.author.match(regex))
          accumulator["suggestionsAuthors"].push(book)
        return accumulator
      },
      { suggestionsBooks: [], suggestionsAuthors: [] }
    )
    setSuggestions(matches)
  }

  /** Make a request to the mock server */
  const makeAnApiCall = async () => {
    try {
      const books = await api.askListBooks()
      if (books.length > 0) {
        filterBooks(books)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /** We use lodash debounce method to optimize to number
   * of requests sent to the mocked server
   * useCallback to update the function only when searchTerm updates
   * */
  const debounceFetchData = useCallback(debounce(makeAnApiCall, 250), [
    searchTerm
  ])

  /** We call debounceFetchData inside useEffect when the value of searchTerm changes
   *  debounceFetchData.cancel to cancel previous calls during useEffect cleanup.
   * */
  useEffect(() => {
    searchTerm.length > 0 ? setShowSuggestions(true) : setShowSuggestions(false)
    debounceFetchData()
    return debounceFetchData.cancel
  }, [searchTerm, debounceFetchData])

  return (
    <header>
      <div className="search">
        <p className="search__title">Find Your Favorite Books</p>
        <div className="search__box">
          <input
            id="search__input"
            type="text"
            name="search"
            className={`search__input ${
              showSuggestions && `search__input--active`
            }`}
            autoComplete="off"
            placeholder="Search by title or author"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false)
              }, 100)
            }}
          />
          <div
            className={`search__autocom ${
              searchTerm.length > 0 &&
              showSuggestions &&
              `search__autocom--active`
            }`}
          >
            <Suggestions
              suggestions={suggestions}
              setSearchTerm={setSearchTerm}
              setShowSuggestions={setShowSuggestions}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Search
