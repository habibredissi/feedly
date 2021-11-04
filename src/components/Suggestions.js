import React from "react"
import "../styles/suggestions.scss"

const Suggestions = ({ suggestions, setSearchTerm, setShowSuggestions }) => {
  const { suggestionsBooks, suggestionsAuthors } = suggestions

  /** Function to render and format the list of suggestions
   *  Depending of the type of the suggestion (Book or Author)
   */
  const renderList = (books, type = "book") => {
    return books.map((book, index) => (
      /** It would have been better to have a unique ID
       *  Using index is not the best pratice but we will use it
       *  for the sake of the exercice
       */
      <li
        key={index}
        className="suggestions__item"
        onClick={() => handleSlection(book.title)}
      >
        <p className="suggestions__title">
          {type === "book" ? book.title : book.author}
        </p>
        <span className="suggestions__subtitle">
          {type === "book"
            ? `${book.author} published in ${book.year}`
            : `wrote ${book.title}`}
        </span>
      </li>
    ))
  }

  /** Handle the user's selection */
  const handleSlection = (selectedBookTitle) => {
    setSearchTerm(selectedBookTitle)
  }

  return (
    <>
      <ul className="suggestions">
        {suggestionsBooks.length > 0 && (
          <>
            <li className="suggestions__section">Title</li>
            {renderList(suggestionsBooks, "book")}
          </>
        )}
        {suggestionsAuthors.length > 0 && (
          <>
            <li className="suggestions__section">Author</li>
            {renderList(suggestionsAuthors, "author")}
          </>
        )}
        {suggestionsBooks.length === 0 && suggestionsAuthors.length === 0 && (
          <li className="suggestions__nomatches">No matches</li>
        )}
      </ul>
    </>
  )
}

export default Suggestions
