import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { autobind } from 'core-decorators'

import DocumentsNavbar from 'components/documents/documents.navbar'
import DocumentItem from 'components/documents/document.item'
import NewDocumentModal from 'components/documents/documents.new.modal'
import UserAccountModal from 'components/user/user.account.modal'
import InputText from 'components/ui/input.text'

import { DocumentsSidebar } from 'components/documents/documents.sidebar'
import { DocumentsPane } from 'components/documents/documents.pane'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'
import * as ErrorActions from 'actions/errors'

export class Documents extends Component {
  constructor() {
    super(...arguments)

    this.state = {
      searchKeyword: '',
      selectedDocument: null,
      isNewDocModalOpen: false,
      isUserAccountModalOpen: false
    }
  }

  componentDidMount() {
    document.title = 'Publications — All Documents'
    this.props.getDocuments()
  }

  componentWillUnmount() {
    this.setState({selectedDocument: null})
    document.title = 'Publications'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documents.length > this.props.documents.length) {
      this.setState({isNewDocModalOpen: false})
    }
  }

  @autobind
  selectDocument(selectedDocument, event) {
    if (!!event) {
      event.stopPropagation()
    }

    this.setState({ selectedDocument })
  }

  @autobind
  searchKeywordChanged(event) {
    this.setState({searchKeyword: event.target.value})
  }

  @autobind
  toggleNewDocumentModal() {
    this.setState({
      isNewDocModalOpen: !this.state.isNewDocModalOpen
    })
  }

  @autobind
  toggleUserAccountModal() {
    this.setState({
      isUserAccountModalOpen: !this.state.isUserAccountModalOpen
    })
  }

  @autobind
  createNewDocument(options) {
    this.props.newDocument({
      name: options.name,
      width: options.width,
      height: options.height,
      shapes: options.shapes
    })
  }

  @autobind
  editDocument() {
    const selectedDocument = this.state.selectedDocument

    if (selectedDocument) {
      const {id} = selectedDocument
      this.props.history.push(`/documents/${id}/edit`)
    }
  }

  @autobind
  deleteDocument() {
    const selectedDocument = this.state.selectedDocument

    if (!!selectedDocument) {
      this.props.removeDocument(selectedDocument)
      this.setState({ selectedDocument: null })
    }
  }

  @autobind
  logOut() {
    const {history, logoutUser, clearDocuments} = this.props

    logoutUser(() => {
      clearDocuments()
      this.props.history.push('/')
    })
  }

  render() {
    const { documents, children } = this.props
    const { selectedDocument: doc } = this.state

    if (children) {
      return <div>{ children }</div>
    }

    const documentsPane = doc ? <DocumentsPane
      doc={ this.state.selectedDocument }
      editDocument={ this.editDocument } /> : undefined

    return <div className="app-content document">
      <DocumentsSidebar
        documents={ documents }
        selectedDocument={ doc }
        selectDocument={ this.selectDocument } />
      { documentsPane }
    </div>
  }
}

const mapStateToProps = state => ({ ...state.user, ...state.doc, ...state.errors })
const mapDispatchToProps = dispatch => bindActionCreators(
    { ...UserActions, ...DocumentActions, ...ErrorActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Documents)
