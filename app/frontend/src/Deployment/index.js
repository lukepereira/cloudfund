import React from 'react'
import './Deployment.css'


class Deployment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectName: '',
            githubRepository:'',
        }
    }    

    handleName = (event) => this.setState({projectName: event.target.value})
    
    handleRepository = (event) => this.setState({githubRepository: event.target.value})    

    handleSubmit = () => {
        return
    }
    
    render() {
        return (
            <div className="Deployment">
                <form  onSubmit={this.handleSubmit}>
                    <h1>Deployment</h1>
                    <label>
                        Container Image
                        <input 
                            placeholder="https://docker.com/" 
                            onChange={this.handleName}
                            className={'full-width'}
                        >
                        </input>
                    </label>
                    
                    <label>
                        Deployment YAML
                        <textarea 
                            placeholder=""
                            rows='12'
                            col='25'
                            // onChange={this.handleName}
                            className={'full-width'}
                        >
                        </textarea>
                    </label>
                    
                    <label>
                        Repository
                        <input 
                            placeholder="https://github.com/" 
                            onChange={this.handleRepository}
                            className={'full-width'}
                        >
                        </input>
                    </label>
                    <button>Deploy</button>
                </form>
            </div>
        )
    }
}

export default Deployment