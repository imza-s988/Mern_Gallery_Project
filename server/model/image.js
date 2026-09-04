import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 80,
    },
description: {
        type: String,
        default: "",
        trim: true,
        maxlength: 240,
    },
tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 5;
            },
            message: "Maximum 5 tags are allowed.",
        },
    },
isFavorite: {
        type: Boolean,
        default: false,
    },
createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Image", imageSchema);