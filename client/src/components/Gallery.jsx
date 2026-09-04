
import { useState } from "react";

import {
    deleteImage,
    toggleFavorite,
    updateImage,
} from "../api";

function Gallery({
    images,
    onSelectImage,
    onImagesChanged,
    search,
    favoriteOnly,
}) {
    const [editingImage, setEditingImage] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editTags, setEditTags] = useState("");
    const [error, setError] = useState("");
    const [editError, setEditError] = useState("");

    const handleDelete = async (id) => {
        try {
            setError("");
            await deleteImage(id);
            onImagesChanged();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete image."
            );
        }
    };

    const handleFavorite = async (image) => {
        try {
            setError("");

            await toggleFavorite(
                image._id,
                !image.isFavorite
            );

            onImagesChanged();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update favorite."
            );
        }
    };

    const openEdit = (image) => {
        setEditingImage(image);
        setEditTitle(image.title || "");
        setEditDescription(image.description || "");
        setEditTags(image.tags?.join(", ") || "");
        setEditError("");
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        const title = editTitle.trim();
        const description = editDescription.trim();

        const tags = editTags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);

        if (!title) {
            setEditError("Title is required.");
            return;
        }

        if (title.length > 80) {
            setEditError("Title must be 80 characters or less.");
            return;
        }

        if (description.length > 240) {
            setEditError(
                "Description must be 240 characters or less."
            );
            return;
        }

        if (tags.length > 5) {
            setEditError("Maximum 5 tags are allowed.");
            return;
        }

        try {
            setEditError("");

            await updateImage(
                editingImage._id,
                title,
                description,
                tags
            );

            setEditingImage(null);
            onImagesChanged();
        } catch (error) {
            setEditError(
                error.response?.data?.message ||
                "Failed to update image."
            );
        }
    };

    if (images.length === 0) {
        return (
            <div className="empty-state">
                <h2>
                    {search || favoriteOnly
                        ? "No images found"
                        : "No images yet"}
                </h2>

                <p>
                    {search || favoriteOnly
                        ? "No images match your current search or filter."
                        : "Upload your first image to start your gallery."}
                </p>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="gallery-error">
                    {error}
                </div>
            )}

            <div className="gallery-grid">
                {images.map((image, index) => (
                    <div
                        className="gallery-item"
                        key={image._id}
                    >
                        <div className="image-wrapper">
                            <img
                                src={image.imageUrl}
                                alt={image.title || "Gallery image"}
                                onClick={() =>
                                    onSelectImage(image, index)
                                }
                            />

                            <button
                                type="button"
                                className={
                                    image.isFavorite
                                        ? "favorite-star active"
                                        : "favorite-star"
                                }
                                onClick={() =>
                                    handleFavorite(image)
                                }
                                aria-label={
                                    image.isFavorite
                                        ? "Remove from favorites"
                                        : "Add to favorites"
                                }
                            >
                                {image.isFavorite ? "★" : "☆"}
                            </button>
                        </div>

                        <div className="image-info">
                            <h3>
                                {image.title || "Untitled"}
                            </h3>

                            {image.description && (
                                <p>{image.description}</p>
                            )}

                            {image.tags?.length > 0 && (
                                <div className="tags">
                                    {image.tags.map((tag) => (
                                        <span key={tag}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="image-actions">
                            <button
                                type="button"
                                onClick={() => openEdit(image)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDelete(image._id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingImage && (
                <div
                    className="modal-overlay"
                    onClick={() => setEditingImage(null)}
                >
                    <div
                        className="edit-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() =>
                                setEditingImage(null)
                            }
                        >
                            ×
                        </button>

                        <h2>Edit Image</h2>
                        <p className="modal-subtitle">
                            Update your image details
                        </p>

                        <form onSubmit={handleEdit}>
                            <label>Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) =>
                                    setEditTitle(
                                        e.target.value
                                    )
                                }
                                maxLength={80}
                                placeholder="Enter title"
                            />

                            <label>Description</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) =>
                                    setEditDescription(
                                        e.target.value
                                    )
                                }
                                maxLength={240}
                                placeholder="Enter description"
                            />

                            <label>Tags</label>
                            <input
                                type="text"
                                value={editTags}
                                onChange={(e) =>
                                    setEditTags(
                                        e.target.value
                                    )
                                }
                                placeholder="nature, travel, sunset"
                            />

                            {editError && (
                                <p className="edit-error">
                                    {editError}
                                </p>
                            )}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setEditingImage(null)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Gallery;

