import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadForm from "./components/UploadForm";
import Gallery from "./components/Gallery";
import Viewer from "./components/Viewer";
import { getImages } from "./api";

function App() {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);

    const [search, setSearch] = useState("");
    const [favoriteOnly, setFavoriteOnly] = useState(false);
    const [sort, setSort] = useState("recent");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showUpload, setShowUpload] = useState(false);

    const loadImages = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getImages({
                search,
                favorite: favoriteOnly,
                sort,
            });

            setImages(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load images."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [search, favoriteOnly, sort]);

    const favoriteCount = images.filter(
        (image) => image.isFavorite
    ).length;

    const handleUploaded = () => {
        setShowUpload(false);
        loadImages();
    };

    return (
        <div className="app-layout">

            <Sidebar
                favoriteOnly={favoriteOnly}
                onAllPhotos={() => setFavoriteOnly(false)}
                onFavorites={() => setFavoriteOnly(true)}
                onRecentlyAdded={() => {
                    setFavoriteOnly(false);
                    setSort("recent");
                }}
                totalImages={images.length}
                favoriteCount={favoriteCount}
                onUpload={() => setShowUpload(true)}
            />

            <main className="main-content">

                <div className="top-bar">
                    <div>
                        <h1>My Gallery</h1>
                        <p>Your beautiful memories</p>
                    </div>

                    <div className="gallery-controls">
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            aria-label="Search images"
                        />

                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                            aria-label="Sort images"
                        >
                            <option value="recent">
                                Recent
                            </option>
                            <option value="oldest">
                                Oldest
                            </option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="api-error">
                        <span>{error}</span>
                        <button onClick={loadImages}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="loading">
                        Loading images...
                    </div>
                ) : (
                    <Gallery
                        images={images}
                        onSelectImage={(image, index) =>
                            setCurrentIndex(index)
                        }
                        onImagesChanged={loadImages}
                        search={search}
                        favoriteOnly={favoriteOnly}
                    />
                )}

                <Viewer
                    images={images}
                    currentIndex={currentIndex}
                    onClose={() => setCurrentIndex(null)}
                    onNext={() =>
                        setCurrentIndex((current) =>
                            current === images.length - 1
                                ? 0
                                : current + 1
                        )
                    }
                    onPrev={() =>
                        setCurrentIndex((current) =>
                            current === 0
                                ? images.length - 1
                                : current - 1
                        )
                    }
                    onImagesChanged={loadImages}
                />

            </main>

            {showUpload && (
                <div className="modal-overlay">
                    <div className="upload-modal">
                        <button
                            className="modal-close"
                            onClick={() => setShowUpload(false)}
                        >
                            ×
                        </button>

                        <UploadForm
                            onUploaded={handleUploaded}
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

export default App;
