const Dentist = require("../models/Dentist");

// get all dentist

exports.getAllDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();
    res.json({ success: true, data: dentists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// add new dentist

exports.addDentist = async (req, res) => {
  try {
    const { name, specialization, image, experience, qualification } = req.body;

    // Validate required fields
    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Name and specialization are required",
      });
    }

    // Create new dentist
    const newDentist = new Dentist({
      name,
      specialization,
      image: image || "",
      experience: experience || "",
      qualification: qualification || "",
    });

    const savedDentist = await newDentist.save();

    return res.status(200).json({
      success: true,
      message: "Dentist added successfully",
      data: savedDentist,
    });
  } catch (error) {
    console.error("Add Dentist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Add More Info to Dentist
exports.addMoreInfo = async (req, res) => {
  try {
    const { dentistId } = req.body;

    if (!dentistId) {
      return res.status(400).json({
        success: false,
        message: "dentistId is required",
      });
    }

    const updateData = {
      biography: req.body.biography,
      availableDays: req.body.availableDays,
      consultationTimings: req.body.consultationTimings,
      languagesKnown: req.body.languagesKnown,
      awards: req.body.awards,
      specialProcedures: req.body.specialProcedures,
      website: req.body.website,
      roomLocation: req.body.roomLocation,
    };

    const updatedDentist = await Dentist.findByIdAndUpdate(
      dentistId,
      updateData,
      { new: true }
    );

    if (!updatedDentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "More information added successfully",
      data: updatedDentist,
    });

  } catch (error) {
    console.error("Add More Info Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete a dentist

exports.deleteDentist = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDentist = await Dentist.findByIdAndDelete(id);

    if (!deletedDentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    res.json({
      success: true,
      message: "Dentist deleted successfully",
      deleted: deletedDentist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update dentist details

exports.updateDentist = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Dentist.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        specialization: req.body.specialization,
        image: req.body.image,
        experience: req.body.experience,
        qualification: req.body.qualification,

        // --- MORE INFO FIELDS (optional) ---
        biography: req.body.biography,
        availableDays: req.body.availableDays,
        consultationTimings: req.body.consultationTimings,
        languagesKnown: req.body.languagesKnown,
        awards: req.body.awards,
        specialProcedures: req.body.specialProcedures,
        website: req.body.website,
        roomLocation: req.body.roomLocation,
      },
      { new: true } // returns updated doc
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Dentist not found" });
    }

    res.json({
      success: true,
      message: "Dentist updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

