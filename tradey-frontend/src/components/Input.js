import styled from "styled-components";

function Input(props) {
    return (
        <InputStyle>
            <div class="group">
                <input type={props.type} id={props.id} name={props.name} required="required" value={props.value} onChange={e=>props.setValue(e.target.value)}/>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label for={props.id}><strong>{props.label}</strong></label>
            </div>
        </InputStyle>
    )
}

function Radio(props) {
    return (
        <RadioStyle>
            <label className="option-group">{props.label}
                <input type="radio" id={props.id} name={props.name} value={props.value} {...props.checked ? 'checked' : ''} onChange={e=>props.setValue(e.target.value)}/>
                <span className="radio-checkmark"></span>
            </label>
        </RadioStyle>
    )
}

function Checkbox(props) {
    return (
        <CheckboxStyle>
            <label for={props.id} className="option-group">{props.label}
                <input type="checkbox" id={props.id} name={props.name} value={props.value}  {...props.checked ? 'checked' : ''} onChange={e=>props.setValue(e.target.value)}/>
                <span className="box-checkmark"></span>
            </label>
        </CheckboxStyle>
    )
}

const InputStyle = styled.div`
.group { 
    position:relative; 
    margin:20px 0;
    color: white;
}
.group input {
    font-size:18px;
    padding:10px 10px 10px 5px;
    display:block;
    width: calc(100% - 10px);
    border:none;
    border-bottom:1px solid #757575;
    background-color: transparent;
    color: transparent;
}
.group input:focus { 
    outline:none;
    color: white;
}
.group input:valid { 
    outline:none;
    color: white;
}
.group label {
    color:white;
    font-size:18px;
    font-weight:normal;
    position:absolute;
    left:5px;
    top:10px;
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
}

/* active state */
 .group input:focus ~ label, .group input:valid ~ label {
    top: -14px;
    font-size: 12px;
    color: white;
}

/* BOTTOM BARS */
 .group .bar { position:relative; display:block; width:320px; }
 .group .bar:before, .bar:after {
    content:'';
    height:2px; 
    width:0;
    bottom:1px; 
    position:absolute;
    background:white; 
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
}
 .group .bar:before {
    left:50%;   
}
 .group .bar:after {
    right:50%; 
}

/* active state */
.group  input:focus ~ .bar:before, input:focus ~ .bar:after {
    width:50%;
}

/* HIGHLIGHTER */
 .group .highlight {
    position:absolute;
    height:60%; 
    width:100px; 
    top:25%; 
    left:0;
    pointer-events:none;
    opacity:0.5;
}

/* active state */
 .group input:focus ~ .highlight {
    -webkit-animation:inputHighlighter 0.3s ease;
    -moz-animation:inputHighlighter 0.3s ease;
    animation:inputHighlighter 0.3s ease;
}
`

const RadioStyle = styled.div`
.option-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    position: relative;
    padding-left: 20px;
    margin-top: 12px;
    margin-left: 20px;
    cursor: pointer;
    font-size: 14px;
    color: white;
}

.option-group input {
    opacity: 1;
    position: absolute;
    cursor: pointer;
    height: 0;
    width: 0;
}
.radio-checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 15px;
    background-color: rgba(255,255,255,0.3);
    border: 1px solid white;
    border-radius: 50%;
    transition: 0.2s ease-in-out;
}

.option-group:hover .radio-checkmark {
    background-color: rgba(255,255,255,0.5);
}

.option-group input:checked ~ .radio-checkmark {
    background-color: #fff;
}
`

const CheckboxStyle = styled.div`
.option-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    position: relative;
    padding-left: 20px;
    margin-top: 12px;
    margin-left: 20px;
    cursor: pointer;
    font-size: 14px;
    color: white;
}
.option-group input {
    opacity: 1;
    position: absolute;
    cursor: pointer;
    height: 0;
    width: 0;
}
.box-checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 15px;
    background-color: rgba(255,255,255,0.3);
    border: 1px solid white;
    border-radius: 5px;
    transition: 0.2s ease-in-out;
}

.option-group:hover .box-checkmark {
    background-color: rgba(255,255,255,0.5);
}

.option-group input:checked ~ .box-checkmark {
    background-color: #fff;
}

.box-checkmark::after {
    content: "";
    position: absolute;
    display: none;
}

.option-group input:checked ~ .box-checkmark::after {
    display: block;
}

.option-group .box-checkmark::after {
    left: 5px;
    top: 0;
    width: 5px;
    height: 10px;
    border: solid black;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}
`

export {Input, Radio, Checkbox}