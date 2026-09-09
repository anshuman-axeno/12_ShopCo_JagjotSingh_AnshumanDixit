import '../../../styles/components/_spinner.scss';

function Spinner({ message = 'Loading...', fullScreen = false }) {
  return (
    <div className={`spinner-wrapper ${fullScreen ? 'spinner-wrapper--fullscreen' : ''}`}>
      <div className="spinner" role="status" aria-label="loading"></div>
      {message && <p className="spinner-text">{message}</p>}
    </div>
  );
}

export default Spinner;

