const express = require("express");
const router = express.Router();
const {createTestimonial} =require("../controllers/testimonial_controller")
const {getApprovedTestimonials} =require("../controllers/testimonial_controller")
const {getAllTestimonials} =require("../controllers/testimonial_controller")
const {updateApproval} =require("../controllers/testimonial_controller")
const {deleteTestimonial} =require("../controllers/testimonial_controller")


// Public route (no login)
router.get("/public",getApprovedTestimonials);

// User submit testimonial (Login required)
router.post("/createTestimonial", createTestimonial);

// Admin routes
router.get("/getAllTestimonials",getAllTestimonials);
router.put("/:id/approve",updateApproval);
router.delete("/:id",deleteTestimonial);

module.exports = router;
