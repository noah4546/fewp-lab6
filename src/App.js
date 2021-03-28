import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import EditIcon from "./images/edit.svg";
import DeleteIcon from "./images/delete.svg";

class GradeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseName: "",
            grade: ""
        };
    }

    handleButton() {
        this.props.onChange(this.props.editing ? 'edit' : 'add', this.state.courseName, this.state.grade);
    }

    handleCourseNameChange(event) {
        this.setState({courseName: event.target.value});
    }

    handleGradeChange(event) {
        this.setState({grade: event.target.value});
    }

    render() {
        return (
            <div>
                <h5 className="pb-2">Add Grade</h5>
                <div className="form-row">
                    <div className="col input-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Course name" 
                            value={this.state.courseName}
                            onChange={this.handleCourseNameChange.bind(this)}
                        />
                    </div>
                    <div className="col form-group">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Grade" 
                            min="0" 
                            max="100" 
                            value={this.state.grade}
                            onChange={this.handleGradeChange.bind(this)}
                        />
                    </div>
                    <div className="col form-group">
                        <Button 
                            variant="primary" 
                            onClick={this.handleButton.bind(this)}
                        >{this.props.editing ? 'Edit' : 'Add'}</Button>
                    </div>
                </div>
            </div>
        );
    }
}

class GradesList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let grades = this.props.grades.map(grade => (
            <tr key={grade.id}>
                <td>{grade.courseName}</td>
                <td>{grade.grade}</td>
                <td><Button variant="light"><img src={EditIcon} alt="edit" height="24px" /></Button></td>
                <td><Button variant="light"><img src={DeleteIcon} alt="delete" height="24px" /></Button></td>
            </tr>
        ));

        return (
            <div>
                <h5 className="pb-2">Grades</h5>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Grade</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades}
                    </tbody>
                </table>
            </div>
        );
    }
}

class GradesResults extends React.Component {
    constructor(props) {
        super(props);
    }

    calcMin() {
        return this.props.grades.reduce((min, b) => Math.min(min, b.grade), this.props.grades[0].grade);
    }

    calcMax() {
        return this.props.grades.reduce((max, b) => Math.max(max, b.grade), this.props.grades[0].grade);
    }

    calcAvg() {
        return this.props.grades.reduce((a, b) => a + b.grade, 0) / this.props.grades.length;
    }

    render() {
        return (
            <div>
                <h5 className="pb-2">Results</h5>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Minimum</td>
                            <td>{this.calcMin()}</td>
                        </tr>
                        <tr>
                            <td>Maximum</td>
                            <td>{this.calcMax()}</td>
                        </tr>
                        <tr>
                            <td>Average</td>
                            <td>{this.calcAvg()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grades: [
                {id: 1, courseName: "Math", grade: 90},
                {id: 2, courseName: "Science", grade: 50},
                {id: 3, courseName: "English", grade: 40},
            ],
            editing: false,
        };
    }

    handleGradeChange(type, courseName, grade) {
        if (type == 'add') {
            let grades = this.state.grades;
            grades.push({id: Math.random()*1000, courseName: courseName, grade: grade});
            this.setState({grades: grades});
        } else if (type == 'edit') {
            // Edit
        }
    }

    render() {
        return (
            <div className="App">
                <header>

                </header>
                <main className="container mt-5">
                    <div>
                        <GradeForm editing={this.state.editing} onChange={this.handleGradeChange.bind(this)} />
                    </div>
                    <div className="mt-4">
                        <GradesList grades={this.state.grades} />
                    </div>   
                    <div>
                        <GradesResults grades={this.state.grades} />
                    </div> 
                </main>
            </div>
          );
    }

}

export default App;
