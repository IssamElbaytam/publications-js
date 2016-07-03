import React from 'react'
import { DocumentsListItem } from './documents.listItem'

export const DocumentsList = ({
  documents,
  selectDocument,
  selectedDocument
}) => {
  const listItems = documents
    // .filter(doc => {
    //   if (!this.state.searchKeyword.length) {
    //     return true
    //   } else {
    //     const searchKeyword = this.state.searchKeyword.toLowerCase()
    //     return doc.name.toLowerCase().includes(searchKeyword)
    //   }
    // })
    .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
    .map(doc => <DocumentsListItem
      doc={ doc }
      selectDocument={ selectDocument }
      selectedDocument={ selectedDocument } />)

  return <ul
    onClick={ () => selectDocument(null) }
    className="documents-list">
    { listItems }
  </ul>
}
