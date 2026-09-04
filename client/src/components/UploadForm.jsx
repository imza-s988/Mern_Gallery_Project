import { useState } from "react";
import { uploadImage } from "../api";

function UploadForm({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        const cleanTags = tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);

        // Title validation
        if (!file) {
            setError("Please select an image.");
            return;
        }

        if (!cleanTitle) {
            setError("Title is required.");
            return;
        }

        if (cleanTitle.length > 80) {
            setError("Title must be 80 characters or less.");
            return;
        }

        // Description validation
        if (cleanDescription.length > 240) {
            setError(
                "Description must be 240 characters or less."
            );
            return;
        }

        // Tags validation
        if (cleanTags.length > 5) {
            setError("Maximum 5 tags are allowed.");
            return;
        }

        try {
            setLoading(true);
            setProgress(0);

            await uploadImage(
                file,
                cleanTitle,
                cleanDescription,
                cleanTags,
                (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                            progressEvent.total
                        );

                        setProgress(percent);
                    }
                }
            );

            // Reset form after successful upload
            setFile(null);
            setTitle("");
            setDescription("");
            setTags("");
            setPreview("");
            setProgress(100);

            if (onUploaded) {
                onUploaded();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to upload image."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-form">
            <h2>Upload Image</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                />

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                    disabled={loading}
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    maxLength={240}
                    disabled={loading}
                />

                <input
                    type="text"
                    placeholder="Tags: nature, travel, mountain"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={loading}
                />

                {preview && (
                    <div className="upload-preview">
                        <img
                            src={preview}
                            alt="Selected image preview"
                        />
                    </div>
                )}

                {error && (
                    <p className="upload-error">
                        {error}
                    </p>
                )}

                {loading && (
                    <div className="upload-progress">
                        <p>Uploading... {progress}%</p>

                        <progress
                            value={progress}
                            max="100"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? `Uploading... ${progress}%`
                        : "Upload Image"}
                </button>
            </form>
        </div>
    );
}

export default UploadForm;