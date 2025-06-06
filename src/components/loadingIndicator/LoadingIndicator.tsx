import { ClipLoader } from 'react-spinners';

function LoadingIndicator() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        height: '100vh', // Full height of the viewport
    };

    return (
        <div style={containerStyle}>
            <ClipLoader color="#36D7B7" loading={true} size={50} />
        </div>
    );
}

export default LoadingIndicator;