const Patient = require("../models/User");
const { Parser } = require("json2csv");


exports.exportPatientsData = async (req, res) => {
  try {
    const patients = await Patient.find().lean();

    // const fields = [
    //   { label: "Name", value: "name" },
    //   { label: "Phone", value: "phone" },
    //   { label: "Email", value: "email" },
    //   { label: "Gender", value: "gender" },
    //   {
    //     label: "Created At",
    //     value: row =>
    //       row.createdAt
    //         ? new Date(row.createdAt).toLocaleDateString("en-IN")
    //         : ""
    //   }
    // ];

    const fields = [
  { label: "Name", value: row => row.name || "-" },
  { label: "Phone", value: row => row.phone || "-" },
  { label: "Email", value: row => row.email || "-" },
  { label: "Gender", value: row => row.gender || "-" },
  {
    label: "Created At",
    value: row =>
      row.createdAt
        ? new Date(row.createdAt).toLocaleDateString("en-IN")
        : "-"
  }
];

    const parser = new Parser({ fields });
    const csv = parser.parse(patients);

    res.status(200);
    res.header("Content-Type", "text/csv");
    res.attachment("patients.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    return res.status(500).json({ message: "Export failed" });
  }
};
