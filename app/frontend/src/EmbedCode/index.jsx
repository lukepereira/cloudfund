import React from 'react'
import PropTypes from 'prop-types'
import postscribe from 'postscribe'

export default class EmbedCode extends React.Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
  }

  componentDidMount = () => {
    if (typeof window === 'undefined') return
    postscribe(this.el, this.props.html)
  }

  shouldComponentUpdate = () => false

  render = () => {
      return (
          <div ref={comp => (this.el = comp)}></div>
      )
  }
}