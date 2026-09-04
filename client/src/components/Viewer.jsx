function Viewer({ images, currentIndex, onClose, onNext, onPrev }) {
if (!images || images.length === 0 || currentIndex === null) {
        return null;
    }
const currentImage = images[currentIndex];
return (
        <div className="viewer-overlay">

            <button className="viewer-close" onClick={onClose}>
                ×
            </button>

            <button className="viewer-prev" onClick={onPrev}>
                ❮
            </button>

            <div className="viewer-content">

                <img
                    className="viewer-image"
                    src={currentImage.imageUrl}
                    alt={currentImage.title || "Gallery image"}
                />

                <div className="viewer-info">
                    <h2>{currentImage.title || "Untitled"}</h2>

                    {currentImage.description && (
                        <p>{currentImage.description}</p>
                    )}

                    {currentImage.tags?.length > 0 && (
                        <div className="tags">
                            {currentImage.tags.map((tag) => (
                                <span key={tag}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <button className="viewer-next" onClick={onNext}>
                ❯
            </button>

        </div>
    );
}

export default Viewer;

