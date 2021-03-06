import {
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  POST_DOCUMENT,
  DELETE_DOCUMENT,
  REQUEST_DOCUMENT,
  RECEIVE_DOCUMENT,
  UPDATE_DOCUMENT,
  RESET_DOCUMENTS,
  UPDATE_SELECTED_SHAPE,
  ADD_SHAPE,
  DELETE_SHAPE,
  CUT_SHAPE,
  COPY_SHAPE,
  PASTE_SHAPE
} from 'actions/document'

const defaultState = {
  documents: [],
  currentDocument: null,
  selectedShape: null,
  clipboardData: null,
  isRequestingData: false,
  postDocumentFailure: false
}

export default function documentReducer(state = defaultState, action) {

  switch (action.type) {
  case REQUEST_DOCUMENTS:
  case REQUEST_DOCUMENT:
    return Object.assign({}, state, {
      isRequestingData: true
    })

  case RECEIVE_DOCUMENTS:
    return Object.assign({}, state, {
      documents: action.documents,
      isRequestingData: false
    })

  case ADD_SHAPE: {
    const updatedDocument = Object.assign({}, state.currentDocument, {
      shapes: [
        ...state.currentDocument.shapes,
        action.newShape
      ]
    })

    return Object.assign({}, state, {
      currentDocument: updatedDocument,
      selectedShape: action.newShape
    })
  }

  case DELETE_SHAPE: {
    const shapeToDelete = state.selectedShape
    const updatedShapes = [...state.currentDocument.shapes]
    updatedShapes.forEach(s => {
      if (s.z > shapeToDelete.z) { s.z -= 1 }
    })

    const updatedDocument = Object.assign({}, state.currentDocument, {
      shapes: updatedShapes.filter(s => s.id !== shapeToDelete.id)
    })

    return Object.assign({}, state, {
      currentDocument: updatedDocument,
      selectedShape: null
    })
  }

  case CUT_SHAPE: {
    const shapeToCut = state.selectedShape
    const updatedShapes = [...state.currentDocument.shapes]
    updatedShapes.forEach(s => {
      if (s.z > shapeToCut.z) { s.z -= 1 }
    })

    const updatedDocument = Object.assign({}, state.currentDocument, {
      shapes: updatedShapes.filter(s => s.id !== shapeToCut.id)
    })

    const copiedShape = Object.assign({}, shapeToCut, { id: null, z: null })

    return Object.assign({}, state, {
      currentDocument: updatedDocument,
      clipboardData: copiedShape,
      selectedShape: null
    })
  }

  case COPY_SHAPE: {
    const shapeToCopy = state.selectedShape
    const copiedShape = Object.assign({}, shapeToCopy, { id: null, z: null })
    return { ...state, clipboardData: copiedShape }
  }

  case PASTE_SHAPE: {
    const newIdx = state.currentDocument.shapes.length + 1
    const pasteShape = Object.assign({}, state.clipboardData, {
      id: newIdx,
      z: newIdx
    })

    const updatedDocument = Object.assign({}, state.currentDocument, {
      shapes: [
        ...state.currentDocument.shapes,
        pasteShape
      ]
    })

    return Object.assign({}, state, {
      currentDocument: updatedDocument,
      selectedShape: pasteShape
    })
  }

  case UPDATE_SELECTED_SHAPE: {
    let updatedState = {}
    const sender = action.selectedShape

    /**
     * If sender is not null, then a new shape has been selected or existing
     * shape that is currently selected has been modified
     */
    if (sender !== null) {
      /**
       * Update shape action only send the delta, so create a new shape object
       * with the previous and new properties merged
       */
      const selectedShape = { ...state.selectedShape, ...sender }
      const currentShapes = state.currentDocument.shapes

      /**
       * If a currently selected shape is being modified replace the existing
       * shape in the documents shape array with a new shapes
       */
      if (state.selectedShape !== null && (
          typeof sender.id === 'undefined' ||
          sender.id === state.selectedShape.id)) {

        const idx = currentShapes.findIndex(shape => state.selectedShape.id === shape.id)
        const shapes = Object.assign([], currentShapes, { [idx] : selectedShape })

        updatedState.currentDocument = { ...state.currentDocument, shapes };
      }

      updatedState.selectedShape = selectedShape

    } else {
      /**
       * A shape has been deselected so nullify the selectedShape property
       */
      updatedState.selectedShape = null
    }

    return { ...state, ...updatedState }
  }

  case POST_DOCUMENT: {
    const updatedState = { documents: [...state.documents, action.doc] }
    return { ...state, ...updatedState }
  }

  case DELETE_DOCUMENT: {
    const updatedState = { documents: state.documents.filter(doc => doc.id !== action.doc.id) }
    return { ...state, ...updatedState }
  }

  case RECEIVE_DOCUMENT:
  case UPDATE_DOCUMENT: {
    let updatedState = { currentDocument: action.doc }

    if (!action.doc) {
      updatedState.selectedShape = null
      updatedState.clipboardData = null
    }

    return { ...state, ...updatedState }
  }

  case RESET_DOCUMENTS:
    return {
      documents: [],
      currentDocument: null,
      isRequestingData: false,
      clipboardData: null,
      selectedShape: null
    }

  default:
    return state
  }
}
