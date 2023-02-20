import { useEffect, useState } from 'react';

function TodoForm({newtodo, setNewtodo, onClickHandle}) {

    const[error, setError] = useState("");
    
    const handleFormFieldChange = (field_name, e) => {
        setNewtodo({...newtodo, [field_name] : e.target.value})
        console.log(field_name)
        if (field_name === "dueDate") {
            var today = new Date();
            var due_date = new Date(e.target.value)
            if (today.getTime() >= due_date.getTime()) {
                alert("Choose a future date")
                return
            }
        }
    }

    return (
        <>
            <form className="form" onSubmit={
                (e) => {
                    e.preventDefault();
                    onClickHandle();

                    // if (newtodo.title == "" || newtodo.description == ""){
                    //     setError("Please fill all fields")
                    // } else {
                    //     setError("")
                    // }
                }
            }>
                <input className="form_input" name="title" type="text" value={newtodo.title} placeholder="Title"
                onChange={(e) => handleFormFieldChange("title", e)} required maxLength={100}/> 

                <input className="form_input" name="description" type="text" value={newtodo.description} placeholder="Description"
                onChange={(e) => handleFormFieldChange("description", e)} required={true} maxLength={1000}/> 

                <input className="form_input" name="due_date" type="date" value={newtodo.dueDate}
                onChange={(e) => handleFormFieldChange("dueDate", e)} /> 

                <select className="form_input" name="tags" placeholder="tags" value={newtodo.tags} 
                onChange={(e) => handleFormFieldChange("tags", e)} required>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Tertiary">Tertiary</option>
                </select>  

                <select className="form_input" name='status' onChange={(e) => handleFormFieldChange("status", e)}>
                    <option value="Open">Open</option>
                    <option value="Working">Working</option>
                    <option value="Done">Done</option>
                    <option value="Overdue">Overdue</option>
                </select>

                {/* <button className="form_btn" type='button' onClick={
                    () => {
                        if (newtodo.title == "" || newtodo.description == ""){
                            setError("Please fill all fields")
                        } else {
                            setError("")
                            onClickHandle();
                        }
                    }
                }>ADD TODO</button> */}

                <button className="form_btn" type='submit'>ADD TODO</button>

                {/* {error != "" ? <p className="error_text">{error}</p> : null} */}
            </form>
        </>
    );
}

export default TodoForm;
