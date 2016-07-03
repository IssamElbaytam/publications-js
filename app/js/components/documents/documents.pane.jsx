import React from 'react'
import Canvas from 'components/canvas/canvas'

export const DocumentsPane = ({
  doc,
  editDocument
}) => <div className="documents-pane">
  <h1>{ doc.name }</h1>
  <button onClick={ editDocument }>Edit</button>
  <div className="preview-pane">
    <Canvas
      doc={doc}
      dpi={72}
      zoom={1}
      selectable={false} />
  </div>
</div>
