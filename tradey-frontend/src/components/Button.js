import styled from "styled-components";

function Button(props) {
    return (
        <ButtonStyle onClick={props.function}>{props.text}</ButtonStyle>
    )
}

const ButtonStyle = styled.button`
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
width: fit-content;
height: fit-content;
padding: 12px 18px;
border: 1px solid white;
background-color: transparent;
border-radius: 25px;
font-size: 20px;
font-weight: 700;
color: white;
transition: 0.2s ease-in-out;
&:hover {
  cursor: pointer;
  background-color: white;
  color: black;
}
`

export default Button