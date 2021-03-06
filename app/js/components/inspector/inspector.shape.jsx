import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'

import InspectorShapeBorder from './inspector.shape.border'
import InspectorShapeColor from './inspector.shape.color'
import InspectorShapeMetrics from './inspector.shape.metrics'
import InspectorShapeText from './inspector.shape.text'
import InspectorShapeLayer from './inspector.shape.layer'

export default class InspectorShape extends Component {
  render() {
    let inspectorContent = null

    if (this.props.shape) {
      const { type } = this.props.shape
      const shapeMetricsContent = (
        <InspectorShapeMetrics
          inputValueChanged={this.inputValueChanged}
          {...this.props} />
      )

      let shapeContentSections

      const shapeStyleProps = {
        shape: this.props.shape,
        updateShape: this.updateShape
      }

      switch (type) {
        case 'text':
        shapeContentSections = <div>
          <InspectorShapeText
            inputValueChanged={this.inputValueChanged}
            {...this.props} />
          <InspectorShapeLayer
            inputValueChanged={this.inputValueChanged}
            {...this.props} />
        </div>
        break

        case 'ellipse':
        case 'rect':
        shapeContentSections = <div>
          <InspectorShapeColor
            inputValueChanged={this.inputValueChanged}
            {...shapeStyleProps} />
          <InspectorShapeBorder
            inputValueChanged={this.inputValueChanged}
            {...shapeStyleProps} />
          <InspectorShapeLayer
            inputValueChanged={this.inputValueChanged}
            {...this.props} />
        </div>
        break
      }

      inspectorContent = <div>
          {shapeMetricsContent}
          {shapeContentSections}
      </div>

    } else {
      inspectorContent = <div className="inspector-pane inspector-pane-no-shape-selected">
        <div className="icon icon-big-shape-frame"></div>
        <div className="no-shape-label">No Shape Selected</div>
      </div>
    }

    return <div className="inspector-pane inspector-pane-document">
      {inspectorContent}
    </div>
  }

  @autobind
  inputValueChanged(event) {
    const {shape, updateShape} = this.props
    let updatedValue = event.target.value

    if (!isNaN(updatedValue)) {
      updatedValue = parseFloat(updatedValue)
    }

    shape[event.target.name] = updatedValue
    updateShape(shape)
  }
}
