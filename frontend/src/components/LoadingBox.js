import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox() {
  //component resposible for the animated loading status used site wide
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>{' '}
      {/* for site accessibility, allows site readers to understand loading is taking place */}
    </Spinner>
  );
}
