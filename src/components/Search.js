import React from "react"
import "../styles/search.scss"
import Books from "../api/books"
import { useEffect, useState } from "react"
import Suggestions from "./Suggestions"

const Search = () => {
  const [books, setBooks] = useState([])
  const [suggestions, setSuggestions] = useState({
    suggestionsBooks: [],
    suggestionsAuthors: []
  })
  const [keyword, setKeyword] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  /** Load the books list when the app is loaded */
  useEffect(() => {
    const api = new Books()
    /** Async function to get the books list from the api */
    const loadBooks = async () => {
      const response = await api.askListBooks()
      setBooks(response)
    }
    loadBooks()
  }, [books])

  /** Handle the text tapped by the user */
  const handleKeywordChange = (keyword) => {
    setKeyword(keyword)
    setShowSuggestions(true)
    if (keyword.length > 0) {
      let matches
      /** We use reduce() to create an object with 2 properties books & authors */
      /** Depending on the match (author or book title),
       * we add the book to the right property */
      matches = books.reduce(
        (accumulator, book) => {
          const regex = new RegExp(`${keyword}`, "gi")
          if (book.title.match(regex))
            accumulator["suggestionsBooks"].push(book)
          if (book.author.match(regex))
            accumulator["suggestionsAuthors"].push(book)
          return accumulator
        },
        { suggestionsBooks: [], suggestionsAuthors: [] }
      )
      setSuggestions(matches)
    }
  }

  return (
    <header>
      <div className="search">
        <p className="search__title">Find Your Favorite Books</p>
        <div className="search__box">
          <input
            id="search__input"
            className="search__input"
            type="text"
            name="search"
            onChange={(e) => handleKeywordChange(e.target.value)}
            value={keyword}
            placeholder="Search by title or author"
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false)
              }, 100)
            }}
          />
          <div
            className={`search__autocom ${
              keyword.length > 0 && showSuggestions && `search__autocom--active`
            }`}
          >
            <Suggestions
              suggestions={suggestions}
              setKeyword={setKeyword}
              setShowSuggestions={setShowSuggestions}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Search
