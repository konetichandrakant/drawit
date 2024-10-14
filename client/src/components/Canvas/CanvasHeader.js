import drawitLogo from '../../images/drawit_logo';

function CanvasHeader({ style, details }) {
    const { level, drawingItem } = details;

    // display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', height: '80vh'

    return <>
        <div style={style}>
            {
                level && (
                    <div>
                        <img src={drawitLogo} />
                        Draw - {drawingItem}
                        Level - {level}
                    </div>
                )
            }
            {
                !level && (
                    <div>
                        <img src={drawitLogo} />
                        Draw - {drawingItem}
                    </div>
                )
            }
        </div>
    </>
}

export default CanvasHeader;