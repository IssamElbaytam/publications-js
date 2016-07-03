import React from 'react'
import { DocumentsList } from './documents.list'

export const DocumentsSidebar = ({
  documents,
  selectDocument,
  selectedDocument
}) => <div className="document-sidebar">
  <div className="sidebar-content">
    <h1>Documents</h1>
    <DocumentsList
      documents={ documents }
      selectedDocument={ selectedDocument }
      selectDocument={ selectDocument } />
  </div>
</div>
