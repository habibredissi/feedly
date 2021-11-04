import React, { useCallback, useEffect } from "react"
import "../styles/search.scss"
import Books from "../api/booksV2"
import { useState } from "react"
import Suggestions from "./Suggestions"
import { debounce } from "lodash"

const Search = () => {
  /** Create an instance of the Class Books */
  const api = new Books()
  const initialSuggestions = {
    suggestionsBooks: [],
    suggestionsAuthors: []
  }
  /** Initialise the State */
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  /** Make a request to the mock server */
  const makeAnApiCall = async () => {
    try {
      // WE WILL USE THE NEW VERSION OF THE MOCKED SERVER
      // PLEASE FIND IN THE FOLDER "api/booksV2.js"
      const suggestions = await api.askListBooks(searchTerm)
      const { suggestionsBooks, suggestionsAuthors } = suggestions
      if (suggestionsBooks.length > 0 || suggestionsAuthors.length > 0) {
        setSuggestions(suggestions)
      } else {
        setSuggestions(initialSuggestions)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /** We use lodash debounce method to optimize the number
   * of requests sent to the mocked server
   * useCallback to update the function only when searchTerm updates */
   // eslint-disable-next-line
  const debounceFetchData = useCallback(debounce(makeAnApiCall, 250), [
    searchTerm
  ])

  /** We call debounceFetchData inside useEffect when the value of searchTerm changes
   *  debounceFetchData.cancel to cancel previous calls during useEffect cleanup.*/
  useEffect(() => {
    searchTerm.length > 0 ? setShowSuggestions(true) : setShowSuggestions(false)
    debounceFetchData()
    return debounceFetchData.cancel
  }, [searchTerm, debounceFetchData])

  return (
    <header>
      <div className="search">
        <p className="search__title">Find your favorite books</p>
        <div className="search__box">
          <input
            id="search__input"
            type="text"
            name="search"
            autoComplete="off"
            value={searchTerm}
            className={`search__input ${
              showSuggestions && `search__input--active`
            }`}
            placeholder="Search by title or author"
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false)
              }, 300)
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
