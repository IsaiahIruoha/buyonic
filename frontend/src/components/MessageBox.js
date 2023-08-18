import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
  //prints a message allowing for the props text and assosciated variant for color
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
}
