
const User = require("../models/User");


// get all patients

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find();
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add More Info of patients
exports.addMorePatientInfo = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const updateData = {
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      dob: req.body.dob,
      bloodGroup: req.body.bloodGroup,
      weight: req.body.weight,
      height: req.body.height,
      lastVisitDate: req.body.lastVisitDate,
    };

    const updatedPatient = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "More patient information added successfully",
      data: updatedPatient,
    });

  } catch (error) {
    console.error("Add More Info Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete patient

exports.deletePatient = async (req, res) => {
  console.log("delete patient api called..");
  try {
    const { id } = req.params;

    const deletedPatient = await User.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient deleted successfully",
      deleted: deletedPatient,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update dentist details

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        specialization: req.body.specialization,
        image: req.body.image,
        experience: req.body.experience,
        qualification: req.body.qualification,

        // --- MORE INFO FIELDS (optional) ---
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        dob: req.body.dob,
        bloodGroup: req.body.bloodGroup,
        weight: req.body.weight,
        height: req.body.height,
        lastVisitDate: req.body.lastVisitDate,
      },
      { new: true } // returns updated doc
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// user profile

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

