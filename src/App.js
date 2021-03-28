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
            grade: {id: -1, courseName: "", grade: ""},
            editFiled: false,
            courseValid: false,
            gradeValid: false,
            validationOn: false,
        }; 
    }

    checkValidation() {
        let valid = true;

        if (this.state.grade.courseName === "") {
            if (this.state.courseValid) this.setState({courseValid: false});
            valid = false;
        } else {
            if (!this.state.courseValid) this.setState({courseValid: true});
        }

        if (this.state.grade.grade === "" || this.state.grade.grade < 0 || this.state.grade.grade > 100) {
            if (this.state.gradeValid) this.setState({gradeValid: false});
            valid = false;
        } else {
            if (!this.state.gradeValid) this.setState({gradeValid: true});
        }

        if (!this.state.validationOn) {
            if (!this.state.courseValid || !this.state.gradeValid)
                this.setState({validationOn: true});
        }

        return valid;
    }

    handleButton() {
        if (this.checkValidation()) {
            this.setState({validationOn: false});
            this.setState({courseValid: false});
            this.setState({gradeValid: false});
            this.props.onChange(this.props.editing ? 'edit' : 'add', this.state.grade);
        }
    }

    handleCourseNameChange(event) {
        let grade = {id: this.state.grade.id, courseName: event.target.value, grade: this.state.grade.grade};
        this.setState({grade: grade});
    }

    handleGradeChange(event) {
        let grade = {id: this.state.grade.id, courseName: this.state.grade.courseName, grade: event.target.value};
        this.setState({grade: grade});
    }

    componentDidUpdate() {
        if (this.state.validationOn) this.checkValidation();

        if (this.props.editing && !this.state.editFiled) {
            this.setState({grade: this.props.editGrade});
            this.setState({editFiled: true});
        }

        if (!this.props.editing && this.state.editFiled) {
            this.setState({grade: {id: -1, courseName: "", grade: ""}});
            this.setState({editFiled: false});
        }
    }

    render() {
        let courseNameClass = "";
        let gradeClass = "";
        if (this.state.validationOn) {
            courseNameClass = (this.state.courseValid ? "is-valid" : "is-invalid");
            gradeClass = (this.state.gradeValid ? "is-valid" : "is-invalid");
        }

        return (
            <div>
                <h5 className="pb-2">Add Grade</h5>
                <div className="form-row">
                    <div className="col-md-4 col-sm-6 col-xs-12 input-group mt-2">
                        <input 
                            type="text" 
                            className={"form-control " + courseNameClass}
                            placeholder="Course name" 
                            value={this.state.grade.courseName}
                            onChange={this.handleCourseNameChange.bind(this)}
                        />
                        <div className="invalid-feedback">
                            Course name must not be empty
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-4 col-xs-12 form-group mt-2">
                        <input 
                            type="number" 
                            className={"form-control " + gradeClass}
                            placeholder="Grade" 
                            min="0" 
                            max="100" 
                            value={this.state.grade.grade}
                            onChange={this.handleGradeChange.bind(this)}
                        />
                        <div className="invalid-feedback">
                            Grade must be between 0 and 100
                        </div>
                    </div>
                    <div className="col-sm-2 col-xs-12 form-group mt-2">
                        <Button 
                            variant="primary" 
                            block
                            onClick={this.handleButton.bind(this)}
                        >{this.props.editing ? 'Edit' : 'Add'}</Button>
                    </div>
                </div>
            </div>
        );
    }
}

class GradesList extends React.Component {

    handleEdit(id) {
        this.props.onEdit(id);
    }

    handleDelete(id) {
        this.props.onDelete(id);
    }

    render() {
        let grades = this.props.grades.map(grade => (
            <tr key={grade.id}>
                <td>{grade.courseName}</td>
                <td>{grade.grade}</td>
                <td>
                    <Button 
                        variant="light" 
                        onClick={() => this.handleEdit(grade.id)}>
                            <img src={EditIcon} alt="edit" height="24px" />
                    </Button>
                </td>
                <td>
                    <Button 
                        variant="light" 
                        onClick={() => this.handleDelete(grade.id)}>
                            <img src={DeleteIcon} alt="delete" height="24px" />
                    </Button>
                </td>
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

    calcMin() {
        if (this.props.grades.length === 0) return "";
        return this.props.grades.reduce((min, b) => Math.min(min, b.grade), this.props.grades[0].grade);
    }

    calcMax() {
        if (this.props.grades.length === 0) return "";
        return this.props.grades.reduce((max, b) => Math.max(max, b.grade), this.props.grades[0].grade);
    }

    calcAvg() {
        if (this.props.grades.length === 0) return "";
        return this.props.grades.reduce((a, b) => a + Number(b.grade), 0) / this.props.grades.length;
    }

    render() {
        return (
            <div>
                <h5 className="pb-2">Results</h5>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Minimum</td>
                            <td>{this.calcMin().toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Maximum</td>
                            <td>{this.calcMax().toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Average</td>
                            <td>{this.calcAvg().toFixed(2)}</td>
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
            editGrade: {id: -1, courseName: "", grade: ""},
        };
    }

    handleGradeChange(type, grade) {
        if (type === 'add') {
            let grades = this.state.grades;
            grades.push({id: Math.random()*1000, courseName: grade.courseName, grade: grade.grade});
            this.setState({grades: grades});
        } else if (type === 'edit') {
            if (grade.id !== -1) {

                let grades = [];

                for (let i = 0; i < this.state.grades.length; i++) {
                    if (this.state.grades[i].id === grade.id) {
                        grades.push(grade);
                    } else {
                        grades.push(this.state.grades[i]);
                    }
                }

                this.setState({grades: grades});
            }
            this.setState({editing: false});
        }
    }

    handleEdit(id) {
        let index = -1;

        for (let i = 0; i < this.state.grades.length; i++) {
            if (this.state.grades[i].id === id) {
                index = i;
                break;
            }
        }
        
        this.setState({editGrade: this.state.grades[index]});
        this.setState({editing: true});  
    }

    handleDelete(id) {
        let grades = [];
        
        for (let i = 0; i < this.state.grades.length; i++) {
            if (this.state.grades[i].id !== id) {
                grades.push(this.state.grades[i]);
            }
        }

        this.setState({grades: grades});
    }

    render() {
        return (
            <div className="App">
                <header>

                </header>
                <main className="container mt-5">
                    <div>
                        <GradeForm 
                            editing={this.state.editing} 
                            editGrade={this.state.editGrade}
                            onChange={this.handleGradeChange.bind(this)} 
                        />
                    </div>
                    <div className="mt-4">
                        <GradesList 
                            grades={this.state.grades} 
                            onEdit={this.handleEdit.bind(this)}
                            onDelete={this.handleDelete.bind(this)}
                        />
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
