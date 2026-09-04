import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Image from "../model/image.js";
import upload from "../middleware/upload.js";
const router = express.Router();
const dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(dirname, "..", "uploads");

// Convert tags into clean lowercase tags
const cleanTags = (tags = "") =>
    (Array.isArray(tags) ? tags : tags.split(","))
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean);

// POST - Upload image with metadata
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const title = req.body.title?.trim();
        const description = req.body.description?.trim() || "";
        const tags = cleanTags(req.body.tags);

        if (!title) {
            await fs.promises.unlink(req.file.path).catch(() => {});
            return res.status(400).json({ message: "Title is required" });
        }

        if (title.length > 80) {
            return res.status(400).json({ message: "Title must be 80 characters or less" });
        }

        if (description.length > 240) {
            return res.status(400).json({ message: "Description must be 240 characters or less" });
        }

        if (tags.length > 5) {
            return res.status(400).json({ message: "Maximum 5 tags are allowed" });
        }

        const image = await Image.create({
            imageUrl: `${process.env.BASE_URL}/uploads/${req.file.filename}`,
            title,
            description,
            tags
        });

        res.status(201).json({
            message: "Image uploaded successfully",
            image
        });

    } catch (error) {
        if (req.file) {
            await fs.promises.unlink(req.file.path).catch(() => {});
        }

        res.status(400).json({ message: error.message });
    }
});

// GET - Images with search, favorite and sorting
router.get("/", async (req, res) => {
    try {
        const { search = "", favorite, sort = "recent" } = req.query;

        const query = {};

        if (search.trim()) {
            const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.$or = [
                { title: { $regex: safeSearch, $options: "i" } },
                { description: { $regex: safeSearch, $options: "i" } },
                { tags: { $regex: safeSearch, $options: "i" } }
            ];
        }

        if (favorite === "true") {
            query.isFavorite = true;
        }

        const images = await Image.find(query).sort(
            sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 }
        );

        res.json(images);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH - Edit title, description and tags
router.patch("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Image not found" });
        }

        const title = req.body.title?.trim();
        const description = req.body.description?.trim() || "";
        const tags = cleanTags(req.body.tags);

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (title.length > 80) {
            return res.status(400).json({ message: "Title must be 80 characters or less" });
        }

        if (description.length > 240) {
            return res.status(400).json({ message: "Description must be 240 characters or less" });
        }

        if (tags.length > 5) {
            return res.status(400).json({ message: "Maximum 5 tags are allowed" });
        }

        const image = await Image.findByIdAndUpdate(
            req.params.id,
            { title, description, tags },
            { new: true, runValidators: true }
        );

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.json(image);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH - Favorite / Unfavorite
router.patch("/:id/favorite", async (req, res) => {
    try {
        const image = await Image.findByIdAndUpdate(
            req.params.id,
            { isFavorite: req.body.isFavorite },
            { new: true, runValidators: true }
        );

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.json(image);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Delete image and file
router.delete("/:id", async (req, res) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        const filename = image.imageUrl.split("/uploads/")[1];

        if (filename) {
            await fs.promises
                .unlink(path.join(uploadDir, filename))
                .catch(() => {});
        }

        res.json({
            message: "Image deleted successfully",
            id: req.params.id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;