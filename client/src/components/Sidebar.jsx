function Sidebar({
    favoriteOnly,onAllPhotos,onFavorites,onRecentlyAdded,totalImages,favoriteCount,onUpload,}) {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon">
                    <span>◈</span>
                </div>
<div>
                  <h2>PhotoVault</h2>
                    <p>MERN Gallery</p>
                </div>
            </div>

           
            <div className="sidebar-section">
                <h4>WORKSPACE</h4>

                <button
                    type="button"
                    className={!favoriteOnly ? "sidebar-item active" : "sidebar-item"}
                    onClick={onAllPhotos}
                >
                    <span className="sidebar-icon">▦</span>
                    <span>All photos</span>
                    <span className="sidebar-count">
                        {totalImages}
                    </span>
                </button>

                <button
                    type="button"
                    className={favoriteOnly ? "sidebar-item active" : "sidebar-item"}
                    onClick={onFavorites}
                >
                    <span className="sidebar-icon">★</span>
                    <span>Favorites</span>
                    <span className="sidebar-count">
                        {favoriteCount}
                    </span>
                </button>

                <button
                    type="button"
                    className="sidebar-item"
                    onClick={onRecentlyAdded}
                >
                    <span className="sidebar-icon">↗</span>
                    <span>Recently added</span>
                </button>
            </div>

            {/* Storage */}
            <div className="sidebar-section">
                <h4>STORAGE</h4>

                <button
                    type="button"
                    className="sidebar-item"
                >
                    <span className="sidebar-icon">◌</span>
                    <span>Local uploads</span>
                </button>

                <button
                    type="button"
                    className="sidebar-item"
                >
                    <span className="sidebar-icon">⚙</span>
                    <span>Settings</span>
                </button>
            </div>

            {/* Upload */}
            <button
                type="button"
                className="upload-sidebar-btn"
                onClick={onUpload}
            >
                ＋ Upload Image
            </button>

        </aside>
    );
}

export default Sidebar;
