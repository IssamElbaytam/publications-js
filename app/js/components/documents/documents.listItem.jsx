import React from 'react'
import moment from 'moment'

export const DocumentsListItem = ({
  doc,
  selectDocument,
  selectedDocument
}) => {
  const selected = selectedDocument && selectedDocument.id === doc.id
  const lastModifiedDate = new Date(doc.lastModified)
  const formattedDate = moment(lastModifiedDate).format('MMM D, h:mm A')

  return <li
    className={ selected ? 'selected' : undefined }
    onClick={ e => selectDocument(doc, e) } >
    <div className="content">
      <div className="title">{ doc.name }</div>
      <div className="description">
        { formattedDate }
      </div>
    </div>
  </li>
}
