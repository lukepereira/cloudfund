import React from 'react'
import './Project.css'


class Project extends React.Component {
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
            <div className="Project">
                <form  onSubmit={this.handleSubmit}>
                    <h1>Project</h1>
                    <label>
                        Name
                        <input 
                            placeholder="My Project" 
                            onChange={this.handleName}>
                        </input>
                    </label>
                    
                    <label>
                        Project URL (optional)
                        <input 
                            placeholder="https://github.com/my_repository" 
                            onChange={this.handleRepository}
                            className={'full-width'}
                        >
                        </input>
                    </label>
                    
                    <button>Create</button>
                </form>
            </div>
        )
    }
}

export default Project