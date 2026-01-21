const mongoose = require("mongoose");

const ServiceVideoSchema = new mongoose.Schema(
  {
    serviceId: {
    //   type: mongoose.Schema.Types.ObjectId,
      type: String,
    //   ref: "Service",
      required: true,
    //   index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["education", "treatment", "awareness", "promo"],
      required: true,
      index: true,
    },

    language: {
      type: String,
      enum: ["en", "ml", "hi"],
      default: "en",
    },

    duration: {
      type: Number, // seconds
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    clinicId: {
    //   type: mongoose.Schema.Types.ObjectId,
    type:String,
    //   ref: "Clinic",
      required: false,
      index: true,
    },

    uploadedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    type:String,
    //   ref: "User", // admin / dentist
      required: false,
    },

    notifyUsers: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceVideo", ServiceVideoSchema);
